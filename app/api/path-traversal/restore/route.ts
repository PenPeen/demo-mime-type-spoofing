import { NextResponse } from 'next/server';
import { copyFile } from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const backupPath = path.join(publicDir, 'site-logo-backup.png');
    const targetPath = path.join(publicDir, 'site-logo.png');

    await copyFile(backupPath, targetPath);

    return NextResponse.json({ message: '復元成功' });
  } catch (error: any) {
    return NextResponse.json({
      error: '復元に失敗しました',
      details: error.message
    }, { status: 500 });
  }
}
