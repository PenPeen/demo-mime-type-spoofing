'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

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

    // メニューを確実に閉じた状態にする
    const menubar = document.getElementById('menubar');
    const menubarHdr = document.getElementById('menubar_hdr');
    if (menubar) {
      menubar.classList.add('close');
    }
    if (menubarHdr) {
      menubarHdr.classList.remove('open');
    }

    fetchImages();
    sessionStorage.setItem('userId', '12345');
    sessionStorage.setItem('sessionToken', 'abc123xyz789');

    return () => {
      document.head.removeChild(link1);
      // クリーンアップ時もメニューを閉じる
      if (menubar) {
        menubar.classList.add('close');
      }
      if (menubarHdr) {
        menubarHdr.classList.remove('open');
      }
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
      toast.success('画像のアップロードが完了しました！');
    } else if (data.error) {
      toast.error(data.error);
    }
  };

  const handleReset = async () => {
    if (!confirm('アップロードした画像をすべて削除し、デフォルト画像のみに戻しますか？')) {
      return;
    }

    const res = await fetch('/api/stored-xss/reset', {
      method: 'POST',
    });

    const data = await res.json();
    if (data.success) {
      toast.success('リセット完了しました');
      fetchImages();
    } else {
      toast.error('リセットに失敗しました');
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
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleReset(); }}>Reset</a></li>
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
              <div>
                {images.map((img, index) => (
                  <div key={index} className="list">
                    <a href={img} target="_blank">
                      <figure>
                        <img
                          src={img}
                          alt={`わんこ ${index + 1}`}
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
              <dd>写真をクリックすると新しいタブで開きます。</dd>
            </dl>
          </section>

          {/* セキュリティ情報セクション */}
          <section id="about">
            <h2>Security</h2>

            <h3>ファイル検証</h3>

            <h4>1. フロントエンド: 拡張子チェック</h4>
            <SyntaxHighlighter
              language="html"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: '5px',
                fontSize: '0.9em',
                marginBottom: '20px'
              }}
            >
{`<input
  type="file"
  accept=".jpg,.jpeg,.png"
/>`}
            </SyntaxHighlighter>

            <h4>2. サーバーサイド: Content-Type検証</h4>
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: '5px',
                fontSize: '0.9em',
                marginBottom: '20px'
              }}
            >
{`const contentType = file.type;

if (!['image/jpeg', 'image/png'].includes(contentType)) {
  return NextResponse.json(
    { error: '画像ファイルのみアップロード可能です' },
    { status: 400 }
  );
}`}
            </SyntaxHighlighter>

            <h3 style={{ marginTop: '40px', color: '#d9534f' }}>【デモ】攻撃用スクリプト</h3>

            <h4>Content-Typeを偽装してHTMLファイルをアップロード</h4>
            <SyntaxHighlighter
              language="javascript"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: '5px',
                fontSize: '0.9em',
                marginBottom: '20px',
                border: '2px solid #ffc107'
              }}
            >
{`// attack.htmlから読み込み
const response = await fetch('./attack.html');
const html = await response.text();

// Content-Typeを 'image/jpeg' に偽装
const blob = new Blob([html], { type: 'image/jpeg' });
const file = new File([blob], 'attack.html', { type: 'image/jpeg' });

// ファイル入力に設定
const dt = new DataTransfer();
dt.items.add(file);

const input = document.querySelector('input[type="file"]');
input.files = dt.files;`}
            </SyntaxHighlighter>
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
          <span className="pr"><a href="https://template-party.com/" target="_blank">《Web Design:Template-Party》</a></span>
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
    </div>
  );
}
