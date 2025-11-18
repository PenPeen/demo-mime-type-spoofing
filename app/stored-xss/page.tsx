'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function StoredXSS() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const fetchImages = async () => {
    const res = await fetch('/api/stored-xss/images');
    const data = await res.json();
    setImages(data.images);
  };

  useEffect(() => {
    // CSS読み込み
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = '/stored-xss/css/style.css';
    document.head.appendChild(link1);

    // lightbox CSS
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.10.0/css/lightbox.min.css';
    document.head.appendChild(link2);

    fetchImages();
    sessionStorage.setItem('userId', '12345');
    sessionStorage.setItem('sessionToken', 'abc123xyz789');

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file) return;

    const res = await fetch('/api/stored-xss/upload', {
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
    <div className="home">
      <div id="container">
        <header>
          <h1 id="logo">
            <a href="/stored-xss">
              <img src="/stored-xss/images/logo.png" alt="わんこ写真館" />
            </a>
          </h1>
          {/* スライドショー */}
          <aside id="mainimg">
            <img src="/stored-xss/images/1.jpg" alt="" className="slide0" />
            <img src="/stored-xss/images/1.jpg" alt="" className="slide1" />
            <img src="/stored-xss/images/2.jpg" alt="" className="slide2" />
            <img src="/stored-xss/images/3.jpg" alt="" className="slide3" />
            <img src="/stored-xss/images/123_kazari.png" alt="" className="kazari" />
          </aside>
        </header>

        {/* 開閉メニュー */}
        <nav id="menubar">
          <ul>
            <li><a href="#upload">Upload</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#new">News</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>

        <div id="contents">
          {/* アップロードセクション */}
          <section id="upload">
            <h2>Upload Photo<br /><span>写真をアップロード</span></h2>

            <div style={{
              background: '#fff',
              padding: '30px',
              borderRadius: '10px',
              marginBottom: '40px',
              border: '2px solid #e0e0e0'
            }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.2em' }}>可愛いわんこの写真をシェアしよう</h3>
              <form onSubmit={handleUpload} style={{ marginBottom: '20px' }}>
                <input
                  type="file"
                  name="file"
                  accept=".jpg,.jpeg,.png"
                  style={{
                    width: '100%',
                    padding: '15px',
                    marginBottom: '15px',
                    border: '2px dashed #ccc',
                    borderRadius: '5px',
                    fontSize: '1em'
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'linear-gradient(to right, #ff7eb3, #ff758c)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  アップロード！
                </button>
              </form>
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                ※ 対応形式：JPEG、PNG
              </p>
            </div>
          </section>

          {/* ギャラリーセクション */}
          <section id="gallery">
            <h2>Gallery<br /><span>みんなの可愛いわんこたち</span></h2>

            {images.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
                {images.map((img, index) => (
                  <div key={index} className="list">
                    <a href={img} data-lightbox="group1" data-title="わんこの写真">
                      <figure>
                        <img
                          src={img}
                          alt={`わんこ ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '10px'
                          }}
                        />
                      </figure>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                まだ写真がありません。最初の1枚をアップロードしてね！
              </p>
            )}
          </section>

          {/* お知らせセクション */}
          <section id="new">
            <h2>News<br /><span>お知らせ</span></h2>
            <dl>
              <dt>2024/11/18</dt>
              <dd>わんこ写真館がオープンしました！<span className="newicon">NEW</span></dd>
              <dt>2024/11/18</dt>
              <dd>みんなの可愛いわんこの写真を募集中です。ぜひアップロードしてください！</dd>
              <dt>2024/11/18</dt>
              <dd>写真をクリックすると大きな画像で見ることができます。</dd>
            </dl>
          </section>

          {/* セキュリティ情報セクション */}
          <section id="about">
            <h2>Security Info<br /><span>セキュリティ情報（教育目的）</span></h2>

            <h3>ファイル検証の仕組み</h3>

            <h4>1. フロントエンド: 拡張子チェック</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '5px',
              overflow: 'auto',
              fontSize: '0.9em',
              marginBottom: '20px'
            }}>{`<input
  type="file"
  accept=".jpg,.jpeg,.png"
/>`}</pre>

            <h4>2. サーバーサイド: Content-Type検証</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '5px',
              overflow: 'auto',
              fontSize: '0.9em',
              marginBottom: '20px'
            }}>{`const contentType = file.type;

if (!['image/jpeg', 'image/png'].includes(contentType)) {
  return NextResponse.json(
    { error: '画像ファイルのみアップロード可能です' },
    { status: 400 }
  );
}`}</pre>

            <h3 style={{ marginTop: '40px', color: '#d9534f' }}>【デモ】攻撃スクリプト</h3>
            <p style={{ color: '#d9534f', fontWeight: 'bold' }}>※ これは教育目的のデモです ※</p>

            <h4>Content-Typeを偽装してHTMLファイルをアップロード</h4>
            <pre style={{
              background: '#fff3cd',
              padding: '15px',
              borderRadius: '5px',
              overflow: 'auto',
              fontSize: '0.9em',
              marginBottom: '20px',
              border: '2px solid #ffc107'
            }}>{`// attack.htmlから読み込み
const response = await fetch('./attack.html');
const html = await response.text();

// Content-Typeを 'image/jpeg' に偽装
const blob = new Blob([html], { type: 'image/jpeg' });
const file = new File([blob], 'attack.html', { type: 'image/jpeg' });

// ファイル入力に設定
const dt = new DataTransfer();
dt.items.add(file);

const input = document.querySelector('input[type="file"]');
input.files = dt.files;`}</pre>

            <h3 style={{ marginTop: '40px' }}>脆弱性の詳細</h3>
            <h4>問題点</h4>
            <ul style={{ marginBottom: '20px' }}>
              <li>Content-Typeはクライアント側で簡単に偽装可能</li>
              <li>サーバー側でContent-Typeのみを検証している</li>
              <li>実際のファイル内容を検証していない</li>
              <li>HTMLファイルを画像として偽装してアップロード可能</li>
              <li>アップロードしたファイルを開くとJavaScriptが実行される</li>
            </ul>

            <h4>対策</h4>
            <ul>
              <li>ファイルの実際の内容（マジックバイト）を検証する</li>
              <li>画像処理ライブラリで画像として読み込めるか確認</li>
              <li>アップロードされたファイルをContent-Type: text/htmlで配信しない</li>
              <li>Content-Security-Policyヘッダーを設定</li>
              <li>アップロードファイルを別ドメインで配信</li>
            </ul>

            <h3 style={{ marginTop: '40px' }}>sessionStorageのデータ</h3>
            <p>このページでは、デモ用にsessionStorageに以下のデータを保存しています：</p>
            <ul>
              <li>userId: 12345</li>
              <li>sessionToken: abc123xyz789</li>
            </ul>
            <p style={{ color: '#d9534f' }}>
              攻撃が成功すると、これらのデータが盗まれる可能性があります。
            </p>
          </section>
        </div>

        <footer>
          <ul className="icon">
            <li><a href="#"><img src="/stored-xss/images/icon_facebook.png" alt="Facebook" /></a></li>
            <li><a href="#"><img src="/stored-xss/images/icon_twitter.png" alt="Twitter" /></a></li>
            <li><a href="#"><img src="/stored-xss/images/icon_instagram.png" alt="Instagram" /></a></li>
            <li><a href="#"><img src="/stored-xss/images/icon_youtube.png" alt="YouTube" /></a></li>
          </ul>
          <small>Copyright&copy; <a href="/stored-xss">わんこ写真館</a> All Rights Reserved.</small>
          <span className="pr">
            <a href="https://template-party.com/" target="_blank" rel="noopener noreferrer">
              《Web Design:Template-Party》
            </a>
          </span>
        </footer>
      </div>

      <p className="nav-fix-pos-pagetop"><a href="#">↑</a></p>

      {/* メニュー開閉ボタン */}
      <div id="menubar_hdr"></div>

      {/* Scripts */}
      <Script src="/stored-xss/js/openclose.js" strategy="afterInteractive" onLoad={() => {
        if (typeof (window as any).open_close === 'function') {
          (window as any).open_close("menubar_hdr", "menubar");
        }
      }} />
      <Script src="/stored-xss/js/fixmenu_pagetop.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.10.0/js/lightbox-plus-jquery.min.js" strategy="afterInteractive" />
    </div>
  );
}
