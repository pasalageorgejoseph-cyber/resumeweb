export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2026';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    
    const user = await prisma.user.findFirst({
      where: { OR: [{ username: username }, { email: username }] }
    });
    
    if (!user) return NextResponse.json({ error: 'Invalid credentials detected' }, { status: 401 });
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: 'Invalid credentials detected' }, { status: 401 });
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    const response = NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email }
    });
    
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    });
    
    return response;
  } catch (error) {
    console.error('Login Error:', error);
    const msg = error instanceof Error ? error.message : 'Internal connection error logging in';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
