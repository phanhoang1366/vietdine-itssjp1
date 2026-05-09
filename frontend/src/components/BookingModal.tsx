'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('予約するにはログインが必要です');
      return;
    }

    if (!date || !time) {
      setError('日付と時間を選択してください');
      return;
    }

    const revDatetime = `${date}T${time}:00`;
    const dateObj = new Date(revDatetime);

    if (dateObj <= new Date()) {
      setError('予約日時は未来の日時を指定してください');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:3001/api/bookings', {
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
        setError(data.message || '予約に失敗しました');
        return;
      }

      setSuccess(true);
    } catch {
      setError('通信エラーが発生しました');
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
            <h2>予約を受け付けました</h2>
            <p>
              {restaurantName} への予約リクエストが送信されました。
              <br />
              店舗からの確認をお待ちください。
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
                <span>{guestCount}名</span>
              </div>
            </div>
            <div className="booking-form-actions">
              <a href="/bookings" className="booking-btn-primary">
                予約一覧を確認
              </a>
              <button type="button" className="booking-btn-secondary" onClick={handleClose}>
                閉じる
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="booking-modal-header">
              <div>
                <h2>予約する</h2>
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
                    日付 <span className="required">*</span>
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
                    時間 <span className="required">*</span>
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
                  人数 <span className="required">*</span>
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
                  <span className="counter-value">{guestCount}名</span>
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
                  <p className="capacity-hint">最大{maxSeats}席まで</p>
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
                      送信中...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">event_available</span>
                      予約を確定する
                    </>
                  )}
                </button>
                <button type="button" className="booking-btn-secondary" onClick={handleClose}>
                  キャンセル
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
