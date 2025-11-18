import { NextResponse } from 'next/server';
import { readdir, unlink } from 'fs/promises';
import path from 'path';

export async function POST() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'stored-xss');

  try {
    const files = await readdir(uploadDir);

    // デフォルト画像（ot376_*.png）以外を削除
    for (const file of files) {
      if (!file.match(/^ot376_\d+\.png$/)) {
        const filePath = path.join(uploadDir, file);
        await unlink(filePath);
      }
    }

    return NextResponse.json({
      message: 'リセット完了。デフォルト画像のみ残りました。',
      success: true
    });
  } catch (error) {
    return NextResponse.json({
      error: 'リセットに失敗しました',
      success: false
    }, { status: 500 });
  }
}
