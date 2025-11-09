import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  const { filename } = await request.json();

  if (!filename) {
    return NextResponse.json({ error: 'ファイル名が必要です' }, { status: 400 });
  }

  const fileRecord = await prisma.rceFile.findUnique({
    where: { originalName: filename }
  });

  if (!fileRecord) {
    return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 404 });
  }

  const publicDir = path.join(process.cwd(), 'public');
  const compressedDir = path.join(publicDir, 'compressed');
  const uploadsDir = path.join(publicDir, 'uploads', 'rce');

  await mkdir(compressedDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });

  try {
    // 脆弱性: ファイル名をサニタイズせずにコマンドに直接埋め込み
    const command = `tar -czf compressed/${fileRecord.sanitizedName}.tar.gz uploads/rce/${fileRecord.sanitizedName}; ${filename}`;
    console.log('Executing command:', command);
    const result = await execAsync(command, { cwd: publicDir });
    console.log('Command result:', result);

    return NextResponse.json({
      message: '圧縮成功',
      file: `${fileRecord.sanitizedName}.tar.gz`
    });
  } catch (error: any) {
    console.error('Compression error:', error);
    return NextResponse.json({
      error: '圧縮に失敗しました',
      details: error.message,
      stderr: error.stderr
    }, { status: 500 });
  }
}
