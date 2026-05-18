'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { signup } from '@/actions/auth';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  const { t } = useLanguage();

  useEffect(() => {
    if (state?.success && state.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Immersive Image */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden">
        <img
          alt="Premium Vietnamese dining atmosphere"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP2zhXGxZWhLh8hL-L2oAulwrtlkd4iUZDdaMK2cO9ahcNQjff-LUKz9IkLwOV3rDDaz2Gg-Qx16vLmBEkDVZ8LQSyi3Igrir9xjB5S1TulmnsIbodav8ZH9v95wmTl558r6wJO9vKEhjd0sZ29GzLZsZa-Hf-2KEY2efG_va5Ndw45RKOTXqZrAjfKtLQXfo7OIAP-Jbctl6NGSDkURxkBMSIIlaMKLIxPoRIFNPis63jNFsmYEaCj3mqx4DD-1ANSs86bH2YIuw"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

        {/* VietDine Logo */}
        <div className="absolute top-8 left-8 z-20">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-white">
            VietDine
          </Link>
        </div>

        {/* Bottom Text Overlay */}
        <div className="absolute bottom-16 left-8 right-8 z-20">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 whitespace-pre-line">
            {t.auth_register_left_title}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            {t.auth_register_left_sub}
          </p>
          {/* Carousel Dots */}
          <div className="flex gap-2 mt-6">
            <div className="w-8 h-1 rounded-full bg-secondary"></div>
            <div className="w-8 h-1 rounded-full bg-white/30"></div>
            <div className="w-8 h-1 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>

      {/* Right Panel — Registration Form */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-surface">
        {/* Mobile-only Header */}
        <div className="lg:hidden flex justify-between items-center px-6 py-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary">
            VietDine
          </Link>
          <Link
            href="/login"
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-lg">help</span>
          </Link>
        </div>

        {/* Desktop Help Button */}
        <div className="hidden lg:flex justify-end px-8 py-6">
          <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">help</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-8">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="mb-10">
              <p className="text-[#8a6b32] font-bold text-[11px] tracking-wide mb-2">{t.auth_register_start}</p>
              <h1 className="text-[2rem] font-extrabold text-[#3d2e28] tracking-tight mb-2">
                {t.auth_register_create}
              </h1>
              <p className="text-[#504442] text-[13px] font-medium">
                {t.auth_register_welcome}
              </p>
            </div>

            {/* Error Message */}
            {state?.message && (
              <div className="mb-6 p-3 rounded-xl bg-error/10 border border-error/20">
                <p className="text-sm text-error font-medium text-center">{state.message}</p>
              </div>
            )}

            <form action={action} className="space-y-5">
              {/* Name */}
              <AuthInput
                id="name"
                name="name"
                label={t.auth_name}
                placeholder={t.auth_name_placeholder}
                error={state?.errors?.name}
              />

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AuthInput
                  id="email"
                  name="email"
                  label={t.auth_email_label}
                  type="email"
                  placeholder="example@vietdine.com"
                  error={state?.errors?.email}
                />
                <AuthInput
                  id="phone"
                  name="phone"
                  label={t.auth_phone}
                  placeholder={t.auth_phone_placeholder}
                  error={state?.errors?.phone}
                />
              </div>

              {/* Password */}
              <AuthInput
                id="password"
                name="password"
                label={t.auth_password}
                type="password"
                placeholder="••••••••"
                error={state?.errors?.password}
              />

              {/* Confirm Password */}
              <AuthInput
                id="confirmPassword"
                name="confirmPassword"
                label={t.auth_confirm_password}
                type="password"
                placeholder="••••••••"
                error={state?.errors?.confirmPassword}
              />

              {/* Terms Checkbox */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f0ede8]">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    className="mt-1 w-4 h-4 rounded border-[#d4c3bf] text-[#3d2e28] focus:ring-[#3d2e28]/20"
                    required
                  />
                  <span className="text-[13px] text-[#504442] leading-relaxed">
                    {t.auth_register_terms}
                    <br />
                    <span className="text-[#a0938f] text-[11px] mt-1 block font-medium">
                      {t.auth_register_terms_sub}
                    </span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <AuthButton text={t.auth_register_btn} pending={pending} />
            </form>

            {/* Login Link */}
            <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
              {t.auth_has_account}
              <Link className="text-secondary font-bold hover:underline ml-1" href="/login">
                {t.auth_login}
              </Link>
            </p>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 mt-12">
              <button
                type="button"
                className="w-8 h-8 rounded-sm bg-[#a0938f] flex items-center justify-center hover:bg-[#827471] transition-colors"
                onClick={() => alert(t.auth_google_soon)}
              >
                <span className="text-white text-[10px] font-bold">G</span>
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-sm bg-[#a0938f] flex items-center justify-center hover:bg-[#827471] transition-colors"
                onClick={() => alert(t.auth_fb_soon)}
              >
                <span className="text-white text-[12px] font-bold">f</span>
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-sm bg-[#a0938f] flex items-center justify-center hover:bg-[#827471] transition-colors"
              >
                <span className="material-symbols-outlined text-white text-[16px]">mail</span>
              </button>
            </div>

            {/* Footer */}
            <p className="mt-4 text-center text-[9px] text-[#a0938f] font-bold uppercase tracking-[0.2em]">
              Powered by VietDine Hospitality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
