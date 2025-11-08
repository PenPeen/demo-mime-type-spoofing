'use client';

import { useState } from 'react';

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">画像アップロード</h1>
          <p className="text-sm text-red-600 mb-6">⚠️ Content-Type検証のみデモ（脆弱性あり）</p>



          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                画像を選択 (.jpg, .png のみ)
              </label>
              <input
                type="file"
                name="file"
                accept=".jpg,.jpeg,.png"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              アップロード
            </button>
          </form>

          {uploadedFile && (
            <div className="mt-6">
              <button
                onClick={handleViewImage}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
              >
                🔗 アップロードしたファイルを開く
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                ※ 新しいタブで開くとJavaScriptが実行されます
              </p>
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">📚 攻撃の流れ</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>サーバーはContent-Typeのみ検証 (image/jpeg, image/png)</li>
              <li>攻撃者が開発者ツールで直接APIを叩く</li>
              <li>HTMLファイルをContent-Type: image/jpegで偽装してアップロード</li>
              <li>被害者がファイルをダウンロードして開く</li>
              <li>ブラウザがHTMLとして解釈し、JavaScriptが実行される</li>
            </ol>
          </div>

          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">🛡️ 対策</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• マジックバイトでファイル内容を検証（JPEG: FF D8 FF、PNG: 89 50 4E 47）</li>
              <li>• Content-Typeは信頼しない（攻撃者が偽装可能）</li>
              <li>• Content-Disposition: attachment でダウンロード強制</li>
              <li>• X-Content-Type-Options: nosniff を設定</li>
              <li>• アップロードファイルを別ドメインで配信</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
