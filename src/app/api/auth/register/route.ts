import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { hashPassword } from '@/lib/auth';
import { signAccessToken, signRefreshToken, setRefreshCookie } from '@/lib/jwt';
import { rateLimit, getClientIp } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`register:${ip}`, 5, 60_000);
  if (!rl.success) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });

  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] }
    });
    if (exists) return NextResponse.json({ error: 'Email or phone already registered' }, { status: 409 });

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash,
        city: data.city,
        position: data.position,
        isVerified: true, // set false if you enable email verification
      },
      select: { id: true, name: true, email: true, role: true, phone: true, city: true, avatarUrl: true }
    });

    // create refresh token
    const tokenId = crypto.randomUUID();
    const refreshToken = signRefreshToken({ userId: user.id, tokenId });
    await prisma.refreshToken.create({
      data: {
        token: tokenId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30*24*3600*1000)
      }
    });

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });

    setRefreshCookie(refreshToken);

    return NextResponse.json({ user, accessToken }, { status: 201 });
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
