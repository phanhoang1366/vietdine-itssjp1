'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { changePassword } from '@/actions/auth';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import AuthHeader from '@/components/AuthHeader';

export default function ChangePasswordPage() {
  const [state, action, pending] = useActionState(changePassword, undefined);

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-surface via-surface-container-low to-surface-container-high opacity-80" />
      </div>
      <AuthHeader mode="customer" />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="mb-12 pl-2 border-l-2 border-secondary">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary leading-tight">パスワード変更</h1>
            <p className="mt-3 text-on-surface-variant font-medium text-sm tracking-wide">アカウントのセキュリティを保護します</p>
          </div>
          <div className="bg-surface-container-lowest/80 zen-blur p-8 md:p-10 rounded-[2rem] komorebi-shadow">
            {state?.message && (
              <div className={`mb-6 p-3 rounded-xl border ${state.success ? 'bg-tertiary-fixed/20 border-tertiary/30' : 'bg-error/10 border-error/20'}`}>
                <p className={`text-sm font-medium text-center ${state.success ? 'text-tertiary' : 'text-error'}`}>{state.message}</p>
              </div>
            )}
            <form action={action} className="space-y-5">
              <AuthInput id="currentPassword" name="currentPassword" label="現在のパスワード" type="password" placeholder="••••••••" icon="lock" error={state?.errors?.currentPassword} />
              <AuthInput id="newPassword" name="newPassword" label="新しいパスワード" type="password" placeholder="••••••••" icon="lock_reset" error={state?.errors?.newPassword} />
              <AuthInput id="confirmNewPassword" name="confirmNewPassword" label="新しいパスワード（確認用）" type="password" placeholder="••••••••" icon="lock_reset" error={state?.errors?.confirmNewPassword} />
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[11px] text-on-surface-variant font-medium">パスワード要件:</p>
                <ul className="mt-1 space-y-0.5 text-[11px] text-outline">
                  <li>• 8文字以上</li>
                  <li>• アルファベットを含む</li>
                  <li>• 数字を含む</li>
                </ul>
              </div>
              <AuthButton text="パスワードを変更" pending={pending} />
            </form>
          </div>
          <p className="mt-8 text-center">
            <Link className="text-sm text-on-surface-variant font-medium hover:text-primary transition-colors" href="/profile">
              ← プロフィールに戻る
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
