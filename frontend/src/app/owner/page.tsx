'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import StatCard from '@/components/owner/StatCard';
import { useLanguage } from '@/context/LanguageContext';

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

function formatDate(dateStr: string, t: any, locale: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString(locale === 'ja' ? 'ja-JP' : locale === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `${t.common_today} ${timeStr}`;
  if (isTomorrow) return `${t.common_tomorrow} ${timeStr}`;
  return `${date.toLocaleDateString(locale === 'ja' ? 'ja-JP' : locale === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric' })} ${timeStr}`;
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

function getStatusLabel(status: string, t: any) {
  switch (status) {
    case 'Confirmed': return t.owner_res_action_confirm;
    case 'Waiting': return t.owner_res_tab_all; // or a specific waiting status if available
    case 'Cancelled': return t.owner_res_action_reject;
    default: return status;
  }
}

export default function OwnerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, locale } = useLanguage();

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/owner/dashboard`, {
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
            <span>{t.common_loading}</span>
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
          <h1>{t.owner_dashboard_title}</h1>
          <div className="topbar-actions">
            <button className="topbar-btn">
              <span className="material-symbols-outlined" style={{ fontWeight: 300 }}>language</span>
            </button>
            <button className="topbar-btn">
              <span className="material-symbols-outlined" style={{ fontWeight: 300 }}>account_circle</span>
            </button>
          </div>
        </div>

        <div className="owner-content">
          {/* Stats */}
          <div className="stats-grid">
            <StatCard
              icon="event_note"
              value={stats?.totalReservations?.toString() || '0'}
              label={t.owner_stat_total_res}
              trend="+12%"
              trendUp={true}
            />
            <StatCard
              icon="payments"
              value="45.2M ₫"
              label={t.owner_stat_weekly_sales}
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
              <p className="promo-banner-label">{t.owner_promo_active_label}</p>
              <p className="promo-banner-title">
                {stats.activePromotion.title} - {stats.activePromotion.discountPercent}% OFF
              </p>
              <Link href="/owner/promotions" className="promo-banner-btn">
                {t.owner_promo_update}
              </Link>
            </div>
          )}

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Recent Reservations */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2>{t.owner_recent_res_title}</h2>
                <Link href="/owner/reservations" className="section-link">
                  {t.owner_recent_res_view_all}
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
                          {t.owner_res_guests_label.replace('{count}', rev.guestCount.toString())} • {formatDate(rev.revDatetime, t, locale)}
                        </p>
                      </div>
                      <span className={`res-status ${getStatusClass(rev.status)}`}>
                        {getStatusLabel(rev.status, t)}
                      </span>
                      <button className="res-actions-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <h3>{t.owner_recent_res_empty}</h3>
                    <p>{t.owner_recent_res_empty_sub}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2>{t.owner_info_title}</h2>
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
                  <span className="info-label">{t.owner_info_address}</span>
                  <span className="info-value">{restaurant?.address || t.owner_info_not_set}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">{t.owner_info_hours}</span>
                  <span className="info-value">{restaurant?.openingHours || t.owner_info_not_set}</span>
                </div>

                {restaurant?.categories && (
                  <div className="info-item">
                    <span className="info-label">{t.owner_info_categories}</span>
                    <div className="info-tags">
                      {restaurant.categories.split(',').map((cat: string, i: number) => (
                        <span key={i} className="info-tag">{cat.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="info-item">
                  <span className="info-label">{t.owner_info_max_seats}</span>
                  <span className="info-seats">
                    {restaurant?.maxSeats || '—'} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#5a4a44' }}>{t.owner_info_seats_unit}</span>
                  </span>
                </div>

                <button className="edit-profile-btn">
                  {t.owner_info_edit_btn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
