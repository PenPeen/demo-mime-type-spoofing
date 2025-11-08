import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 });
  }

  // 脆弱性デモ: Content-Typeのみ検証（ファイル内容は検証しない）
  const contentType = file.type;
  
  if (!['image/jpeg', 'image/png'].includes(contentType)) {
    return NextResponse.json({ error: '画像ファイルのみアップロード可能です' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 脆弱性: ファイル内容を検証せずにそのまま保存
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const fileName = file.name;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return NextResponse.json({ 
    url: `/uploads/${fileName}`,
    message: 'アップロード成功'
  });
}
