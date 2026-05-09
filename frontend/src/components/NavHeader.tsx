'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Bell } from 'lucide-react';

export default function NavHeader() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'ホーム', path: '/' },
    { name: '保存済み', path: '/saved' },
    { name: 'プロフィール', path: '/profile' },
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
      <div className="flex items-center justify-end w-48 gap-5 text-[#3d2e28]">
        <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
          <Globe className="w-[22px] h-[22px]" strokeWidth={1.5} />
        </button>
        <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
          <Bell className="w-[22px] h-[22px]" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
