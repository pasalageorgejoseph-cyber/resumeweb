export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2026';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    
    // Validate existence
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
    }
    
    // Security Hash
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Core User Entry
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword }
    });
    
    // Tokenize
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
      maxAge: 60 * 60 * 24 * 7 // Resolves to strictly 7 days
    });
    
    return response;
  } catch (error: any) {
    console.error('Signup Error:', error);
    const msg = error?.message || String(error) || 'FATAL SIGNUP ERROR';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
