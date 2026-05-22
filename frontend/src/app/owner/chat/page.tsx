'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

type ThreadType = 'reservation' | 'direct';

interface Reservation {
  id: number;
  userId: number;
  revDatetime: string;
  guestCount: number;
  status: 'Waiting' | 'Confirmed' | 'Cancelled';
  user: {
    fullName: string;
    emailPhone: string;
    avatarUrl: string | null;
  };
}

interface DirectConversation {
  id: number;
  userId: number;
  updatedAt: string;
  unreadCount: number;
  user: {
    id: number;
    fullName: string;
    emailPhone: string;
    avatarUrl: string | null;
  };
  restaurant: {
    id: number;
    name: string;
  };
  messages: Message[];
}

interface Message {
  id: number;
  reservationId: number | null;
  conversationId: number | null;
  senderId: number;
  messageContent: string;
  sentAt: string;
  editedAt: string | null;
  isRead: boolean;
  isRetracted: boolean;
  sender: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
  };
}

interface ChatThread {
  type: ThreadType;
  id: number;
  title: string;
  contact: string;
  meta: string;
  status?: Reservation['status'];
  unreadCount: number;
}

type StatusText = {
  owner_res_action_confirm: string;
  owner_res_action_reject: string;
  owner_res_status_confirmed: string;
  owner_res_status_waiting: string;
  owner_res_status_cancelled: string;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'ja' ? 'ja-JP' : locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatTime(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleTimeString(locale === 'ja' ? 'ja-JP' : locale === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusLabel(status: string, t: StatusText) {
  switch (status) {
    case 'Confirmed': return t.owner_res_status_confirmed;
    case 'Waiting': return t.owner_res_status_waiting;
    case 'Cancelled': return t.owner_res_status_cancelled;
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

function threadKey(type: ThreadType, id: number) {
  return `${type}:${id}`;
}

export default function OwnerChatPage() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const { t, locale } = useLanguage();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [directConversations, setDirectConversations] = useState<DirectConversation[]>([]);
  const [selected, setSelected] = useState<{ type: ThreadType; id: number } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevSelectedRef = useRef<{ type: ThreadType; id: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateMessageInState = useCallback((updated: Message) => {
    setMessages((current) =>
      current.map((message) => (message.id === updated.id ? updated : message))
    );
  }, []);

  const fetchThreads = useCallback(async () => {
    try {
      const [reservationRes, directRes] = await Promise.all([
        fetch('/api/owner/reservations', { credentials: 'include' }),
        fetch('/api/chat/direct/conversations', { credentials: 'include' }),
      ]);

      const counts: Record<string, number> = {};

      if (reservationRes.ok) {
        const data = await reservationRes.json();
        setReservations(data.reservations);

        await Promise.all(
          data.reservations.map(async (reservation: Reservation) => {
            try {
              const msgRes = await fetch(`/api/chat/${reservation.id}/messages`, {
                credentials: 'include',
              });
              if (msgRes.ok) {
                const msgData = await msgRes.json();
                const unread = msgData.messages.filter(
                  (message: Message) => message.senderId !== user?.id && !message.isRead
                ).length;
                if (unread > 0) counts[threadKey('reservation', reservation.id)] = unread;
              }
            } catch {}
          })
        );
      }

      if (directRes.ok) {
        const data = await directRes.json();
        setDirectConversations(data.conversations);
        data.conversations.forEach((conversation: DirectConversation) => {
          if (conversation.unreadCount > 0) {
            counts[threadKey('direct', conversation.id)] = conversation.unreadCount;
          }
        });
      }

      setUnreadCounts(counts);
    } catch (err) {
      console.error('Owner chat fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const threads = useMemo<ChatThread[]>(() => {
    const reservationThreads = reservations.map((reservation) => ({
      type: 'reservation' as const,
      id: reservation.id,
      title: reservation.user.fullName,
      contact: reservation.user.emailPhone,
      meta: `${formatDate(reservation.revDatetime, locale)} ${formatTime(reservation.revDatetime, locale)} ・ ${t.owner_res_guests_label.replace('{count}', reservation.guestCount.toString())}`,
      status: reservation.status,
      unreadCount: unreadCounts[threadKey('reservation', reservation.id)] || 0,
    }));

    const directThreads = directConversations.map((conversation) => ({
      type: 'direct' as const,
      id: conversation.id,
      title: conversation.user.fullName,
      contact: conversation.user.emailPhone,
      meta: conversation.messages[0]?.messageContent || conversation.restaurant.name,
      unreadCount: unreadCounts[threadKey('direct', conversation.id)] || 0,
    }));

    return [...directThreads, ...reservationThreads];
  }, [directConversations, locale, reservations, t.owner_res_guests_label, unreadCounts]);

  const filteredThreads = threads.filter((thread) =>
    `${thread.id} ${thread.title} ${thread.contact} ${thread.meta}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedReservation = selected?.type === 'reservation'
    ? reservations.find((reservation) => reservation.id === selected.id)
    : null;
  const selectedConversation = selected?.type === 'direct'
    ? directConversations.find((conversation) => conversation.id === selected.id)
    : null;
  const selectedThread = selected
    ? threads.find((thread) => thread.type === selected.type && thread.id === selected.id)
    : null;

  useEffect(() => {
    if (!selected) return;

    if (
      socket &&
      prevSelectedRef.current &&
      (prevSelectedRef.current.type !== selected.type || prevSelectedRef.current.id !== selected.id)
    ) {
      if (prevSelectedRef.current.type === 'reservation') {
        socket.emit('leave_reservation', prevSelectedRef.current.id);
      } else {
        socket.emit('leave_direct_conversation', prevSelectedRef.current.id);
      }
    }
    prevSelectedRef.current = selected;

    setIsChatLoading(true);
    setMessages([]);
    setIsTyping(false);
    setEditingId(null);

    async function fetchMessages() {
      const isReservation = selected?.type === 'reservation';
      const messagesUrl = isReservation
        ? `/api/chat/${selected?.id}/messages`
        : `/api/chat/direct/${selected?.id}/messages`;
      const readUrl = isReservation
        ? `/api/chat/${selected?.id}/read`
        : `/api/chat/direct/${selected?.id}/read`;

      try {
        const res = await fetch(messagesUrl, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }

        await fetch(readUrl, {
          method: 'PUT',
          credentials: 'include',
        });

        setUnreadCounts((prev) => {
          const next = { ...prev };
          delete next[threadKey(selected!.type, selected!.id)];
          return next;
        });
      } catch (err) {
        console.error('Messages fetch error:', err);
      } finally {
        setIsChatLoading(false);
      }
    }

    fetchMessages();

    if (socket) {
      if (selected.type === 'reservation') {
        socket.emit('join_reservation', selected.id);
      } else {
        socket.emit('join_direct_conversation', selected.id);
      }
    }
  }, [selected, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleReservationMessage = (message: Message) => {
      if (message.reservationId === selected?.id && selected?.type === 'reservation') {
        setMessages((prev) => [...prev, message]);
        if (message.senderId !== user?.id) socket.emit('mark_read', selected.id);
        return;
      }

      if (message.reservationId) {
        const key = threadKey('reservation', message.reservationId);
        setUnreadCounts((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
      }
    };

    const handleDirectMessage = (message: Message) => {
      if (message.conversationId === selected?.id && selected?.type === 'direct') {
        setMessages((prev) => [...prev, message]);
        if (message.senderId !== user?.id) socket.emit('mark_direct_read', selected.id);
        return;
      }

      if (message.conversationId) {
        const key = threadKey('direct', message.conversationId);
        setUnreadCounts((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
        fetchThreads();
      }
    };

    const handleMessageUpdated = (message: Message) => {
      const belongsToSelected =
        (selected?.type === 'reservation' && message.reservationId === selected.id) ||
        (selected?.type === 'direct' && message.conversationId === selected.id);
      if (belongsToSelected) updateMessageInState(message);
    };

    const handleTyping = (data: { userId: number; isTyping: boolean }) => {
      if (data.userId !== user?.id) setIsTyping(data.isTyping);
    };

    socket.on('new_message', handleReservationMessage);
    socket.on('new_direct_message', handleDirectMessage);
    socket.on('message_updated', handleMessageUpdated);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off('new_message', handleReservationMessage);
      socket.off('new_direct_message', handleDirectMessage);
      socket.off('message_updated', handleMessageUpdated);
      socket.off('user_typing', handleTyping);
    };
  }, [fetchThreads, selected, socket, updateMessageInState, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (socket && selected) {
      if (selected.type === 'reservation') {
        socket.emit('typing', { reservationId: selected.id, isTyping: true });
      } else {
        socket.emit('direct_typing', { conversationId: selected.id, isTyping: true });
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (selected.type === 'reservation') {
          socket.emit('typing', { reservationId: selected.id, isTyping: false });
        } else {
          socket.emit('direct_typing', { conversationId: selected.id, isTyping: false });
        }
      }, 2000);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage('');

    if (socket) {
      if (selected.type === 'reservation') {
        socket.emit('typing', { reservationId: selected.id, isTyping: false });
      } else {
        socket.emit('direct_typing', { conversationId: selected.id, isTyping: false });
      }
    }

    if (socket?.connected) {
      if (selected.type === 'reservation') {
        socket.emit('send_message', { reservationId: selected.id, content });
      } else {
        socket.emit('send_direct_message', { conversationId: selected.id, content });
      }
      return;
    }

    const url = selected.type === 'reservation'
      ? `/api/chat/${selected.id}/messages`
      : `/api/chat/direct/${selected.id}/messages`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setNewMessage((current) => current ? `${current} [${file.name}]` : `[${file.name}]`);
    event.target.value = '';
  };

  const updateStatus = async (id: number, status: 'Confirmed' | 'Cancelled') => {
    try {
      const res = await fetch(`/api/owner/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchThreads();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const startEdit = (message: Message) => {
    setEditingId(message.id);
    setEditingContent(message.messageContent);
  };

  const submitEdit = async (messageId: number) => {
    const content = editingContent.trim();
    if (!content) return;

    setEditingId(null);
    setEditingContent('');

    if (socket?.connected) {
      socket.emit('edit_message', { messageId, content });
      return;
    }

    const res = await fetch(`/api/chat/messages/${messageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const data = await res.json();
      updateMessageInState(data.message);
    }
  };

  const retractMessage = async (messageId: number) => {
    if (!confirm(t.chat_retract_confirm)) return;

    if (socket?.connected) {
      socket.emit('retract_message', messageId);
      return;
    }

    const res = await fetch(`/api/chat/messages/${messageId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      updateMessageInState(data.message);
    }
  };

  let lastDate = '';
  const canSend = selected?.type === 'direct' || selectedReservation?.status !== 'Cancelled';

  return (
    <div className="owner-layout">
      <OwnerSidebar />
      <main className="owner-main">
        <div className="owner-topbar">
          <h1>{t.owner_chat_title}</h1>
          <div className="topbar-actions">
            <button type="button" className="topbar-btn" onClick={() => window.location.href = '/owner/reservations'}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>

        <div className="chat-split-layout">
          <div className="chat-list-panel">
            <div className="chat-list-header">
              <div className="chat-search-box">
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder={t.owner_chat_search_placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="chat-list-subheader">
              <h2>{t.owner_chat_list_title}</h2>
              <span className="chat-list-count">{t.owner_chat_items_count.replace('{count}', filteredThreads.length.toString())}</span>
            </div>

            <div className="chat-conversation-list">
              {isLoading ? (
                <div className="owner-loading" style={{ minHeight: '200px' }}>
                  <div className="spinner" />
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 16px' }}>
                  <span className="material-symbols-outlined">event_busy</span>
                  <h3>{t.owner_chat_list_empty}</h3>
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <div
                    key={threadKey(thread.type, thread.id)}
                    className={`chat-conversation-item ${
                      selected?.type === thread.type && selected.id === thread.id ? 'active' : ''
                    }`}
                    onClick={() => setSelected({ type: thread.type, id: thread.id })}
                  >
                    <div className="conv-avatar">
                      {getInitials(thread.title)}
                      {thread.unreadCount > 0 && <span className="conv-unread-dot" />}
                    </div>
                    <div className="conv-info">
                      <div className="conv-name">{thread.title}</div>
                      <div className="conv-meta">{thread.meta}</div>
                      <div className="conv-contact">{thread.contact}</div>
                    </div>
                    <div className="conv-right">
                      {thread.status ? (
                        <span className={`res-status ${getStatusClass(thread.status)}`}>
                          {getStatusLabel(thread.status, t)}
                        </span>
                      ) : (
                        <span className="res-status status-waiting">{t.rest_contact}</span>
                      )}
                      {thread.unreadCount > 0 && (
                        <span className="conv-unread-count">{thread.unreadCount}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="chat-detail-panel">
            {!selected ? (
              <div className="chat-detail-empty">
                <span className="material-symbols-outlined">forum</span>
                <h3>{t.owner_chat_select_prompt}</h3>
                <p>{t.owner_chat_select_sub}</p>
              </div>
            ) : (
              <>
                <div className="chat-detail-header">
                  <div className="chat-detail-user">
                    <div className="conv-avatar" style={{ width: '44px', height: '44px', fontSize: '0.9rem' }}>
                      {selectedThread ? getInitials(selectedThread.title) : '?'}
                    </div>
                    <div>
                      <div className="chat-detail-name">
                        {selectedThread?.title || ''}{selected?.type === 'reservation' ? t.owner_chat_user_suffix : ''}
                      </div>
                      <div className="chat-detail-status">
                        <span className="online-dot" /> {selected?.type === 'direct' ? selectedConversation?.restaurant.name : t.owner_chat_online}
                      </div>
                      {selectedThread?.contact && (
                        <div className="chat-detail-contact">
                          <span className="material-symbols-outlined">alternate_email</span>
                          {selectedThread.contact}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedReservation?.status === 'Waiting' && (
                    <div className="chat-detail-actions">
                      <button
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '8px' }}
                        onClick={() => updateStatus(selectedReservation.id, 'Confirmed')}
                      >
                        {t.owner_res_action_confirm}
                      </button>
                      <button
                        className="btn-cancel"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '8px' }}
                        onClick={() => updateStatus(selectedReservation.id, 'Cancelled')}
                      >
                        {t.owner_res_action_reject}
                      </button>
                    </div>
                  )}
                </div>

                <div className="chat-detail-messages">
                  {isChatLoading ? (
                    <div className="owner-loading" style={{ minHeight: '200px' }}>
                      <div className="spinner" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="chat-detail-empty-msg">
                      <span className="material-symbols-outlined">chat_bubble_outline</span>
                      <p>{t.owner_chat_no_messages}</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const msgDate = new Date(message.sentAt).toLocaleDateString(locale === 'ja' ? 'ja-JP' : locale === 'vi' ? 'vi-VN' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                      const showDate = msgDate !== lastDate;
                      lastDate = msgDate;
                      const isSent = message.senderId === user?.id;

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="chat-date-divider" style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8a7a74', margin: '16px 0 8px' }}>
                              {msgDate}
                            </div>
                          )}
                          <div className={`owner-chat-bubble-wrapper ${isSent ? 'sent' : 'received'}`}>
                            <div className={`owner-chat-bubble ${isSent ? 'sent' : 'received'}`}>
                              {message.isRetracted ? (
                                <div className="chat-retracted">{t.chat_retracted}</div>
                              ) : editingId === message.id ? (
                                <div className="owner-chat-edit-box">
                                  <input
                                    value={editingContent}
                                    onChange={(event) => setEditingContent(event.target.value)}
                                  />
                                  <div className="owner-chat-message-actions">
                                    <button type="button" onClick={() => submitEdit(message.id)}>
                                      {t.chat_save_edit}
                                    </button>
                                    <button type="button" onClick={() => setEditingId(null)}>
                                      {t.chat_cancel_edit}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>{message.messageContent}</div>
                              )}
                              <div className="owner-chat-time">
                                {formatTime(message.sentAt, locale)}
                                {message.editedAt && !message.isRetracted ? ` ・ ${t.chat_edited}` : ''}
                              </div>
                              {isSent && !message.isRetracted && editingId !== message.id && (
                                <div className="owner-chat-message-actions">
                                  <button type="button" onClick={() => startEdit(message)}>
                                    {t.chat_edit}
                                  </button>
                                  <button type="button" onClick={() => retractMessage(message.id)}>
                                    {t.chat_retract}
                                  </button>
                                </div>
                              )}
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
                      {t.owner_chat_typing}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {canSend && (
                  <form className="chat-detail-input" onSubmit={sendMessage}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileSelected}
                    />
                    <button type="button" className="chat-attach-btn" onClick={() => fileInputRef.current?.click()}>
                      <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <input
                      type="text"
                      placeholder={t.owner_chat_input_placeholder}
                      value={newMessage}
                      onChange={handleInputChange}
                    />
                    <button
                      type="submit"
                      className="chat-detail-send-btn"
                      disabled={!newMessage.trim()}
                    >
                      {t.owner_chat_send}
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
