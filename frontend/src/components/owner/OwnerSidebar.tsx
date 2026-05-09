'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'ダッシュボード', path: '/owner', icon: 'dashboard' },
  { name: '予約管理', path: '/owner/reservations', icon: 'calendar_month' },
  { name: 'メニュー編集', path: '/owner/menu', icon: 'restaurant_menu' },
  { name: 'プロモーション', path: '/owner/promotions', icon: 'campaign' },
  { name: 'チャット', path: '/owner/chat', icon: 'chat' },
  { name: '設定', path: '/owner/settings', icon: 'settings' },
];

export default function OwnerSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="owner-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link href="/" className="logo-text">VietDine</Link>
      </div>

      {/* Restaurant Info */}
      <div className="sidebar-profile">
        <div className="profile-avatar">
          {user?.name?.charAt(0) || 'O'}
        </div>
        <div className="profile-info">
          <p className="profile-name">{user?.restaurantName || 'マイレストラン'}</p>
          <p className="profile-role">レストラン管理者</p>
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
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>open_in_new</span>
          公開ページを表示
        </Link>
      </div>
    </aside>
  );
}
