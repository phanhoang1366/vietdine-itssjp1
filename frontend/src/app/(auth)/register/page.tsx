'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signup } from '@/actions/auth';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);

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
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            洗練された<br />美食の旅へ。
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            ベトナム料理の真髄を追求する、日本人駐在員と美食家のための限定コミュニティへようこそ。
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
              <p className="text-secondary font-bold text-sm tracking-wide mb-2">今すぐ始める</p>
              <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">
                アカウント作成
              </h1>
              <p className="text-on-surface-variant text-sm">
                VietDineコミュニティへようこそ。
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
                label="お名前"
                placeholder="例：山田 太郎"
                error={state?.errors?.name}
              />

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AuthInput
                  id="email"
                  name="email"
                  label="メールアドレス"
                  type="email"
                  placeholder="example@vietdine.com"
                  error={state?.errors?.email}
                />
                <AuthInput
                  id="phone"
                  name="phone"
                  label="電話番号"
                  placeholder="090 1234 5678"
                  error={state?.errors?.phone}
                />
              </div>

              {/* Password */}
              <AuthInput
                id="password"
                name="password"
                label="パスワード"
                type="password"
                placeholder="••••••••"
                error={state?.errors?.password}
              />

              {/* Confirm Password */}
              <AuthInput
                id="confirmPassword"
                name="confirmPassword"
                label="パスワード（確認用）"
                type="password"
                placeholder="••••••••"
                error={state?.errors?.confirmPassword}
              />

              {/* Terms Checkbox */}
              <div className="bg-surface-container-low rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
                    required
                  />
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    ベトナム国内ユーザー向けの
                    <a href="#" className="font-bold text-on-surface hover:underline">利用規約</a>
                    および
                    <a href="#" className="font-bold text-on-surface hover:underline">プライバシーポリシー</a>
                    に同意します。
                    <br />
                    <span className="text-outline text-[11px]">
                      ベトナム在住の日本人ユーザー向けの規約に同意します。
                    </span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <AuthButton text="新規登録する" pending={pending} />
            </form>

            {/* Login Link */}
            <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
              すでにアカウントをお持ちですか？
              <Link className="text-secondary font-bold hover:underline ml-1" href="/login">
                ログイン
              </Link>
            </p>

            {/* Social Icons */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                className="w-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high transition-colors"
                onClick={() => alert('Google登録は近日公開予定です')}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high transition-colors"
                onClick={() => alert('Facebook登録は近日公開予定です')}
              >
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-lg">mail</span>
              </button>
            </div>

            {/* Footer */}
            <p className="mt-8 text-center text-[10px] text-outline font-bold uppercase tracking-[0.15em]">
              Powered by VietDine Hospitality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
