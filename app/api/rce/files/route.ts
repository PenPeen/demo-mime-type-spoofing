import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const files = await prisma.rceFile.findMany({
    select: { originalName: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ files: files.map(f => f.originalName) });
}
