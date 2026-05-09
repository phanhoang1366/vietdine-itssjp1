import { SignJWT, jwtVerify } from 'jose';
import type { RoleId, SessionPayload } from './definitions';
import { Response } from 'express';

const secretKey = process.env.SESSION_SECRET || 'fallback_secret_key';
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload, expiresAt: payload.expiresAt.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    console.log('Failed to verify session');
    return null;
  }
}

export async function createSessionCookie(res: Response, userId: number, roleId: RoleId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, roleId, expiresAt });

  res.cookie('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie('session', { path: '/' });
}
