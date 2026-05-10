'use client';

import NavHeader from '@/components/NavHeader';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useActionState } from 'react';
import { updateProfileAction } from '@/actions/auth';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

export default function PersonalInfoPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [state, action, pending] = useActionState(updateProfileAction, undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f6] flex flex-col font-body text-[#3d2e28]">
        <NavHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#827471]">{t.common_loading}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] flex flex-col font-body text-[#3d2e28]">
      <NavHeader />
      <main className="flex-1 max-w-[600px] w-full mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/profile" className="text-sm text-[#827471] hover:text-[#3d2e28] transition-colors font-medium">
            ← {t.common_back}
          </Link>
        </div>

        <div className="mb-8 pl-2 border-l-2 border-[#775a19]">
          <h1 className="text-3xl font-extrabold tracking-tight">{t.profile_personal_info}</h1>
          <p className="mt-2 text-[#827471] text-sm">{t.personal_info_subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#f0ede8]">
          {state?.message && (
            <div className={`mb-6 p-3 rounded-xl border ${state.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-sm font-medium text-center ${state.success ? 'text-green-700' : 'text-red-700'}`}>{state.message}</p>
            </div>
          )}

          <form action={action} className="space-y-5">
            <AuthInput
              id="name"
              name="name"
              label={t.auth_name}
              defaultValue={user?.name || ''}
              placeholder={t.auth_name_placeholder}
              error={state?.errors?.name}
            />
            <AuthInput
              id="phone"
              name="phone"
              label={t.auth_phone}
              defaultValue={user?.phone || ''}
              placeholder={t.auth_phone_placeholder}
              error={state?.errors?.phone}
            />

            <div className="bg-[#f6f3ee] rounded-xl p-4">
              <p className="text-xs text-[#827471] font-medium">Email</p>
              <p className="text-sm font-bold mt-1">{user?.email || '—'}</p>
              <p className="text-[10px] text-[#a09491] mt-1">{t.personal_info_email_note}</p>
            </div>

            <AuthButton text={t.common_save} pending={pending} />
          </form>
        </div>
      </main>
    </div>
  );
}
