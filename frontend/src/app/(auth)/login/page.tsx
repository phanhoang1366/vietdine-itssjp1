'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { login } from '@/actions/auth';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import AuthHeader from '@/components/AuthHeader';
import SocialLoginButtons from '@/components/SocialLoginButtons';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <>
      {/* Background Layer with Komorebi aesthetic */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-surface via-surface-container-low to-surface-container-high opacity-60"></div>
        <img
          alt="Atmospheric interior of a minimalist Japanese restaurant"
          className="w-full h-full object-cover opacity-20 filter grayscale-[0.2] sepia-[0.1]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP2zhXGxZWhLh8hL-L2oAulwrtlkd4iUZDdaMK2cO9ahcNQjff-LUKz9IkLwOV3rDDaz2Gg-Qx16vLmBEkDVZ8LQSyi3Igrir9xjB5S1TulmnsIbodav8ZH9v95wmTl558r6wJO9vKEhjd0sZ29GzLZsZa-Hf-2KEY2efG_va5Ndw45RKOTXqZrAjfKtLQXfo7OIAP-Jbctl6NGSDkURxkBMSIIlaMKLIxPoRIFNPis63jNFsmYEaCj3mqx4DD-1ANSs86bH2YIuw"
        />
        {/* Animated Komorebi-like light spots */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-secondary-fixed-dim/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-primary-container/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Top Navigation Bar */}
      <AuthHeader mode="customer" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Asymmetric Editorial Header */}
          <div className="mb-12 pl-2 border-l-2 border-secondary">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary leading-tight">
              おかえりなさい。
            </h1>
            <p className="mt-3 text-on-surface-variant font-medium text-sm tracking-wide">
              禅の精神を込めた美食体験
            </p>
          </div>

          {/* Login Container */}
          <div className="bg-surface-container-lowest/80 zen-blur p-8 md:p-10 rounded-[2rem] komorebi-shadow">
            {/* General Error Message */}
            {state?.message && (
              <div className="mb-6 p-3 rounded-xl bg-error/10 border border-error/20">
                <p className="text-sm text-error font-medium text-center">
                  {state.message}
                </p>
              </div>
            )}

            <form action={action} className="space-y-6">
              {/* Input Group */}
              <div className="space-y-4">
                <AuthInput
                  id="email"
                  name="email"
                  label="メールアドレスまたは電話番号"
                  type="email"
                  placeholder="example@vietdine.com"
                  icon="mail"
                  error={state?.errors?.email}
                />
                <AuthInput
                  id="password"
                  name="password"
                  label="パスワード"
                  type="password"
                  placeholder="••••••••"
                  icon="lock"
                  error={state?.errors?.password}
                  rightLabel={{
                    text: 'パスワードをお忘れですか？',
                    href: '/change-password',
                  }}
                />
              </div>

              {/* Primary Action */}
              <AuthButton text="ログイン" pending={pending} />
            </form>

            <SocialLoginButtons />
          </div>

          {/* Footer Registration Link */}
          <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
            アカウントをお持ちでないですか？
            <Link className="text-primary font-bold hover:underline ml-1" href="/register">
              今すぐ新規登録
            </Link>
          </p>
        </div>
      </main>

      {/* Bottom Decorative "Zen" Element */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] text-outline font-bold uppercase tracking-[0.2em] opacity-40 select-none pointer-events-none">
        <span>Authentic</span>
        <div className="w-1 h-1 rounded-full bg-outline"></div>
        <span>Minimalist</span>
        <div className="w-1 h-1 rounded-full bg-outline"></div>
        <span>VietDine</span>
      </div>
    </>
  );
}
