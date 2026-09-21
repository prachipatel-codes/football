import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const category = searchParams.get('category');
  const upcoming = searchParams.get('upcoming') !== 'false';

  const where: any = {};
  if (upcoming) where.date = { gte: new Date() };
  if (category) where.category = category;
  if (city) {
    where.venue = { city: { name: city } };
  }
  where.status = { in: ['OPEN', 'FULL'] };

  const matches = await prisma.match.findMany({
    where,
    include: {
      venue: { include: { city: true } },
      bookings: { select: { paymentStatus: true, bookingStatus: true } }
    },
    orderBy: { date: 'asc' },
    take: 50
  });

  const enriched = matches.map(m => {
    const confirmed = m.bookings.filter(b => b.paymentStatus==='VERIFIED' && b.bookingStatus==='ACTIVE').length;
    const pending = m.bookings.filter(b => b.paymentStatus==='PENDING' && b.bookingStatus==='ACTIVE').length;
    return {
      id: m.id,
      date: m.date,
      startTime: m.startTime,
      endTime: m.endTime,
      category: m.category,
      price: m.price,
      maxPlayers: m.maxPlayers,
      status: confirmed + pending >= m.maxPlayers ? 'FULL' : m.status,
      venue: { name: m.venue.name, address: m.venue.address, mapLink: m.venue.mapLink, city: m.venue.city.name },
      spotsFilled: confirmed,
      spotsPending: pending,
      spotsLeft: Math.max(0, m.maxPlayers - confirmed - pending),
      notes: m.notes
    };
  });

  return NextResponse.json({ matches: enriched });
}
