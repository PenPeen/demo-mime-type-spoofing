'use client';

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const fetchImages = async () => {
    const res = await fetch('/api/images');
    const data = await res.json();
    setImages(data.images);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file) return;

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setUploadedFile(data.url);
      fetchImages();
    } else if (data.error) {
      alert(data.error);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">画像アップロード</h1>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <input
                type="file"
                name="file"
                accept=".jpg,.jpeg,.png"
                className="block w-full text-lg text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition text-xl font-semibold"
            >
              アップロード
            </button>
          </form>

          {images.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">アップロード済み画像</h2>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img) => (
                  <button
                    key={img}
                    onClick={() => window.open(img, '_blank')}
                    className="aspect-square bg-gray-100 rounded-lg hover:opacity-80 transition overflow-hidden"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <CollapsibleSection title="ファイルの検証" bgColor="bg-blue-50" borderColor="border-blue-200" textColor="text-blue-800">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-2">1. フロントエンド: 拡張子チェック</h4>
                <SyntaxHighlighter language="html" style={vscDarkPlus} customStyle={{ fontSize: '0.875rem', borderRadius: '0.5rem' }}>
{`<input
  type="file"
  accept=".jpg,.jpeg,.png"
/>`}
                </SyntaxHighlighter>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-2">2. サーバーサイド: Content-Type検証</h4>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus} customStyle={{ fontSize: '0.875rem', borderRadius: '0.5rem' }}>
{`const contentType = file.type;

if (!['image/jpeg', 'image/png'].includes(contentType)) {
  return NextResponse.json(
    { error: '画像ファイルのみアップロード可能です' },
    { status: 400 }
  );
}`}
                </SyntaxHighlighter>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="攻撃スクリプト" bgColor="bg-yellow-50" borderColor="border-yellow-200" textColor="text-yellow-800">
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ fontSize: '0.875rem', borderRadius: '0.5rem' }}>
{`// HTMLファイルを作成
const html = '<!DOCTYPE html><html><body><h1>🚨 XSS</h1><script>alert("Attack!")</script></body></html>';

// Content-Typeを 'image/jpeg' に偽装
const blob = new Blob([html], { type: 'image/jpeg' });
const file = new File([blob], 'attack.html', { type: 'image/jpeg' });

// ファイル入力に設定
const dt = new DataTransfer();
dt.items.add(file);

const input = document.querySelector('input[type="file"]');
input.files = dt.files;`}
            </SyntaxHighlighter>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
