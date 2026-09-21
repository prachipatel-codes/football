import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, audit } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('paymentStatus');
    const where: any = {};
    if (status) where.paymentStatus = status;
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        match: { include: { venue: { include: { city: true } } } }
      },
      orderBy: { createdAt: 'desc' },
      take: 200
    });
    return NextResponse.json({ bookings });
  } catch (e:any) { if (e instanceof Response) return e; return NextResponse.json({ error:'err' },{status:500});}
}

// verify / reject
export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const { bookingId, action, rejectionReason } = await req.json();
    if (!['VERIFIED','REJECTED'].includes(action)) return NextResponse.json({ error: 'invalid' }, { status: 400 });

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: action,
        verifiedById: admin.userId,
        verifiedAt: new Date(),
        rejectionReason: action === 'REJECTED' ? rejectionReason : null,
        bookingStatus: action === 'REJECTED' ? 'CANCELLED' : 'ACTIVE'
      }
    });

    await audit(admin.userId, `payment_${action.toLowerCase()}`, 'Booking', bookingId);

    return NextResponse.json({ booking });
  } catch (e:any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
