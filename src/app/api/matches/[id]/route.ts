import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const match = await prisma.match.findUnique({
    where: { id: params.id },
    include: {
      venue: { include: { city: true } },
      bookings: {
        where: { paymentStatus: 'VERIFIED', bookingStatus: 'ACTIVE' },
        include: { user: { select: { id: true, name: true, position: true, avatarUrl: true } } }
      }
    }
  });
  if (!match) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const user = await getUserFromRequest(req);
  const myBooking = user ? await prisma.booking.findUnique({
    where: { matchId_userId: { matchId: match.id, userId: user.id } }
  }).catch(()=>null) : null;

  const confirmedPlayers = match.bookings.map(b=>b.user);

  return NextResponse.json({
    match: {
      id: match.id,
      date: match.date,
      startTime: match.startTime,
      endTime: match.endTime,
      category: match.category,
      price: match.price,
      maxPlayers: match.maxPlayers,
      status: match.status,
      notes: match.notes,
      venue: match.venue,
    },
    confirmedPlayers,
    myBooking
  });
}
