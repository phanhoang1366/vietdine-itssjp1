import 'server-only';
import { cookies } from 'next/headers';
import type { SessionPayload } from './definitions';

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  
  if (!sessionToken) return null;
  
  // Since the token is a JWT created by the backend, we cannot decode its payload securely here without the secret.
  // In a real application, you might want to call a /api/auth/verify endpoint on the backend.
  // For UI purposes, we'll just return a mock payload if a session exists,
  // but it's better to use `getCurrentUser()` from `actions/auth.ts` to get actual user info.
  return { userId: 0, roleId: 1 as any, expiresAt: new Date() };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
