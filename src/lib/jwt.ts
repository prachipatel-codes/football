import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me_32_chars_min';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me_32_chars_min';

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: 'PLAYER' | 'ADMIN';
  iat?: number;
  exp?: number;
}

export function signAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp'>) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || '15m',
  });
}

export function signRefreshToken(payload: { userId: string; tokenId: string }) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_TTL || '30d',
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string; tokenId: string } | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as any;
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  // server-only helper - read Authorization header or access cookie
  // For API routes use getAuthFromRequest
  return null;
}

export const authCookies = {
  refresh: 'offside_refresh',
  access: 'offside_access' // optional, we use memory/Zustand, but set for SSR fallback
};

export function setRefreshCookie(token: string) {
  cookies().set(authCookies.refresh, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30d
  });
}

export function clearAuthCookies() {
  cookies().delete(authCookies.refresh);
  cookies().delete(authCookies.access);
}
