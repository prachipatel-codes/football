import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, audit } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const refunds = await prisma.booking.findMany({
      where: { refundRequested: true },
      include: { user: true, match: { include: { venue: true } } },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json({ refunds });
  } catch(e:any){ if(e instanceof Response) return e; return NextResponse.json({error:'x'},{status:500})}
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const { bookingId, status } = await req.json(); // PROCESSED | DENIED
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { refundStatus: status }
    });
    await audit(admin.userId, 'refund_'+status.toLowerCase(), 'Booking', bookingId);
    return NextResponse.json({ booking });
  } catch(e:any){ if(e instanceof Response) return e; return NextResponse.json({error:e.message},{status:500})}
}
