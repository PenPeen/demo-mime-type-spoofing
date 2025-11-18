import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rm } from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    // データベースのレコードを全削除
    await prisma.rceFile.deleteMany({});

    // アップロードファイルを全削除
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'rce');
    try {
      await rm(uploadDir, { recursive: true, force: true });
    } catch (error) {
      // ディレクトリが存在しない場合はスキップ
      console.log('Upload directory already empty or does not exist');
    }

    return NextResponse.json({ message: 'リセット成功' });
  } catch (error: any) {
    console.error('Reset error:', error);
    return NextResponse.json({
      error: 'リセットに失敗しました',
      details: error.message
    }, { status: 500 });
  }
}
