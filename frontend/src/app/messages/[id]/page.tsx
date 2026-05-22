'use client';

import { useCallback, useEffect, useRef, useState, use } from 'react';
import Link from 'next/link';
import NavHeader from '@/components/NavHeader';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import '@/app/bookings/bookings.css';

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

interface DirectConversation {
  id: number;
  userId: number;
  restaurant: {
    id: number;
    name: string;
    imageUrl: string | null;
    address: string;
    owner: {
      id: number;
      fullName: string;
      avatarUrl: string | null;
      emailPhone: string;
    };
  };
}

export default function DirectMessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const conversationId = parseInt(id, 10);
  const { socket } = useSocket();
  const { user } = useAuth();
  const { t, locale } = useLanguage();

  const [conversation, setConversation] = useState<DirectConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateMessageInState = useCallback((updated: Message) => {
    setMessages((current) =>
      current.map((message) => (message.id === updated.id ? updated : message))
    );
  }, []);

  useEffect(() => {
    if (Number.isNaN(conversationId)) return;

    async function fetchData() {
      try {
        const [conversationRes, messagesRes] = await Promise.all([
          fetch(`/api/chat/direct/${conversationId}`, { credentials: 'include' }),
          fetch(`/api/chat/direct/${conversationId}/messages`, { credentials: 'include' }),
        ]);

        if (conversationRes.ok) {
          const data = await conversationRes.json();
          setConversation(data.conversation);
        }

        if (messagesRes.ok) {
          const data = await messagesRes.json();
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Direct chat fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    fetch(`/api/chat/direct/${conversationId}/read`, {
      method: 'PUT',
      credentials: 'include',
    }).catch(() => {});
  }, [conversationId]);

  useEffect(() => {
    if (!socket || Number.isNaN(conversationId)) return;

    socket.emit('join_direct_conversation', conversationId);

    const handleNewMessage = (message: Message) => {
      if (message.conversationId !== conversationId) return;
      setMessages((current) => [...current, message]);
      if (message.senderId !== user?.id) {
        socket.emit('mark_direct_read', conversationId);
      }
    };

    const handleMessageUpdated = (message: Message) => {
      if (message.conversationId !== conversationId) return;
      updateMessageInState(message);
    };

    const handleTyping = (data: { userId: number; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on('new_direct_message', handleNewMessage);
    socket.on('message_updated', handleMessageUpdated);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.emit('leave_direct_conversation', conversationId);
      socket.off('new_direct_message', handleNewMessage);
      socket.off('message_updated', handleMessageUpdated);
      socket.off('user_typing', handleTyping);
    };
  }, [socket, conversationId, updateMessageInState, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString(locale === 'ja' ? 'ja-JP' : locale === 'vi' ? 'vi-VN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ja' ? 'ja-JP' : locale === 'vi' ? 'vi-VN' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (socket) {
      socket.emit('direct_typing', { conversationId, isTyping: true });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('direct_typing', { conversationId, isTyping: false });
      }, 2000);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const content = newMessage.trim();
    if (!content) return;

    setNewMessage('');
    socket?.emit('direct_typing', { conversationId, isTyping: false });

    if (socket?.connected) {
      socket.emit('send_direct_message', { conversationId, content });
      return;
    }

    try {
      const res = await fetch(`/api/chat/direct/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((current) => [...current, data.message]);
      }
    } catch (error) {
      console.error('Direct send error:', error);
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

  if (isLoading) {
    return (
      <div className="chat-page">
        <NavHeader />
        <div className="bookings-loading">
          <div className="spinner" />
          <span>{t.common_loading}</span>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="chat-page">
        <NavHeader />
        <div className="bookings-empty">
          <span className="material-symbols-outlined">error_outline</span>
          <h3>{t.bookings_not_found}</h3>
          <Link href="/">{t.nav_home}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <NavHeader />
      <div className="chat-container">
        <div className="chat-header-bar">
          <Link href={`/restaurant/${conversation.restaurant.id}`} className="chat-back-btn">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="chat-header-info">
            <h2>{conversation.restaurant.name}</h2>
            <p>{conversation.restaurant.owner.fullName} ・ {conversation.restaurant.owner.emailPhone}</p>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <span className="material-symbols-outlined">chat_bubble_outline</span>
              <p>
                {t.owner_chat_no_messages}
                <br />
                {t.bookings_chat_empty_sub}
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const msgDate = formatDate(message.sentAt);
              const showDate = msgDate !== lastDate;
              lastDate = msgDate;
              const isSent = message.senderId === user?.id;

              return (
                <div key={message.id}>
                  {showDate && <div className="chat-date-divider">{msgDate}</div>}
                  <div className={`chat-bubble-wrapper ${isSent ? 'sent' : 'received'}`}>
                    <div className="chat-bubble">
                      {message.isRetracted ? (
                        <div className="chat-retracted">{t.chat_retracted}</div>
                      ) : editingId === message.id ? (
                        <div className="chat-edit-box">
                          <input
                            value={editingContent}
                            onChange={(event) => setEditingContent(event.target.value)}
                          />
                          <div className="chat-message-actions">
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
                      <div className="chat-bubble-time">
                        {formatTime(message.sentAt)}
                        {message.editedAt && !message.isRetracted ? ` ・ ${t.chat_edited}` : ''}
                      </div>
                      {isSent && !message.isRetracted && editingId !== message.id && (
                        <div className="chat-message-actions">
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
            <div className="chat-typing-indicator">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
              {t.owner_chat_typing}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-bar" onSubmit={sendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder={t.owner_chat_input_placeholder}
            value={newMessage}
            onChange={handleInputChange}
          />
          <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
