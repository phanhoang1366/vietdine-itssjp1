'use client';

import { useEffect, useState, useRef } from 'react';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';

interface Reservation {
  id: number;
  userId: number;
  revDatetime: string;
  guestCount: number;
  status: 'Waiting' | 'Confirmed' | 'Cancelled';
  user: {
    fullName: string;
    avatarUrl: string | null;
  };
}

interface Message {
  id: number;
  reservationId: number;
  senderId: number;
  messageContent: string;
  sentAt: string;
  isRead: boolean;
  sender: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
  };
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'Confirmed': return '確定';
    case 'Waiting': return '保留中';
    case 'Cancelled': return 'キャンセル';
    default: return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'Confirmed': return 'status-confirmed';
    case 'Waiting': return 'status-waiting';
    case 'Cancelled': return 'status-cancelled';
    default: return '';
  }
}

export default function OwnerChatPage() {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevSelectedIdRef = useRef<number | null>(null);

  // Fetch reservations
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/owner/reservations', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations);

        // Fetch unread counts for each reservation
        const counts: Record<number, number> = {};
        await Promise.all(
          data.reservations.map(async (r: Reservation) => {
            try {
              const msgRes = await fetch(
                `http://localhost:3001/api/chat/${r.id}/messages`,
                { credentials: 'include' }
              );
              if (msgRes.ok) {
                const msgData = await msgRes.json();
                const unread = msgData.messages.filter(
                  (m: Message) => m.senderId !== user?.id && !m.isRead
                ).length;
                if (unread > 0) counts[r.id] = unread;
              }
            } catch {}
          })
        );
        setUnreadCounts(counts);
      }
    } catch (err) {
      console.error('Reservations fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages when selecting a reservation
  useEffect(() => {
    if (selectedId === null) return;

    // Leave previous room
    if (socket && prevSelectedIdRef.current !== null && prevSelectedIdRef.current !== selectedId) {
      socket.emit('leave_reservation', prevSelectedIdRef.current);
    }
    prevSelectedIdRef.current = selectedId;

    setIsChatLoading(true);
    setMessages([]);
    setIsTyping(false);

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/chat/${selectedId}/messages`,
          { credentials: 'include' }
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }

        // Mark as read
        await fetch(`http://localhost:3001/api/chat/${selectedId}/read`, {
          method: 'PUT',
          credentials: 'include',
        });

        // Clear unread count
        setUnreadCounts((prev) => {
          const next = { ...prev };
          delete next[selectedId];
          return next;
        });
      } catch (err) {
        console.error('Messages fetch error:', err);
      } finally {
        setIsChatLoading(false);
      }
    };

    fetchMessages();

    // Join Socket.IO room
    if (socket) {
      socket.emit('join_reservation', selectedId);
    }
  }, [selectedId, socket]);

  // Socket.IO events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (message.reservationId === selectedId) {
        setMessages((prev) => [...prev, message]);
        // Mark as read immediately
        if (message.senderId !== user?.id) {
          socket.emit('mark_read', selectedId);
        }
      } else {
        // Update unread counts for other conversations
        setUnreadCounts((prev) => ({
          ...prev,
          [message.reservationId]: (prev[message.reservationId] || 0) + 1,
        }));
      }
    };

    const handleTyping = (data: { userId: number; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
    };
  }, [socket, selectedId, user?.id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (socket && selectedId) {
      socket.emit('typing', { reservationId: selectedId, isTyping: true });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { reservationId: selectedId, isTyping: false });
      }, 2000);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage('');

    if (socket) {
      socket.emit('typing', { reservationId: selectedId, isTyping: false });
    }

    if (socket?.connected) {
      socket.emit('send_message', { reservationId: selectedId, content });
    } else {
      try {
        const res = await fetch(
          `http://localhost:3001/api/chat/${selectedId}/messages`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ content }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (err) {
        console.error('Send error:', err);
      }
    }
  };

  // Update reservation status
  const updateStatus = async (id: number, status: 'Confirmed' | 'Cancelled') => {
    try {
      const res = await fetch(`http://localhost:3001/api/owner/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchReservations();
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // Filter reservations
  const filteredReservations = reservations.filter((r) =>
    r.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedReservation = reservations.find((r) => r.id === selectedId);

  let lastDate = '';

  return (
    <div className="owner-layout">
      <OwnerSidebar />
      <main className="owner-main">
        <div className="owner-topbar">
          <h1>予約・チャット管理</h1>
          <div className="topbar-actions">
            <button className="topbar-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>

        <div className="chat-split-layout">
          {/* Left Panel: Reservation List */}
          <div className="chat-list-panel">
            <div className="chat-list-header">
              <div className="chat-search-box">
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder="予約番号、または顧客名で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="chat-list-subheader">
              <h2>予約一覧</h2>
              <span className="chat-list-count">{filteredReservations.length}件</span>
            </div>

            <div className="chat-conversation-list">
              {isLoading ? (
                <div className="owner-loading" style={{ minHeight: '200px' }}>
                  <div className="spinner" />
                </div>
              ) : filteredReservations.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 16px' }}>
                  <span className="material-symbols-outlined">event_busy</span>
                  <h3>予約がありません</h3>
                </div>
              ) : (
                filteredReservations.map((res) => (
                  <div
                    key={res.id}
                    className={`chat-conversation-item ${selectedId === res.id ? 'active' : ''}`}
                    onClick={() => setSelectedId(res.id)}
                  >
                    <div className="conv-avatar">
                      {getInitials(res.user.fullName)}
                      {unreadCounts[res.id] && (
                        <span className="conv-unread-dot" />
                      )}
                    </div>
                    <div className="conv-info">
                      <div className="conv-name">{res.user.fullName}</div>
                      <div className="conv-meta">
                        {formatDate(res.revDatetime)} {formatTime(res.revDatetime)} ・ {res.guestCount}名
                      </div>
                    </div>
                    <div className="conv-right">
                      <span className={`res-status ${getStatusClass(res.status)}`}>
                        {getStatusLabel(res.status)}
                      </span>
                      {unreadCounts[res.id] && (
                        <span className="conv-unread-count">{unreadCounts[res.id]}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Chat */}
          <div className="chat-detail-panel">
            {selectedId === null ? (
              <div className="chat-detail-empty">
                <span className="material-symbols-outlined">forum</span>
                <h3>チャットを選択</h3>
                <p>左側の予約一覧からチャットを開始してください</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="chat-detail-header">
                  <div className="chat-detail-user">
                    <div className="conv-avatar" style={{ width: '44px', height: '44px', fontSize: '0.9rem' }}>
                      {selectedReservation
                        ? getInitials(selectedReservation.user.fullName)
                        : '?'}
                    </div>
                    <div>
                      <div className="chat-detail-name">
                        {selectedReservation?.user.fullName || ''}様
                      </div>
                      <div className="chat-detail-status">
                        <span className="online-dot" /> オンライン
                      </div>
                    </div>
                  </div>

                  {selectedReservation?.status === 'Waiting' && (
                    <div className="chat-detail-actions">
                      <button
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '8px' }}
                        onClick={() => updateStatus(selectedId, 'Confirmed')}
                      >
                        確認する
                      </button>
                      <button
                        className="btn-cancel"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '8px' }}
                        onClick={() => updateStatus(selectedId, 'Cancelled')}
                      >
                        拒否
                      </button>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="chat-detail-messages">
                  {isChatLoading ? (
                    <div className="owner-loading" style={{ minHeight: '200px' }}>
                      <div className="spinner" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="chat-detail-empty-msg">
                      <span className="material-symbols-outlined">chat_bubble_outline</span>
                      <p>まだメッセージがありません</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const msgDate = new Date(msg.sentAt).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                      });
                      let showDate = false;
                      if (msgDate !== lastDate) {
                        showDate = true;
                        lastDate = msgDate;
                      }

                      const isSent = msg.senderId === user?.id;

                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="chat-date-divider" style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8a7a74', margin: '16px 0 8px' }}>
                              {msgDate}
                            </div>
                          )}
                          <div className={`owner-chat-bubble-wrapper ${isSent ? 'sent' : 'received'}`}>
                            <div className={`owner-chat-bubble ${isSent ? 'sent' : 'received'}`}>
                              <div>{msg.messageContent}</div>
                              <div className="owner-chat-time">{formatTime(msg.sentAt)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {isTyping && (
                    <div className="chat-typing-indicator" style={{ padding: '8px 0', fontSize: '0.82rem', color: '#8a7a74' }}>
                      <div className="typing-dots" style={{ display: 'flex', gap: '3px' }}>
                        <span style={{ width: 6, height: 6, background: '#8a7a74', borderRadius: '50%', animation: 'typingBounce 1.4s infinite' }} />
                        <span style={{ width: 6, height: 6, background: '#8a7a74', borderRadius: '50%', animation: 'typingBounce 1.4s infinite 0.2s' }} />
                        <span style={{ width: 6, height: 6, background: '#8a7a74', borderRadius: '50%', animation: 'typingBounce 1.4s infinite 0.4s' }} />
                      </div>
                      入力中...
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {selectedReservation?.status !== 'Cancelled' && (
                  <form className="chat-detail-input" onSubmit={sendMessage}>
                    <button type="button" className="chat-attach-btn">
                      <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <input
                      type="text"
                      placeholder="メッセージを入力..."
                      value={newMessage}
                      onChange={handleInputChange}
                    />
                    <button
                      type="submit"
                      className="chat-detail-send-btn"
                      disabled={!newMessage.trim()}
                    >
                      送信
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
