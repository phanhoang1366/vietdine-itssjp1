'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import StatCard from '@/components/owner/StatCard';

interface DashboardData {
  restaurant: any;
  stats: {
    totalReservations: number;
    averageRating: number;
    reviewCount: number;
    satisfaction: number;
    activePromotion: any;
    recentReservations: any[];
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `本日 ${timeStr}`;
  if (isTomorrow) return `明日 ${timeStr}`;
  return `${date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} ${timeStr}`;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
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

export default function OwnerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/owner/dashboard', {
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="owner-layout">
        <OwnerSidebar />
        <main className="owner-main">
          <div className="owner-loading">
            <div className="spinner" />
            <span>読み込み中...</span>
          </div>
        </main>
      </div>
    );
  }

  const restaurant = data?.restaurant;
  const stats = data?.stats;

  return (
    <div className="owner-layout">
      <OwnerSidebar />
      <main className="owner-main">
        {/* Top Bar */}
        <div className="owner-topbar">
          <h1>オーナー管理パネル</h1>
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
          {/* Stats */}
          <div className="stats-grid">
            <StatCard
              icon="event_note"
              value={stats?.totalReservations?.toString() || '0'}
              label="総予約数"
              trend="+12%"
              trendUp={true}
            />
            <StatCard
              icon="payments"
              value="45.2M ₫"
              label="週次売上"
              trend="+8%"
              trendUp={true}
            />
            <StatCard
              icon="star"
              value={`${stats?.averageRating || 0}/5.0`}
              label={`${stats?.satisfaction || 0}%`}
              trend=""
            />
          </div>

          {/* Active Promotion Banner */}
          {stats?.activePromotion && (
            <div className="promo-banner">
              <p className="promo-banner-label">実施中のプロモーション</p>
              <p className="promo-banner-title">
                {stats.activePromotion.title} - {stats.activePromotion.discountPercent}% OFF
              </p>
              <Link href="/owner/promotions" className="promo-banner-btn">
                更新する
              </Link>
            </div>
          )}

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Recent Reservations */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2>最近の予約</h2>
                <Link href="/owner/reservations" className="section-link">
                  すべて表示
                </Link>
              </div>
              <div className="reservation-list">
                {stats?.recentReservations && stats.recentReservations.length > 0 ? (
                  stats.recentReservations.map((rev: any) => (
                    <div key={rev.id} className="reservation-item">
                      <div className="res-avatar">
                        {getInitials(rev.user.fullName)}
                      </div>
                      <div className="res-details">
                        <p className="res-name">{rev.user.fullName}</p>
                        <p className="res-meta">
                          {rev.guestCount}名様 • {formatDate(rev.revDatetime)}
                        </p>
                      </div>
                      <span className={`res-status ${getStatusClass(rev.status)}`}>
                        {getStatusLabel(rev.status)}
                      </span>
                      <button className="res-actions-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <h3>予約はまだありません</h3>
                    <p>新しい予約が入ると、ここに表示されます</p>
                  </div>
                )}
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2>店舗情報</h2>
              </div>
              <div className="restaurant-info">
                {restaurant?.imageUrl && (
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="restaurant-image"
                  />
                )}
                {!restaurant?.imageUrl && (
                  <div className="restaurant-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a7a74' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>storefront</span>
                  </div>
                )}

                <div className="info-item">
                  <span className="info-label">所在地</span>
                  <span className="info-value">{restaurant?.address || '未設定'}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">営業時間</span>
                  <span className="info-value">{restaurant?.openingHours || '未設定'}</span>
                </div>

                {restaurant?.categories && (
                  <div className="info-item">
                    <span className="info-label">料理カテゴリー</span>
                    <div className="info-tags">
                      {restaurant.categories.split(',').map((cat: string, i: number) => (
                        <span key={i} className="info-tag">{cat.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="info-item">
                  <span className="info-label">最大席数</span>
                  <span className="info-seats">
                    {restaurant?.maxSeats || '—'} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#5a4a44' }}>席</span>
                  </span>
                </div>

                <button className="edit-profile-btn">
                  プロフィール詳細を編集
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
