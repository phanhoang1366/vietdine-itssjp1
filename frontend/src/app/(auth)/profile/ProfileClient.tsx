'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { updateProfileAction, logout } from '@/actions/auth';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import type { SafeUser } from '@/lib/definitions';

export default function ProfileClient({ user }: { user: SafeUser }) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);
  const initial = user.name.charAt(0).toUpperCase();
  const roleName = user.roleId === 2 ? 'オーナー' : 'ユーザー';
  const roleColor = user.roleId === 2 ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary';

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-surface via-surface-container-low to-surface-container-high opacity-80" />
      </div>
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary">VietDine</Link>
        <form action={logout}>
          <button type="submit" className="flex items-center gap-2 px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-semibold tracking-wide transition-all hover:bg-error/10 hover:text-error active:scale-95">
            <span className="material-symbols-outlined text-[18px]">logout</span>ログアウト
          </button>
        </form>
      </header>
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 komorebi-shadow">
              <span className="text-3xl font-extrabold text-on-primary">{initial}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">{user.name}</h1>
            <span className={`mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${roleColor}`}>{roleName}</span>
            {user.restaurantName && (
              <p className="mt-2 text-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-base">storefront</span>{user.restaurantName}
              </p>
            )}
          </div>

          <div className="bg-surface-container-lowest/80 zen-blur p-8 md:p-10 rounded-[2rem] komorebi-shadow">
            {state?.message && (
              <div className={`mb-6 p-3 rounded-xl border ${state.success ? 'bg-tertiary-fixed/20 border-tertiary/30' : 'bg-error/10 border-error/20'}`}>
                <p className={`text-sm font-medium text-center ${state.success ? 'text-tertiary' : 'text-error'}`}>{state.message}</p>
              </div>
            )}
            <form action={action} className="space-y-5">
              <AuthInput id="name" name="name" label="お名前" defaultValue={user.name} error={state?.errors?.name} />
              <AuthInput id="email" name="email_display" label="メールアドレス" type="email" defaultValue={user.email} readOnly />
              <AuthInput id="phone" name="phone" label="電話番号" defaultValue={user.phone} error={state?.errors?.phone} />
              <AuthButton text="プロフィールを更新" pending={pending} />
            </form>
            <div className="mt-6 pt-6 border-t border-outline-variant/20">
              <Link href="/change-password" className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">lock_reset</span>
                  <span className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">パスワードを変更</span>
                </div>
                <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
