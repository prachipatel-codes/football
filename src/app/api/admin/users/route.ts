import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, audit } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, phone: true, role: true, city: true, createdAt: true }
    });
    return NextResponse.json({ users });
  } catch(e:any){ if(e instanceof Response) return e; return NextResponse.json({error:'err'},{status:500})}
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const { userId, role } = await req.json();
    if (!['PLAYER','ADMIN'].includes(role)) return NextResponse.json({error:'bad role'},{status:400});
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role, promotedById: role==='ADMIN'? admin.userId : null }
    });
    await audit(admin.userId, 'role_change', 'User', userId, { role });
    return NextResponse.json({ user: updated });
  } catch(e:any){ if(e instanceof Response) return e; return NextResponse.json({error:e.message},{status:500})}
}
