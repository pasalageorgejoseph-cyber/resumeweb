export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2026';

function verifyToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = verifyToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const history = await prisma.historyLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ history });
}

export async function POST(req: Request) {
  const userId = verifyToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await req.json();
    const log = await prisma.historyLog.create({
      data: {
        userId,
        title: body.title,
        action: body.action
      }
    });
    return NextResponse.json({ log });
  } catch {
    return NextResponse.json({ error: 'Failed logging exact history track' }, { status: 500 });
  }
}

