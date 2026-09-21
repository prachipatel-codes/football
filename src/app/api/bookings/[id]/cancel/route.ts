import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, audit } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string }}) {
  try {
    const user = await requireAuth(req);
    const booking = await prisma.booking.findUnique({ where: { id: params.id }, include: { match: true }});
    if (!booking || booking.userId !== user.userId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (booking.bookingStatus === 'CANCELLED') return NextResponse.json({ error: 'Already cancelled' }, { status: 400 });

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        bookingStatus: 'CANCELLED',
        refundRequested: true,
        refundStatus: 'REQUESTED',
        refundUpiId: booking.upiIdUsed
      }
    });

    // reopen match if full
    if (booking.match.status === 'FULL') {
      await prisma.match.update({ where: { id: booking.matchId }, data: { status: 'OPEN' }});
    }

    await audit(user.userId, 'booking_cancelled', 'Booking', booking.id);

    return NextResponse.json({ booking: updated });
  } catch (e:any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
