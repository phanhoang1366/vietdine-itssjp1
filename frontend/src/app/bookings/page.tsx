'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavHeader from '@/components/NavHeader';
import { useLanguage } from '@/context/LanguageContext';
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

function formatDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  const loc = locale === 'vi' ? 'vi-VN' : locale === 'en' ? 'en-US' : 'ja-JP';
  return d.toLocaleDateString(loc, {
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

export default function BookingsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, locale } = useLanguage();

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/bookings`, {
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

    if (!confirm(t.bookings_cancel_confirm)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/bookings/${id}/cancel`, {
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

  function getStatusLabel(status: string) {
    switch (status) {
      case 'Confirmed':
        return t.bookings_confirmed;
      case 'Waiting':
        return t.bookings_waiting;
      case 'Cancelled':
        return t.bookings_cancelled;
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

  return (
    <div className="bookings-page">
      <NavHeader />
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>{t.bookings_title}</h1>
          <p>{t.bookings_subtitle}</p>
        </div>

        {isLoading ? (
          <div className="bookings-loading">
            <div className="spinner" />
            <span>{t.bookings_loading}</span>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bookings-empty">
            <span className="material-symbols-outlined">calendar_month</span>
            <h3>{t.bookings_empty}</h3>
            <p>{t.bookings_empty_sub}</p>
            <Link href="/">{t.bookings_find}</Link>
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
                        {formatDate(res.revDatetime, locale)}
                      </span>
                      <span className="booking-card-meta-item">
                        <span className="material-symbols-outlined">schedule</span>
                        {formatTime(res.revDatetime)}
                      </span>
                      <span className="booking-card-meta-item">
                        <span className="material-symbols-outlined">group</span>
                        {res.guestCount}{t.bookings_guests}
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
                        {t.bookings_cancel_btn}
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
