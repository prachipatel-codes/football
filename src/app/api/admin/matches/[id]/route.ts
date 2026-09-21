import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, audit } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string }}) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const match = await prisma.match.update({
      where: { id: params.id },
      data: {
        venueId: body.venueId,
        date: body.date ? new Date(body.date) : undefined,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        category: body.category,
        price: body.price,
        maxPlayers: body.maxPlayers,
        status: body.status,
        notes: body.notes,
      }
    });
    await audit(admin.userId, 'match_updated', 'Match', match.id, body);
    return NextResponse.json({ match });
  } catch (e:any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  try {
    const admin = await requireAdmin(req);
    await prisma.match.update({ where: { id: params.id }, data: { status: 'CANCELLED' }});
    await audit(admin.userId, 'match_cancelled', 'Match', params.id);
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}
