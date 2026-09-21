import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { reviewSchema } from '@/lib/validations';

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { visible: true },
    include: { user: { select: { name: true, avatarUrl: true, city: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const data = reviewSchema.parse(body);
    const review = await prisma.review.create({
      data: {
        userId: user.userId,
        rating: data.rating,
        comment: data.comment,
        imageUrl: data.imageUrl || null,
        matchId: data.matchId || null,
        visible: true
      }
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch(e:any){
    if (e instanceof Response) return e;
    if (e?.name==='ZodError') return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
