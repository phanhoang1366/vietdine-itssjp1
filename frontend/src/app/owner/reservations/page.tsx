'use client';

import { useEffect, useState } from 'react';
import OwnerSidebar from '@/components/owner/OwnerSidebar';

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

type FilterStatus = 'all' | 'Waiting' | 'Confirmed' | 'Cancelled';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
  };
}

function getStatusClass(status: string) {
  switch (status) {
    case 'Confirmed': return 'status-confirmed';
    case 'Waiting': return 'status-waiting';
    case 'Cancelled': return 'status-cancelled';
    default: return '';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'Confirmed': return '確定済み';
    case 'Waiting': return '確認待ち';
    case 'Cancelled': return 'キャンセル';
    default: return status;
  }
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');

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
      }
    } catch (err) {
      console.error('Reservations fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const filteredReservations = filter === 'all'
    ? reservations
    : reservations.filter((r) => r.status === filter);

  const counts = {
    all: reservations.length,
    Waiting: reservations.filter((r) => r.status === 'Waiting').length,
    Confirmed: reservations.filter((r) => r.status === 'Confirmed').length,
    Cancelled: reservations.filter((r) => r.status === 'Cancelled').length,
  };

  return (
    <div className="owner-layout">
      <OwnerSidebar />
      <main className="owner-main">
        <div className="owner-topbar">
          <h1>予約管理</h1>
          <div className="topbar-actions">
            <button className="topbar-btn">
              <span className="material-symbols-outlined">language</span>
            </button>
            <button className="topbar-btn">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>

        <div className="owner-content">
          {/* Filter Tabs */}
          <div className="filter-tabs">
            {([
              { key: 'all', label: 'すべて' },
              { key: 'Waiting', label: '確認待ち' },
              { key: 'Confirmed', label: '確定済み' },
              { key: 'Cancelled', label: 'キャンセル' },
            ] as { key: FilterStatus; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}（{counts[tab.key]}）
              </button>
            ))}
          </div>

          <div className="data-table-wrapper">
            {isLoading ? (
              <div className="owner-loading">
                <div className="spinner" />
                <span>読み込み中...</span>
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined">event_busy</span>
                <h3>予約がありません</h3>
                <p>該当する予約がまだありません</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>お客様</th>
                    <th>日時</th>
                    <th>人数</th>
                    <th>ステータス</th>
                    <th style={{ width: '160px' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((rev) => {
                    const dt = formatDateTime(rev.revDatetime);
                    return (
                      <tr key={rev.id}>
                        <td>
                          <div className="dish-cell">
                            <div className="res-avatar">
                              {getInitials(rev.user.fullName)}
                            </div>
                            <div className="dish-names">
                              <p className="dish-name-jp">{rev.user.fullName}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500 }}>{dt.date}</span>
                          <br />
                          <span style={{ fontSize: '0.82rem', color: '#8a7a74' }}>{dt.time}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{rev.guestCount}名</td>
                        <td>
                          <span className={`res-status ${getStatusClass(rev.status)}`}>
                            {getStatusLabel(rev.status)}
                          </span>
                        </td>
                        <td>
                          {rev.status === 'Waiting' && (
                            <div className="table-actions" style={{ gap: '8px' }}>
                              <button
                                className="btn-primary"
                                style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
                                onClick={() => updateStatus(rev.id, 'Confirmed')}
                              >
                                確認する
                              </button>
                              <button
                                className="btn-cancel"
                                style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
                                onClick={() => updateStatus(rev.id, 'Cancelled')}
                              >
                                拒否
                              </button>
                            </div>
                          )}
                          {rev.status !== 'Waiting' && (
                            <span style={{ fontSize: '0.82rem', color: '#8a7a74' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
