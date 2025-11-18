import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const files = await prisma.pathTraversalFile.findMany({
    select: { sanitizedName: true },
    orderBy: { createdAt: 'desc' }
  });

  // アバターのURLを返す
  const avatars = files.map(f => `/uploads/avatars/${f.sanitizedName}`);

  return NextResponse.json({ avatars });
}
