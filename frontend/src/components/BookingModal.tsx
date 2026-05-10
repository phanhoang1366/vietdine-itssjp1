'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface BookingModalProps {
  restaurantId: number;
  restaurantName: string;
  maxSeats?: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({
  restaurantId,
  restaurantName,
  maxSeats,
  isOpen,
  onClose,
}: BookingModalProps) {
  const { isAuthenticated } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError(t.booking_modal_login_req);
      return;
    }

    if (!date || !time) {
      setError(t.booking_modal_date_req);
      return;
    }

    const revDatetime = `${date}T${time}:00`;
    const dateObj = new Date(revDatetime);

    if (dateObj <= new Date()) {
      setError(t.booking_modal_future_req);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          restaurantId,
          revDatetime,
          guestCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || t.booking_modal_fail);
        return;
      }

      setSuccess(true);
    } catch {
      setError(t.booking_modal_network_err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDate('');
    setTime('');
    setGuestCount(2);
    setError('');
    setSuccess(false);
    onClose();
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="booking-modal-overlay" onClick={handleClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="booking-success">
            <div className="success-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h2>{t.booking_modal_success_title}</h2>
            <p>
              {restaurantName} {t.booking_modal_success_desc1}
              <br />
              {t.booking_modal_success_desc2}
            </p>
            <div className="success-details">
              <div className="success-detail-item">
                <span className="material-symbols-outlined">calendar_month</span>
                <span>{date}</span>
              </div>
              <div className="success-detail-item">
                <span className="material-symbols-outlined">schedule</span>
                <span>{time}</span>
              </div>
              <div className="success-detail-item">
                <span className="material-symbols-outlined">group</span>
                <span>{guestCount}{t.bookings_guests}</span>
              </div>
            </div>
            <div className="booking-form-actions">
              <a href="/bookings" className="booking-btn-primary">
                {t.booking_modal_view_list}
              </a>
              <button type="button" className="booking-btn-secondary" onClick={handleClose}>
                {t.booking_modal_close}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="booking-modal-header">
              <div>
                <h2>{t.booking_modal_title}</h2>
                <p className="booking-restaurant-name">{restaurantName}</p>
              </div>
              <button className="booking-close-btn" onClick={handleClose}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="booking-form" onSubmit={handleSubmit}>
              {error && (
                <div className="booking-error">
                  <span className="material-symbols-outlined">error</span>
                  {error}
                </div>
              )}

              <div className="booking-form-row">
                <div className="booking-form-group">
                  <label>
                    <span className="material-symbols-outlined">calendar_month</span>
                    {t.booking_modal_date} <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={minDate}
                    required
                  />
                </div>
                <div className="booking-form-group">
                  <label>
                    <span className="material-symbols-outlined">schedule</span>
                    {t.booking_modal_time} <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="booking-form-group">
                <label>
                  <span className="material-symbols-outlined">group</span>
                  {t.booking_modal_guests} <span className="required">*</span>
                </label>
                <div className="guest-counter">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    disabled={guestCount <= 1}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="counter-value">{guestCount}{t.bookings_guests}</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setGuestCount(Math.min(maxSeats || 20, guestCount + 1))}
                    disabled={guestCount >= (maxSeats || 20)}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                {maxSeats && (
                  <p className="capacity-hint">{t.booking_modal_max_seats.replace('{max}', maxSeats.toString())}</p>
                )}
              </div>

              <div className="booking-form-actions">
                <button
                  type="submit"
                  className="booking-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mini-spinner" />
                      {t.booking_modal_submitting}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">event_available</span>
                      {t.booking_modal_submit}
                    </>
                  )}
                </button>
                <button type="button" className="booking-btn-secondary" onClick={handleClose}>
                  {t.common_cancel}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
