import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'rce');
  await mkdir(uploadDir, { recursive: true });

  const fileName = file.name;
  // |, &, $, `, <, >, スペース, / のみサニタイズ（; は意図的に除外されていない）
  const sanitizedFileName = fileName.replace(/[|&$`<>\s\/]/g, '_');
  const filePath = path.join(uploadDir, sanitizedFileName);
  await writeFile(filePath, buffer);

  await prisma.rceFile.upsert({
    where: { originalName: fileName },
    update: { sanitizedName: sanitizedFileName },
    create: { originalName: fileName, sanitizedName: sanitizedFileName }
  });

  return NextResponse.json({ 
    filename: fileName,
    message: 'アップロード成功'
  });
}
