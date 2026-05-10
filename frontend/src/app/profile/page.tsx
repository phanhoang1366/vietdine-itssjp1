'use client';

import NavHeader from '@/components/NavHeader';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { logout } from '@/actions/auth';
import { 
  MessageSquare, Calendar, User, Bookmark, Lock, History, LogOut, Settings, ChevronRight
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  const settingsLinks = [
    {
      icon: <User className="w-[22px] h-[22px] text-[#3d2e28]" strokeWidth={1.5} />,
      title: t.profile_personal_info,
      subtitle: t.profile_personal_info_sub,
      href: '/profile/personal-info'
    },
    {
      icon: <Bookmark className="w-[22px] h-[22px] text-[#3d2e28]" strokeWidth={1.5} />,
      title: t.profile_saved_list,
      subtitle: t.profile_saved_list_sub,
      href: '/saved'
    },
    {
      icon: <Lock className="w-[22px] h-[22px] text-[#3d2e28]" strokeWidth={1.5} />,
      title: t.profile_change_password,
      subtitle: t.profile_change_password_sub,
      href: '/change-password'
    },
    {
      icon: <History className="w-[22px] h-[22px] text-[#3d2e28]" strokeWidth={1.5} />,
      title: t.profile_search_history,
      subtitle: t.profile_search_history_sub,
      href: '/profile/history'
    }
  ];

  const displayName = user?.name || 'Guest';
  const initials = displayName.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#faf8f6] flex flex-col font-body text-[#3d2e28]">
      <NavHeader />

      <main className="flex-1 max-w-[700px] w-full mx-auto px-6 py-10 flex flex-col items-center">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            <div className="w-[120px] h-[120px] bg-[#4e342e] rounded-2xl overflow-hidden flex items-center justify-center shadow-lg komorebi-shadow">
              <span className="text-4xl font-extrabold text-white">{initials}</span>
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8a6b32] text-white rounded-full flex items-center justify-center border-[3px] border-[#faf8f6] shadow-sm hover:bg-[#775a19] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <h1 className="text-3xl font-extrabold mb-3 tracking-tight">
            {isLoading ? '...' : displayName}
          </h1>
          
          {user && (
            <div className="px-4 py-1 bg-[#f3e8d5] text-[#775a19] rounded-full text-sm font-bold flex items-center shadow-sm">
              {t.profile_premium} <span className="mx-2 opacity-50">|</span> {t.profile_premium_label}
            </div>
          )}

          {!user && !isLoading && (
            <a href="/login" className="px-6 py-2 bg-[#361f1a] text-white rounded-full text-sm font-bold hover:bg-[#4e342e] transition-colors">
              {t.auth_login}
            </a>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 w-full mb-12">
          <div className="bg-[#f5f2eb] rounded-3xl p-6 flex flex-col justify-between h-[140px]">
            <MessageSquare className="w-7 h-7 text-[#504442] mb-4" strokeWidth={1.5} />
            <div>
              <div className="text-[28px] font-black leading-none mb-1">—</div>
              <div className="text-[10px] font-bold text-[#504442] tracking-wider uppercase">{t.profile_reviews_label}</div>
            </div>
          </div>
          <div className="bg-[#f5f2eb] rounded-3xl p-6 flex flex-col justify-between h-[140px]">
            <Calendar className="w-7 h-7 text-[#504442] mb-4" strokeWidth={1.5} />
            <div>
              <div className="text-[28px] font-black leading-none mb-1">—</div>
              <div className="text-[10px] font-bold text-[#504442] tracking-wider uppercase">{t.profile_bookings_label}</div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="w-full">
          <h2 className="text-[11px] font-bold text-[#827471] tracking-[0.1em] uppercase mb-4 pl-2">
            {t.profile_settings_label}
          </h2>
          
          <div className="flex flex-col gap-3">
            {settingsLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.href}
                className="bg-white rounded-2xl p-4 flex items-center hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="w-12 h-12 bg-[#faf8f6] rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#f0ede8] transition-colors">
                  {link.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[15px] leading-tight mb-0.5">{link.title}</h3>
                  <p className="text-[10px] text-[#827471] uppercase tracking-wider">{link.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#d4c3bf] group-hover:text-[#827471] transition-colors" />
              </a>
            ))}

            {/* Logout Button */}
            <button 
              onClick={async () => {
                await logout();
                window.location.href = '/';
              }}
              className="w-full bg-[#fcf9f4] border border-[#f0ede8] rounded-2xl p-4 flex items-center hover:bg-[#fff5f5] hover:border-[#ffd6d6] transition-colors group mt-2"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:bg-[#fff5f5] transition-colors border border-[#f0ede8]">
                <LogOut className="w-[22px] h-[22px] text-[#ba1a1a]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-[15px] leading-tight text-[#ba1a1a] mb-0.5">{t.profile_logout}</h3>
                <p className="text-[10px] text-[#e57373] uppercase tracking-wider">{t.profile_logout_sub}</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
