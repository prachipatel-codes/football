import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, signAccessToken, signRefreshToken, authCookies, setRefreshCookie } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(_req: NextRequest) {
  const refresh = cookies().get(authCookies.refresh)?.value;
  if (!refresh) return NextResponse.json({ error: 'No refresh token' }, { status: 401 });

  const payload = verifyRefreshToken(refresh);
  if (!payload) return NextResponse.json({ error: 'Invalid refresh' }, { status: 401 });

  const stored = await prisma.refreshToken.findUnique({ where: { token: payload.tokenId }});
  if (!stored || stored.revoked || stored.expiresAt < new Date() || stored.userId !== payload.userId) {
    return NextResponse.json({ error: 'Refresh revoked' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId }});
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

  // rotation
  await prisma.refreshToken.update({ where: { token: payload.tokenId }, data: { revoked: true }});

  const newTokenId = crypto.randomUUID();
  const newRefresh = signRefreshToken({ userId: user.id, tokenId: newTokenId });
  await prisma.refreshToken.create({
    data: {
      token: newTokenId,
      userId: user.id,
      expiresAt: new Date(Date.now()+30*24*3600*1000),
    }
  });

  setRefreshCookie(newRefresh);

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });

  return NextResponse.json({
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, city: user.city, avatarUrl: user.avatarUrl }
  });
}
