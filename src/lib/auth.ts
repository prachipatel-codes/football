import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { verifyAccessToken, AccessTokenPayload } from './jwt';
import { prisma } from './prisma';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function getBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export async function requireAuth(req: NextRequest): Promise<AccessTokenPayload> {
  const token = getBearerToken(req);
  if (!token) throw new Response('Unauthorized', { status: 401 });
  const payload = verifyAccessToken(token);
  if (!payload) throw new Response('Unauthorized', { status: 401 });
  return payload;
}

export async function requireAdmin(req: NextRequest): Promise<AccessTokenPayload> {
  const user = await requireAuth(req);
  if (user.role !== 'ADMIN') throw new Response('Forbidden', { status: 403 });
  return user;
}

export async function getUserFromRequest(req: NextRequest) {
  try {
    const payload = await requireAuth(req);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, phone: true, city: true, position: true, avatarUrl: true, isVerified: true }
    });
    return user;
  } catch {
    return null;
  }
}

// audit log
export async function audit(actorId: string | null, action: string, entity: string, entityId?: string, metadata?: any, ip?: string) {
  try {
    await prisma.auditLog.create({
      data: { actorId, action, entity, entityId, metadata, ip }
    });
  } catch {}
}
