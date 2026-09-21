import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, authCookies, clearAuthCookies } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(_req: NextRequest) {
  const refresh = cookies().get(authCookies.refresh)?.value;
  if (refresh) {
    const payload = verifyRefreshToken(refresh);
    if (payload) {
      await prisma.refreshToken.updateMany({
        where: { token: payload.tokenId },
        data: { revoked: true }
      });
    }
  }
  clearAuthCookies();
  return NextResponse.json({ ok: true });
}
