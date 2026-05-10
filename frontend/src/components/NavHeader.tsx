'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Globe, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { logout } from '@/actions/auth';
import { useLanguage } from '@/context/LanguageContext';
import { localeNames, localeFlags, type Locale } from '@/lib/i18n';
import { useAuth } from '@/context/AuthContext';

export default function NavHeader() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = isAuthenticated
    ? [
        { name: t.nav_home, path: '/' },
        { name: t.nav_saved, path: '/saved' },
        { name: t.nav_profile, path: '/profile' },
      ]
    : [
        { name: t.nav_home, path: '/' },
      ];

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-[#faf8f6] h-[80px]">
      {/* Logo */}
      <Link href="/" className="text-2xl font-extrabold tracking-tighter text-[#3d2e28] w-48">
        VietDine
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center gap-10">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`font-bold text-[15px] relative transition-colors ${
                isActive ? 'text-[#775a19]' : 'text-[#3d2e28] hover:text-[#775a19]'
              }`}
            >
              {link.name}
              {isActive && (
                <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#775a19] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right Icons */}
      <div className="flex items-center justify-end w-48 gap-3 text-[#3d2e28]">
        {/* Language Selector */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <Globe className="w-[22px] h-[22px]" strokeWidth={1.5} />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#f0ede8] overflow-hidden z-50 min-w-[160px]">
              {(['ja', 'vi', 'en'] as Locale[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setLangOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium hover:bg-[#f6f3ee] transition-colors ${
                    locale === loc ? 'bg-[#f6f3ee] text-[#775a19] font-bold' : 'text-[#3d2e28]'
                  }`}
                >
                  <span className="text-lg">{localeFlags[loc]}</span>
                  <span>{localeNames[loc]}</span>
                  {locale === loc && (
                    <span className="ml-auto text-[#775a19]">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <>
            <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
              <Bell className="w-[22px] h-[22px]" strokeWidth={1.5} />
            </button>

            <div ref={userRef} className="relative ml-1">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors focus:outline-none"
              >
                <div className="w-[26px] h-[26px] bg-[#d3ceca] rounded-full flex items-center justify-center overflow-hidden">
                   <User className="w-[18px] h-[18px] text-[#3d2e28]" strokeWidth={1.5} />
                </div>
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#f0ede8] overflow-hidden z-50 min-w-[200px]">
                  <Link
                    href="/profile"
                    onClick={() => setUserOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium hover:bg-[#f6f3ee] transition-colors text-[#3d2e28]"
                  >
                    <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    <span>{t.nav_profile}</span>
                  </Link>
                  <div className="h-[1px] bg-[#f0ede8] mx-2" />
                  <button
                    onClick={async () => {
                      await logout();
                      window.location.href = '/';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    <span>{t.profile_logout}</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2.5 bg-[#8a6b32] text-white text-[14px] font-bold rounded-xl hover:bg-[#775a19] transition-colors ml-2"
          >
            {t.auth_login}
          </Link>
        )}
      </div>
    </header>
  );
}
