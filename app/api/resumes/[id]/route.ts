import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2026';

function verifyToken() {
  const token = cookies().get('auth_token')?.value;
  if (!token) return null;
  try {
    return (jwt.verify(token, JWT_SECRET) as { userId: string }).userId;
  } catch {
    return null;
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = verifyToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const resume = await prisma.resume.findFirst({ where: { id: params.id, userId } });
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ resume });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = verifyToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const { title, data } = await req.json();
    const resume = await prisma.resume.update({
      where: { id: params.id, userId },
      data: { title, data: JSON.stringify(data || {}) }
    });
    
    await prisma.historyLog.create({
      data: { userId, title: resume.title, action: 'edited' }
    });
    
    return NextResponse.json({ resume });
  } catch {
    return NextResponse.json({ error: 'Error updating resume' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = verifyToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const resume = await prisma.resume.delete({ where: { id: params.id, userId } });
    await prisma.historyLog.create({
      data: { userId, title: resume.title, action: 'deleted' }
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error deleting resume block' }, { status: 500 });
  }
}
