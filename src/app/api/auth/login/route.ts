import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';
import { verifyPassword, audit } from '@/lib/auth';
import { signAccessToken, signRefreshToken, setRefreshCookie } from '@/lib/jwt';
import { rateLimit, getClientIp } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`login:${ip}`, 10, 60_000);
  if (!rl.success) return NextResponse.json({ error: 'Too many login attempts' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) }});

  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }});
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      await audit(user.id, 'login_failed', 'User', user.id, {}, ip);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const tokenId = crypto.randomUUID();
    const refreshToken = signRefreshToken({ userId: user.id, tokenId });
    await prisma.refreshToken.create({
      data: { token: tokenId, userId: user.id, expiresAt: new Date(Date.now()+30*24*3600*1000) }
    });

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    setRefreshCookie(refreshToken);

    await audit(user.id, 'login', 'User', user.id, {}, ip);

    return NextResponse.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, city: user.city, avatarUrl: user.avatarUrl }
    });
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
