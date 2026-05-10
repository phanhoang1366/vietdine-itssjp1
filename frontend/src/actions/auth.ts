'use server';

import { redirect } from 'next/navigation';
import { FormState } from '@/lib/definitions';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL ?? 'http://localhost:3001/api';
const MOCK_API = process.env.MOCK_API === 'true';

async function apiFetch(url: string, init: RequestInit = {}) {
  if (MOCK_API) {
    return mockApiFetch(url, init);
  }

  try {
    const res = await fetch(url, init);
    const contentType = res.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? await res.json().catch(() => ({}))
      : {};

    return { res, data };
  } catch (error) {
    return {
      res: null,
      data: {
        message:
          'バックエンドに接続できませんでした。バックエンドが起動しているか、API の URL が正しいか確認してください。',
      },
    };
  }
}

async function mockApiFetch(url: string, init: RequestInit = {}) {
  const pathname = new URL(url).pathname;

  const parseBody = () => {
    try {
      return init.body ? JSON.parse(init.body as string) : {};
    } catch {
      return {};
    }
  };

  const jsonResponse = (
    data: unknown,
    status = 200,
    headers: Record<string, string> = {}
  ) => {
    const res = new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    return { res, data };
  };

  const mockUser = {
    id: 1,
    name: 'Mock Admin',
    fullName: 'Mock Admin',
    email: 'admin@gmail.com',
    emailPhone: 'admin@gmail.com',
    roleId: 1,
  };

  const mockOwner = {
    id: 2,
    name: 'Mock Owner',
    fullName: 'Mock Owner',
    email: 'owner@gmail.com',
    emailPhone: 'owner@gmail.com',
    roleId: 2,
  };

  if (pathname.endsWith('/auth/login')) {
    const body = parseBody();

    const email = body.email;
    const password = body.password;

    if (email === 'admin@gmail.com' && password === '123') {
      return jsonResponse(
        {
          message: 'Login successful',
          user: mockUser,
        },
        200,
        {
          'Set-Cookie':
            'session=mock-admin-session; Path=/; HttpOnly; SameSite=Lax',
        }
      );
    }

    if (email === 'owner@gmail.com' && password === '123') {
      return jsonResponse(
        {
          message: 'Login successful',
          user: mockOwner,
        },
        200,
        {
          'Set-Cookie':
            'session=mock-owner-session; Path=/; HttpOnly; SameSite=Lax',
        }
      );
    }

    return jsonResponse(
      {
        message: 'メールアドレスまたはパスワードが正しくありません',
      },
      401
    );
  }

  if (pathname.endsWith('/users/register')) {
    const body = parseBody();

    const roleId = Number(body.roleId ?? 1);
    const user = roleId === 2 ? mockOwner : mockUser;

    return jsonResponse(
      {
        message: 'Signup successful',
        user,
      },
      200,
      {
        'Set-Cookie':
          roleId === 2
            ? 'session=mock-owner-session; Path=/; HttpOnly; SameSite=Lax'
            : 'session=mock-admin-session; Path=/; HttpOnly; SameSite=Lax',
      }
    );
  }

  if (pathname.endsWith('/users/profile')) {
    return jsonResponse({
      user: mockUser,
    });
  }

  if (pathname.endsWith('/auth/logout')) {
    return jsonResponse(
      {
        message: 'Logged out successfully',
      },
      200,
      {
        'Set-Cookie':
          'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      }
    );
  }

  if (pathname.endsWith('/users/change-password')) {
    return jsonResponse({
      message: 'パスワードが変更されました',
    });
  }

  return jsonResponse({
    message: 'Mock API response',
  });
}

async function forwardSessionCookie(res: Response) {
  const setCookieHeaders = res.headers.getSetCookie();
  const cookieStore = await cookies();

  for (const header of setCookieHeaders) {
    if (header.startsWith('session=')) {
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
    ...(session ? { Cookie: `session=${session}` } : {}),
  };
}

export async function login(state: FormState, formData: FormData): Promise<FormState> {
  const { res, data } = await apiFetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  if (!res) return { message: data.message };
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  await forwardSessionCookie(res);
  redirect(data.user.roleId === 2 ? '/owner/dashboard' : '/restaurant/1');
}

export async function ownerLogin(state: FormState, formData: FormData): Promise<FormState> {
  const { res, data } = await apiFetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  if (!res) return { message: data.message };
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  if (data.user.roleId !== 2) return { message: 'このアカウントはオーナーアカウントではありません' };

  await forwardSessionCookie(res);
  redirect('/owner/dashboard');
}

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
  const { res, data } = await apiFetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  if (!res) return { message: data.message };
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  await forwardSessionCookie(res);
  redirect('/');
}

export async function ownerSignup(state: FormState, formData: FormData): Promise<FormState> {
  const { res, data } = await apiFetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...Object.fromEntries(formData), roleId: 2 }),
  });

  if (!res) return { message: data.message };
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  await forwardSessionCookie(res);
  redirect('/owner/dashboard');
}

export async function changePassword(state: FormState, formData: FormData): Promise<FormState> {
  const { res, data } = await apiFetch(`${API_URL}/users/change-password`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  if (!res) return { message: data.message };
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  return { success: true, message: 'パスワードが変更されました' };
}

export async function updateProfileAction(state: FormState, formData: FormData): Promise<FormState> {
  const { res, data } = await apiFetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  if (!res) return { message: data.message };
  if (!res.ok) return data.errors ? { errors: data.errors } : { message: data.message };

  return { success: true, message: 'プロフィールが更新されました' };
}

export async function getCurrentUser() {
  const { res, data } = await apiFetch(`${API_URL}/users/profile`, {
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res || !res.ok) return null;
  return data.user;
}

export async function logout() {
  const { res } = await apiFetch(`${API_URL}/auth/logout`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });

  if (res) {
    await forwardSessionCookie(res);
  }

  redirect('/login');
}
