'use client';

import { useState } from 'react';

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
    } else if (data.error) {
      alert(data.error);
    }
  };

  const handleViewImage = () => {
    if (uploadedFile) {
      window.open(uploadedFile, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">画像アップロード</h1>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3">
                画像を選択 (.jpg, .png のみ)
              </label>
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

          {uploadedFile && (
            <div className="mt-6">
              <button
                onClick={handleViewImage}
                className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition text-xl font-semibold"
              >
                🔗 アップロードしたファイルを開く
              </button>
              <p className="text-base text-gray-500 mt-3 text-center">
                ※ 新しいタブで開くとJavaScriptが実行されます
              </p>
            </div>
          )}

          <CollapsibleSection title="ファイルの検証" bgColor="bg-blue-50" borderColor="border-blue-200" textColor="text-blue-800">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-2">1. フロントエンド: 拡張子チェック</h4>
                <pre className="text-sm text-blue-700 overflow-x-auto bg-blue-100 p-4 rounded">
                  <code>{`<input
  type="file"
  accept=".jpg,.jpeg,.png"
/>`}</code>
                </pre>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-2">2. サーバーサイド: Content-Type検証</h4>
                <pre className="text-sm text-blue-700 overflow-x-auto bg-blue-100 p-4 rounded">
                  <code>{`const contentType = file.type;

if (!['image/jpeg', 'image/png'].includes(contentType)) {
  return NextResponse.json(
    { error: '画像ファイルのみアップロード可能です' },
    { status: 400 }
  );
}`}</code>
                </pre>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="攻撃スクリプト" bgColor="bg-yellow-50" borderColor="border-yellow-200" textColor="text-yellow-800">
            <pre className="text-sm text-yellow-700 overflow-x-auto bg-yellow-100 p-4 rounded">
              <code>{`// HTMLファイルを作成
const html = '<!DOCTYPE html><html><body><h1>🚨 XSS</h1><script>alert("Attack!")</script></body></html>';

// Content-Typeを 'image/jpeg' に偽装
const blob = new Blob([html], { type: 'image/jpeg' });
const file = new File([blob], 'attack.html', { type: 'image/jpeg' });

// ファイル入力に設定
const dt = new DataTransfer();
dt.items.add(file);

const input = document.querySelector('input[type="file"]');
input.files = dt.files;`}</code>
            </pre>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
