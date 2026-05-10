'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function OwnerSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { name: t.owner_dashboard, path: '/owner', icon: 'dashboard' },
    { name: t.owner_reservations, path: '/owner/reservations', icon: 'calendar_month' },
    { name: t.owner_menu, path: '/owner/menu', icon: 'restaurant_menu' },
    { name: t.owner_promotions, path: '/owner/promotions', icon: 'campaign' },
    { name: t.owner_chat, path: '/owner/chat', icon: 'chat' },
    { name: t.nav_settings, path: '/owner/settings', icon: 'settings' },
  ];

  return (
    <aside className="owner-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link href="/" className="logo-text">VietDine</Link>
      </div>

      {/* Restaurant Info */}
      <div className="sidebar-profile">
        <div className="profile-avatar overflow-hidden">
          <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="profile-info">
          <p className="profile-name">Kyoto Garden Hanoi</p>
          <p className="profile-role">{t.profile_role_admin}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined sidebar-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* View Public Page */}
      <div className="sidebar-footer">
        <Link href="/" className="view-public-btn">
          {t.sidebar_view_public}
        </Link>
      </div>
    </aside>
  );
}
