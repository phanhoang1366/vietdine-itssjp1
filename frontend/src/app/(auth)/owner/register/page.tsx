'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { ownerSignup } from '@/actions/auth';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import { useLanguage } from '@/context/LanguageContext';

export default function OwnerRegisterPage() {
  const [state, action, pending] = useActionState(ownerSignup, undefined);
  const { t } = useLanguage();

  useEffect(() => {
    if (state?.success && state.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden">
        <img alt="Premium Vietnamese dining" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP2zhXGxZWhLh8hL-L2oAulwrtlkd4iUZDdaMK2cO9ahcNQjff-LUKz9IkLwOV3rDDaz2Gg-Qx16vLmBEkDVZ8LQSyi3Igrir9xjB5S1TulmnsIbodav8ZH9v95wmTl558r6wJO9vKEhjd0sZ29GzLZsZa-Hf-2KEY2efG_va5Ndw45RKOTXqZrAjfKtLQXfo7OIAP-Jbctl6NGSDkURxkBMSIIlaMKLIxPoRIFNPis63jNFsmYEaCj3mqx4DD-1ANSs86bH2YIuw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute top-8 left-8 z-20">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-white">VietDine</Link>
        </div>
        <div className="absolute bottom-16 left-8 right-8 z-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary-fixed text-2xl">storefront</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-fixed">{t.auth_owner_portal}</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 whitespace-pre-line">{t.auth_owner_left_title}</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">{t.auth_owner_left_sub}</p>
          <div className="flex gap-2 mt-6">
            <div className="w-8 h-1 rounded-full bg-secondary" />
            <div className="w-8 h-1 rounded-full bg-white/30" />
            <div className="w-8 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-surface">
        <div className="lg:hidden flex justify-between items-center px-6 py-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary">VietDine</Link>
        </div>
        <div className="hidden lg:flex justify-end px-8 py-6">
          <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">person</span>{t.auth_user_login}
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-8">
          <div className="w-full max-w-lg">
            <div className="mb-10">
              <p className="text-secondary font-bold text-sm tracking-wide mb-2">{t.auth_owner_register_label}</p>
              <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">{t.auth_owner_register}</h1>
              <p className="text-on-surface-variant text-sm">{t.auth_owner_register_subtitle}</p>
            </div>
            {state?.message && (
              <div className="mb-6 p-3 rounded-xl bg-error/10 border border-error/20">
                <p className="text-sm text-error font-medium text-center">{state.message}</p>
              </div>
            )}
            <form action={action} className="space-y-5">
              <AuthInput id="name" name="name" label={t.auth_owner_name} placeholder={t.auth_owner_name_placeholder} error={state?.errors?.name} />
              <AuthInput id="restaurantName" name="restaurantName" label={t.auth_restaurant_name} placeholder={t.auth_res_placeholder} error={state?.errors?.restaurantName} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AuthInput id="email" name="email" label={t.auth_email_label} type="email" placeholder="owner@restaurant.com" error={state?.errors?.email} />
                <AuthInput id="phone" name="phone" label={t.auth_phone} placeholder={t.auth_phone_placeholder} error={state?.errors?.phone} />
              </div>
              <AuthInput id="password" name="password" label={t.auth_password} type="password" placeholder="••••••••" error={state?.errors?.password} />
              <AuthInput id="confirmPassword" name="confirmPassword" label={t.auth_confirm_password} type="password" placeholder="••••••••" error={state?.errors?.confirmPassword} />
              <div className="bg-surface-container-low rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" name="terms" className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" required />
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    {t.auth_register_terms}
                  </span>
                </label>
              </div>
              <AuthButton text={t.auth_owner_register_btn} pending={pending} />
            </form>
            <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
              {t.auth_owner_has_account}
              <Link className="text-secondary font-bold hover:underline ml-1" href="/owner/login">{t.auth_login}</Link>
            </p>
            <p className="mt-8 text-center text-[10px] text-outline font-bold uppercase tracking-[0.15em]">Powered by VietDine Hospitality</p>
          </div>
        </div>
      </div>
    </div>
  );
}
