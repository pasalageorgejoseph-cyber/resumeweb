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
    return (jwt.verify(token, JWT_SECRET) as { userId: string }).userId;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = verifyToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, updatedAt: true, createdAt: true }
  });
  
  return NextResponse.json({ resumes });
}

export async function POST(req: Request) {
  const userId = verifyToken();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const { title, data } = await req.json();
    const resume = await prisma.resume.create({
      data: { userId, title: title || 'Untitled Resume', data: JSON.stringify(data || {}) }
    });
    
    // Auto-create history trace internally mapping directly to user
    await prisma.historyLog.create({
      data: { userId, title: resume.title, action: 'created' }
    });
    
    return NextResponse.json({ resume });
  } catch (error) {
    return NextResponse.json({ error: 'Error saving resume structure to cloud' }, { status: 500 });
  }
}

