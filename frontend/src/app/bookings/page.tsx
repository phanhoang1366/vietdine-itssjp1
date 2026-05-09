'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavHeader from '@/components/NavHeader';
import './bookings.css';

interface Reservation {
  id: number;
  restaurantId: number;
  revDatetime: string;
  guestCount: number;
  status: 'Waiting' | 'Confirmed' | 'Cancelled';
  restaurant: {
    name: string;
    imageUrl: string | null;
    address: string;
    openingHours: string | null;
  };
  _count: { messages: number };
  unreadCount: number;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'Confirmed':
      return '確定済み';
    case 'Waiting':
      return '確認待ち';
    case 'Cancelled':
      return 'キャンセル';
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'Confirmed':
      return 'confirmed';
    case 'Waiting':
      return 'waiting';
    case 'Cancelled':
      return 'cancelled';
    default:
      return '';
  }
}

export default function BookingsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/bookings', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations);
      }
    } catch (err) {
      console.error('Bookings fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('予約をキャンセルしますか？')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/bookings/${id}/cancel`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  return (
    <div className="bookings-page">
      <NavHeader />
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>予約管理</h1>
          <p>あなたの予約一覧と店舗とのチャットを確認できます</p>
        </div>

        {isLoading ? (
          <div className="bookings-loading">
            <div className="spinner" />
            <span>読み込み中...</span>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bookings-empty">
            <span className="material-symbols-outlined">calendar_month</span>
            <h3>予約がありません</h3>
            <p>レストランを探して予約してみましょう</p>
            <Link href="/">レストランを探す</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {reservations.map((res) => (
              <Link
                key={res.id}
                href={`/bookings/${res.id}`}
                className="booking-card"
              >
                <div className="booking-card-body">
                  <div className="booking-card-icon">
                    <span className="material-symbols-outlined">restaurant</span>
                  </div>
                  <div className="booking-card-info">
                    <div className="booking-card-restaurant">
                      {res.restaurant.name}
                    </div>
                    <div className="booking-card-meta">
                      <span className="booking-card-meta-item">
                        <span className="material-symbols-outlined">calendar_month</span>
                        {formatDate(res.revDatetime)}
                      </span>
                      <span className="booking-card-meta-item">
                        <span className="material-symbols-outlined">schedule</span>
                        {formatTime(res.revDatetime)}
                      </span>
                      <span className="booking-card-meta-item">
                        <span className="material-symbols-outlined">group</span>
                        {res.guestCount}名
                      </span>
                    </div>
                  </div>
                  <div className="booking-card-right">
                    <span className={`booking-status ${getStatusClass(res.status)}`}>
                      {getStatusLabel(res.status)}
                    </span>
                    {res.unreadCount > 0 && (
                      <span className="unread-badge">
                        <span className="material-symbols-outlined">chat</span>
                        {res.unreadCount}
                      </span>
                    )}
                    {res.status === 'Waiting' && (
                      <button
                        className="booking-card-cancel"
                        onClick={(e) => cancelBooking(e, res.id)}
                      >
                        キャンセル
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
