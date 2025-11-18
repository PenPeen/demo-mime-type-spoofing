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

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  await mkdir(uploadDir, { recursive: true });

  const fileName = file.name;

  // 脆弱性: 不完全なサニタイズ（一部の文字だけ除去、../../は残る）
  const sanitizedFileName = fileName.replace(/[;|&$`<>\s]/g, '_');

  // 脆弱性: path.join()は../../を正規化するが、実際のファイルパスは相対パスとして解釈される
  const filePath = path.join(uploadDir, sanitizedFileName);

  await writeFile(filePath, buffer);

  await prisma.pathTraversalFile.upsert({
    where: { originalName: fileName },
    update: { sanitizedName: sanitizedFileName },
    create: { originalName: fileName, sanitizedName: sanitizedFileName }
  });

  return NextResponse.json({
    filename: fileName,
    message: 'アップロード成功'
  });
}
