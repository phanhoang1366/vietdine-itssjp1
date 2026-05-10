'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { login } from '@/actions/auth';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import AuthHeader from '@/components/AuthHeader';
import SocialLoginButtons from '@/components/SocialLoginButtons';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  const { t } = useLanguage();

  useEffect(() => {
    if (state?.success && state.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state]);

  return (
    <>
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
        <img
          alt="Atmospheric interior of a minimalist Japanese restaurant"
          className="w-full h-full object-cover opacity-60"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP2zhXGxZWhLh8hL-L2oAulwrtlkd4iUZDdaMK2cO9ahcNQjff-LUKz9IkLwOV3rDDaz2Gg-Qx16vLmBEkDVZ8LQSyi3Igrir9xjB5S1TulmnsIbodav8ZH9v95wmTl558r6wJO9vKEhjd0sZ29GzLZsZa-Hf-2KEY2efG_va5Ndw45RKOTXqZrAjfKtLQXfo7OIAP-Jbctl6NGSDkURxkBMSIIlaMKLIxPoRIFNPis63jNFsmYEaCj3mqx4DD-1ANSs86bH2YIuw"
        />
      </div>

      {/* Top Navigation Bar */}
      <AuthHeader mode="customer" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Asymmetric Editorial Header */}
          <div className="mb-8 pl-4 border-l-[3px] border-[#3d2e28]">
            <h1 className="text-[2rem] font-extrabold tracking-tight text-[#3d2e28] leading-tight">
              {t.auth_welcome_back}
            </h1>
            <p className="mt-2 text-[#504442] font-medium text-sm tracking-wide">
              {t.auth_login_subtitle}
            </p>
          </div>

          {/* Login Container */}
          <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-[2rem] shadow-sm">
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
                  label={t.auth_email}
                  type="email"
                  placeholder="example@vietdine.com"
                  icon="mail"
                  error={state?.errors?.email}
                />
                <AuthInput
                  id="password"
                  name="password"
                  label={t.auth_password}
                  type="password"
                  placeholder="••••••••"
                  icon="lock"
                  error={state?.errors?.password}
                  rightLabel={{
                    text: t.auth_forgot_password,
                    href: '/change-password',
                  }}
                />
              </div>

              {/* Primary Action */}
              <AuthButton text={t.auth_login} pending={pending} />
            </form>

            <SocialLoginButtons />
          </div>

          {/* Footer Registration Link */}
          <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
            {t.auth_no_account}
            <Link className="text-primary font-bold hover:underline ml-1" href="/register">
              {t.auth_register_now}
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
