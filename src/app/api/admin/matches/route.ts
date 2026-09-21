import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, audit } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { matchCreateSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const matches = await prisma.match.findMany({
      include: { venue: { include: { city: true } }, _count: { select: { bookings: true } } },
      orderBy: { date: 'desc' },
      take: 100
    });
    return NextResponse.json({ matches });
  } catch (e:any) { if (e instanceof Response) return e; return NextResponse.json({ error: 'error' }, { status: 500 });}
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const data = matchCreateSchema.parse(body);
    const match = await prisma.match.create({
      data: {
        venueId: data.venueId,
        date: new Date(data.date),
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        category: data.category,
        price: data.price,
        maxPlayers: data.maxPlayers ?? 14,
        notes: data.notes,
        createdById: admin.userId
      }
    });
    await audit(admin.userId, 'match_created', 'Match', match.id);
    return NextResponse.json({ match }, { status: 201 });
  } catch (e:any) {
    if (e instanceof Response) return e;
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
