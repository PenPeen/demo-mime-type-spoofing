export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">セキュリティ脆弱性デモ</h1>
          <p className="text-gray-600">各種脆弱性の動作を確認できるデモページ</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <a href="/stored-xss" className="block bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-bold text-gray-900 mb-2">MIME Sniffing</h2>
            <p className="text-sm text-gray-600">Content-Type偽装によるHTMLアップロード攻撃</p>
          </a>

          <a href="/rce" className="block bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 mb-2">RCE</h2>
            <p className="text-sm text-gray-600">リモートコード実行の脆弱性</p>
          </a>

          <a href="/path-traversal" className="block bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-gray-900 mb-2">パストラバーサル</h2>
            <p className="text-sm text-gray-600">ディレクトリトラバーサル攻撃</p>
          </a>
        </div>
      </div>
    </div>
  );
}
