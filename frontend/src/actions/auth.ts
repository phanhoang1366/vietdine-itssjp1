'use server';

import { redirect } from 'next/navigation';
import { FormState } from '@/lib/definitions';
import { cookies } from 'next/headers';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api`;

async function forwardSessionCookie(res: Response) {
  const setCookieHeaders = res.headers.getSetCookie();
  const cookieStore = await cookies();
  
  for (const header of setCookieHeaders) {
    if (header.startsWith('session=;') || header.startsWith('session= ;')) {
      cookieStore.delete('session');
    } else if (header.startsWith('session=')) {
      const match = header.match(/session=([^;]+)/);
      if (match) {
        cookieStore.set('session', match[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      }
    } else if (header.includes('session=;')) {
      cookieStore.delete('session');
    }
  }
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  return {
    'Content-Type': 'application/json',
    ...(session ? { Cookie: `session=${session}` } : {})
  };
}

export async function login(state: FormState, formData: FormData): Promise<FormState> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const data = await res.json();
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  await forwardSessionCookie(res);
  return { success: true, redirectUrl: data.user.roleId === 2 ? '/owner' : '/' };
}

export async function ownerLogin(state: FormState, formData: FormData): Promise<FormState> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const data = await res.json();
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  if (data.user.roleId !== 2) return { message: 'このアカウントはオーナーアカウントではありません' };

  await forwardSessionCookie(res);
  return { success: true, redirectUrl: '/owner' };
}

export async function verifyGoogleToken(token: string) {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();
  if (!res.ok) {
    return { success: false, message: data.message || 'Google Login Failed' };
  }

  await forwardSessionCookie(res);
  return { success: true, user: data.user };
}

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const data = await res.json();
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  await forwardSessionCookie(res);
  return { success: true, redirectUrl: '/' };
}

export async function ownerSignup(state: FormState, formData: FormData): Promise<FormState> {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...Object.fromEntries(formData), roleId: 2 }),
  });

  const data = await res.json();
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  await forwardSessionCookie(res);
  return { success: true, redirectUrl: '/owner' };
}

export async function changePassword(state: FormState, formData: FormData): Promise<FormState> {
  const res = await fetch(`${API_URL}/users/change-password`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const data = await res.json();
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  return { success: true, message: 'パスワードが変更されました' };
}

export async function updateProfileAction(state: FormState, formData: FormData): Promise<FormState> {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const data = await res.json();
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  return { success: true, message: 'プロフィールが更新されました' };
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/users/profile`, {
    headers: await getAuthHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  await forwardSessionCookie(res);
}
