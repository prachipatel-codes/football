import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, audit } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { bookingSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const ip = getClientIp(req);
    const rl = rateLimit(`book:${user.userId}`, 5, 60_000);
    if (!rl.success) return NextResponse.json({ error: 'Slow down' }, { status: 429 });

    const body = await req.json();
    const data = bookingSchema.parse(body);

    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
      include: { bookings: { where: { bookingStatus: 'ACTIVE' } } }
    });
    if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    if (match.status === 'CANCELLED' || match.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Match not open' }, { status: 400 });
    }

    const activeCount = match.bookings.filter(b => ['PENDING','VERIFIED'].includes(b.paymentStatus)).length;
    if (activeCount >= match.maxPlayers) {
      return NextResponse.json({ error: 'Match Full' }, { status: 409 });
    }

    const existing = await prisma.booking.findUnique({
      where: { matchId_userId: { matchId: data.matchId, userId: user.userId } }
    });
    if (existing && existing.bookingStatus === 'ACTIVE') {
      return NextResponse.json({ error: 'Already booked' }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        matchId: data.matchId,
        userId: user.userId,
        upiIdUsed: data.upiIdUsed,
        screenshotUrl: data.screenshotUrl,
        paymentStatus: 'PENDING',
        bookingStatus: 'ACTIVE'
      }
    });

    await audit(user.userId, 'booking_created', 'Booking', booking.id, { matchId: data.matchId }, ip);

    // if now full, update match
    const newCount = activeCount + 1;
    if (newCount >= match.maxPlayers && match.status === 'OPEN') {
      await prisma.match.update({ where: { id: match.id }, data: { status: 'FULL' }});
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (e: any) {
    if (e instanceof Response) return e;
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const bookings = await prisma.booking.findMany({
      where: { userId: user.userId },
      include: { match: { include: { venue: { include: { city: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ bookings });
  } catch (e:any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
