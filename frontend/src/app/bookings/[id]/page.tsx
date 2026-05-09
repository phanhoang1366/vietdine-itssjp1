'use client';

import { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import NavHeader from '@/components/NavHeader';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import '../bookings.css';

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

interface ReservationDetail {
  id: number;
  revDatetime: string;
  guestCount: number;
  status: string;
  restaurant: {
    id: number;
    name: string;
    imageUrl: string | null;
    address: string;
    ownerId: number;
  };
  user: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
  };
}

export default function BookingChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const reservationId = parseInt(id);
  const { socket } = useSocket();
  const { user } = useAuth();

  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch reservation and messages
  useEffect(() => {
    if (isNaN(reservationId)) return;

    const fetchData = async () => {
      try {
        const [resRes, msgRes] = await Promise.all([
          fetch(`http://localhost:3001/api/bookings/${reservationId}`, {
            credentials: 'include',
          }),
          fetch(`http://localhost:3001/api/chat/${reservationId}/messages`, {
            credentials: 'include',
          }),
        ]);

        if (resRes.ok) {
          const resData = await resRes.json();
          setReservation(resData.reservation);
        }

        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.messages);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Mark messages as read
    fetch(`http://localhost:3001/api/chat/${reservationId}/read`, {
      method: 'PUT',
      credentials: 'include',
    }).catch(() => {});
  }, [reservationId]);

  // Socket.IO events
  useEffect(() => {
    if (!socket || isNaN(reservationId)) return;

    socket.emit('join_reservation', reservationId);

    socket.on('new_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);

      // Mark as read if it's from the other party
      if (message.senderId !== user?.id) {
        socket.emit('mark_read', reservationId);
      }
    });

    socket.on('user_typing', (data: { userId: number; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      socket.emit('leave_reservation', reservationId);
      socket.off('new_message');
      socket.off('user_typing');
    };
  }, [socket, reservationId, user?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (socket) {
      socket.emit('typing', { reservationId, isTyping: true });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { reservationId, isTyping: false });
      }, 2000);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const content = newMessage.trim();
    if (!content) return;

    setNewMessage('');

    // Stop typing indicator
    if (socket) {
      socket.emit('typing', { reservationId, isTyping: false });
    }

    // Send via Socket.IO (preferred) or REST fallback
    if (socket?.connected) {
      socket.emit('send_message', { reservationId, content });
    } else {
      try {
        await fetch(`http://localhost:3001/api/chat/${reservationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ content }),
        });
      } catch (err) {
        console.error('Send message error:', err);
      }
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="chat-page">
        <NavHeader />
        <div className="bookings-loading">
          <div className="spinner" />
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="chat-page">
        <NavHeader />
        <div className="bookings-empty">
          <span className="material-symbols-outlined">error_outline</span>
          <h3>予約が見つかりません</h3>
          <Link href="/bookings">予約一覧に戻る</Link>
        </div>
      </div>
    );
  }

  // Group messages by date
  let lastDate = '';

  return (
    <div className="chat-page">
      <NavHeader />
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header-bar">
          <Link href="/bookings" className="chat-back-btn">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="chat-header-info">
            <h2>{reservation.restaurant.name}</h2>
            <p>
              {new Date(reservation.revDatetime).toLocaleDateString('ja-JP')} ・
              {reservation.guestCount}名 ・
              <span className={`booking-status ${reservation.status === 'Confirmed' ? 'confirmed' : reservation.status === 'Waiting' ? 'waiting' : 'cancelled'}`} style={{ marginLeft: '4px', display: 'inline', padding: '2px 8px', fontSize: '0.72rem' }}>
                {reservation.status === 'Confirmed' ? '確定' : reservation.status === 'Waiting' ? '確認待ち' : 'キャンセル'}
              </span>
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <span className="material-symbols-outlined">chat_bubble_outline</span>
              <p>
                メッセージがまだありません。
                <br />
                お店に質問や要望を送りましょう。
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const msgDate = formatDate(msg.sentAt);
              let showDate = false;
              if (msgDate !== lastDate) {
                showDate = true;
                lastDate = msgDate;
              }

              const isSent = msg.senderId === user?.id;

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="chat-date-divider">{msgDate}</div>
                  )}
                  <div className={`chat-bubble-wrapper ${isSent ? 'sent' : 'received'}`}>
                    <div className="chat-bubble">
                      <div>{msg.messageContent}</div>
                      <div className="chat-bubble-time">{formatTime(msg.sentAt)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="chat-typing-indicator">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
              入力中...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {reservation.status !== 'Cancelled' && (
          <form className="chat-input-bar" onSubmit={sendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder="メッセージを入力..."
              value={newMessage}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!newMessage.trim()}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
