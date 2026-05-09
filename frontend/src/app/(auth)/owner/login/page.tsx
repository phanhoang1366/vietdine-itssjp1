'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ownerLogin } from '@/actions/auth';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import AuthHeader from '@/components/AuthHeader';

export default function OwnerLoginPage() {
  const [state, action, pending] = useActionState(ownerLogin, undefined);

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-surface-container-low to-surface-container-high opacity-80" />
        <img alt="Restaurant" className="w-full h-full object-cover opacity-15 filter grayscale-[0.3] sepia-[0.15]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP2zhXGxZWhLh8hL-L2oAulwrtlkd4iUZDdaMK2cO9ahcNQjff-LUKz9IkLwOV3rDDaz2Gg-Qx16vLmBEkDVZ8LQSyi3Igrir9xjB5S1TulmnsIbodav8ZH9v95wmTl558r6wJO9vKEhjd0sZ29GzLZsZa-Hf-2KEY2efG_va5Ndw45RKOTXqZrAjfKtLQXfo7OIAP-Jbctl6NGSDkURxkBMSIIlaMKLIxPoRIFNPis63jNFsmYEaCj3mqx4DD-1ANSs86bH2YIuw" />
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-secondary-fixed-dim/8 rounded-full blur-[120px]" />
      </div>
      <AuthHeader mode="owner" />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="mb-12 pl-2 border-l-2 border-secondary">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondary text-2xl">storefront</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Owner Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary leading-tight">店舗管理へようこそ。</h1>
            <p className="mt-3 text-on-surface-variant font-medium text-sm tracking-wide">あなたのレストランを最適に管理しましょう</p>
          </div>
          <div className="bg-surface-container-lowest/80 zen-blur p-8 md:p-10 rounded-[2rem] komorebi-shadow">
            {state?.message && (
              <div className="mb-6 p-3 rounded-xl bg-error/10 border border-error/20">
                <p className="text-sm text-error font-medium text-center">{state.message}</p>
              </div>
            )}
            <form action={action} className="space-y-6">
              <div className="space-y-4">
                <AuthInput id="email" name="email" label="オーナーメールアドレス" type="email" placeholder="owner@restaurant.com" icon="mail" error={state?.errors?.email} />
                <AuthInput id="password" name="password" label="パスワード" type="password" placeholder="••••••••" icon="lock" error={state?.errors?.password} rightLabel={{ text: 'パスワードをお忘れですか？', href: '/change-password' }} />
              </div>
              <AuthButton text="ログイン" pending={pending} />
            </form>
          </div>
          <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
            オーナーアカウントをお持ちでないですか？
            <Link className="text-primary font-bold hover:underline ml-1" href="/owner/register">新規登録</Link>
          </p>
        </div>
      </main>
    </>
  );
}
