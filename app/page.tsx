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
    <div className="min-h-screen bg-orange-50">
      <header className="relative text-white py-20 shadow-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/Header.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold drop-shadow-lg">まったり犬写真館</h1>
          <p className="text-base mt-1 drop-shadow-md">癒しのわんこ写真をみんなにシェアしよう</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-80 space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6 border-4 border-pink-200">
              <h2 className="text-xl font-bold text-pink-600 mb-4">写真をアップロード</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <input
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white py-3 px-6 rounded-full hover:from-pink-500 hover:to-orange-500 transition font-bold shadow-lg"
                >
                  アップロード！
                </button>
              </form>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl shadow-md p-6 border-4 border-pink-200">
              <h3 className="font-bold text-pink-700 mb-2">🐾 このサイトについて</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                みんなの可愛いわんこの写真を集めて癒されるサイトです。あなたの愛犬の写真もぜひシェアしてください！
              </p>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-4 border-orange-200">
              <h2 className="text-2xl font-bold text-orange-600 mb-1">みんなの可愛いわんこたち</h2>
              <p className="text-sm text-gray-600 mb-4">クリックしたら画像が見れるよ！</p>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <button
                      key={img}
                      onClick={() => window.open(img, '_blank')}
                      className="aspect-square bg-pink-50 rounded-xl hover:scale-105 transition-transform overflow-hidden shadow-md border-2 border-pink-200"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">まだ写真がありません。最初の1枚をアップロードしてね！</p>
              )}
            </div>

            <CollapsibleSection title="アップロードファイルの検証" bgColor="bg-blue-50" borderColor="border-blue-300" textColor="text-blue-800">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-2">1. フロントエンド: 拡張子チェック</h4>
                <CodeBlock language="html" code={`<input
  type="file"
  accept=".jpg,.jpeg,.png"
/>`} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-2">2. サーバーサイド: Content-Type検証</h4>
                <CodeBlock language="typescript" code={`const contentType = file.type;

if (!['image/jpeg', 'image/png'].includes(contentType)) {
  return NextResponse.json(
    { error: '画像ファイルのみアップロード可能です' },
    { status: 400 }
  );
}`} />
              </div>
            </div>
          </CollapsibleSection>

            <CollapsibleSection title="攻撃スクリプト" bgColor="bg-yellow-50" borderColor="border-yellow-300" textColor="text-yellow-800">
            <CodeBlock language="javascript" code={`// HTMLファイルを作成
const html = '<!DOCTYPE html><html><body><h1>XSS</h1><script>alert("Attack!")</script></body></html>';

// Content-Typeを 'image/jpeg' に偽装
const blob = new Blob([html], { type: 'image/jpeg' });
const file = new File([blob], 'attack.html', { type: 'image/jpeg' });

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
