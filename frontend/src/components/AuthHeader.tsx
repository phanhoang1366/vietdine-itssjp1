import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface AuthHeaderProps {
  /** Show owner button (on customer pages) or customer button (on owner pages) */
  mode?: 'customer' | 'owner';
}

export default function AuthHeader({ mode = 'customer' }: AuthHeaderProps) {
  const { t } = useLanguage();
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20">
      <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary">
        VietDine
      </Link>
      {mode === 'customer' ? (
        <Link
          href="/owner/login"
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold tracking-wide transition-all hover:opacity-90 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          {t.auth_owner_register_label}
        </Link>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold tracking-wide transition-all hover:opacity-90 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
          {t.auth_user_login}
        </Link>
      )}
    </header>
  );
}
