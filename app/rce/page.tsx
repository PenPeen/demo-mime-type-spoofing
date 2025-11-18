'use client';

import { useState, useEffect } from 'react';

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
    // CSS読み込み
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = '/rce/style.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link2);

    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = '/rce/slide.css';
    document.head.appendChild(link3);

    const link4 = document.createElement('link');
    link4.rel = 'stylesheet';
    link4.href = '/rce/inview.css';
    document.head.appendChild(link4);

    const link5 = document.createElement('link');
    link5.rel = 'stylesheet';
    link5.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
    document.head.appendChild(link5);

    const link6 = document.createElement('link');
    link6.rel = 'stylesheet';
    link6.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css';
    document.head.appendChild(link6);

    // jQuery と依存スクリプトを動的に読み込み
    const scripts: HTMLScriptElement[] = [];

    // jQuery を最初に読み込み
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    jqueryScript.async = false;

    jqueryScript.onload = () => {
      // slick carousel を読み込む
      const slickLibScript = document.createElement('script');
      slickLibScript.src = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
      slickLibScript.async = false;

      slickLibScript.onload = () => {
        // slick.js を読み込む
        const slickScript = document.createElement('script');
        slickScript.src = '/rce/js/slick.js';
        slickScript.async = false;

        slickScript.onload = () => {
          // jquery.inview を読み込む
          const inviewScript = document.createElement('script');
          inviewScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/protonet-jquery.inview/1.1.2/jquery.inview.min.js';
          inviewScript.async = false;

          inviewScript.onload = () => {
            // jquery.inview_set.js を読み込む
            const inviewSetScript = document.createElement('script');
            inviewSetScript.src = '/rce/js/jquery.inview_set.js';
            inviewSetScript.async = false;

            inviewSetScript.onload = () => {
              // main.js を読み込む
              const mainScript = document.createElement('script');
              mainScript.src = '/rce/js/main.js';
              mainScript.async = false;

              document.body.appendChild(mainScript);
              scripts.push(mainScript);
            };

            document.body.appendChild(inviewSetScript);
            scripts.push(inviewSetScript);
          };

          document.body.appendChild(inviewScript);
          scripts.push(inviewScript);
        };

        document.body.appendChild(slickScript);
        scripts.push(slickScript);
      };

      document.body.appendChild(slickLibScript);
      scripts.push(slickLibScript);
    };

    document.body.appendChild(jqueryScript);
    scripts.push(jqueryScript);

    fetchFiles();
    checkHeader();
    const interval = setInterval(checkHeader, 2000);

    return () => {
      clearInterval(interval);
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      document.head.removeChild(link3);
      document.head.removeChild(link4);
      document.head.removeChild(link5);
      document.head.removeChild(link6);
      // スクリプトをクリーンアップ
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
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
    <div className="home">
      <div id="container">
        {/* ヘッダー */}
        <header>
          <h1 className="logo">
            <a href="/rce">
              <img src="/rce/images/logo.png" alt="ファイル圧縮システム" />
            </a>
          </h1>

          <nav>
            <ul>
              <li><a href="#upload">アップロード</a></li>
              <li><a href="#files">ファイル一覧</a></li>
              <li><a href="#security">セキュリティ情報</a></li>
              {!headerExists && (
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleRestore(); }}>
                    🔧 復元
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </header>

        <div id="contents">
          {/* スライドショー */}
          <aside id="mainimg">
            <div className="slide slide1">
              <div>
                <p>
                  <span>ファイルを簡単に圧縮、</span><br />
                  <span>効率的な管理を実現します。</span>
                </p>
              </div>
            </div>

            <div className="slide slide2">
              <div>
                <p>
                  <span>シンプルな操作で、</span><br />
                  <span>すぐにダウンロード可能。</span>
                </p>
              </div>
            </div>

            <div className="slide slide3">
              <div>
                <p>
                  <span>安全で高速な、</span><br />
                  <span>ファイル圧縮サービス。</span>
                </p>
              </div>
            </div>
          </aside>

          <main>
            {/* アップロードセクション */}
            <section id="upload">
              <div className="list-free">
                <h2 className="w1">
                  <span className="fade-in-text">Upload</span>
                  <span className="small">ファイルアップロード</span>
                </h2>

                <div style={{
                  background: '#fff',
                  padding: '30px',
                  borderRadius: '10px',
                  marginBottom: '40px',
                  border: '2px solid #e0e0e0'
                }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '1.2em' }}>
                    ファイルをアップロードして圧縮しよう
                  </h3>
                  <form onSubmit={handleUpload} style={{ marginBottom: '20px' }}>
                    <input
                      type="file"
                      name="file"
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
                        background: 'linear-gradient(to right, #4a90e2, #357abd)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      アップロード
                    </button>
                  </form>
                  <p style={{ fontSize: '0.9em', color: '#666' }}>
                    ※ アップロードしたファイルは tar.gz 形式で圧縮できます
                  </p>
                </div>
              </div>
            </section>

            {/* ファイル一覧セクション */}
            <section id="files" className="bg1">
              <h2 className="c">
                <span className="fade-in-text">アップロード済みファイル</span>
                <span className="small">Uploaded Files</span>
              </h2>

              {files.length > 0 ? (
                <div className="list-grid1">
                  {files.map((file) => (
                    <div key={file} className="list blur">
                      <div className="text">
                        <h4 style={{ wordBreak: 'break-all' }}>{file}</h4>
                        <p>このファイルを tar.gz 形式で圧縮してダウンロードできます。</p>
                      </div>
                      <p className="btn1">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleCompress(file); }}>
                          圧縮してダウンロード
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  まだファイルがアップロードされていません。
                </p>
              )}
            </section>

            {/* セキュリティ情報セクション */}
            <section id="security">
              <h2>
                <span className="fade-in-text">セキュリティ情報</span>
                <span className="small">Security Information</span>
              </h2>

              <h3>ファイル圧縮の仕組み</h3>
              <p>
                アップロードされたファイルは、サーバー側で tar コマンドを使用して圧縮されます。
                ファイル名は自動的にサニタイズされ、安全に処理されます。
              </p>

              <h3 style={{ marginTop: '40px', color: '#d9534f' }}>【デモ】攻撃スクリプト</h3>
              <p style={{ color: '#d9534f', fontWeight: 'bold' }}>※ これは教育目的のデモです ※</p>

              <h4>ファイル名にコマンドを埋め込む（コマンドインジェクション）</h4>
              <pre style={{
                background: '#fff3cd',
                padding: '15px',
                borderRadius: '5px',
                overflow: 'auto',
                fontSize: '0.9em',
                marginBottom: '20px',
                border: '2px solid #ffc107'
              }}>{`// 悪意のあるファイル名を作成
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
input.files = dt.files;`}</pre>

              <h3 style={{ marginTop: '40px' }}>脆弱性の詳細</h3>
              <h4>問題点</h4>
              <ul style={{ marginBottom: '20px' }}>
                <li>ファイル名のサニタイズが不完全（<code>;</code> が除去されていない）</li>
                <li>シェルコマンドにファイル名を直接埋め込んでいる</li>
                <li><code>;</code> を使って複数のコマンドを連結できる</li>
                <li>任意のシェルコマンドが実行可能</li>
                <li>サーバー上のファイルを削除・改ざんできる</li>
              </ul>

              <h4>対策</h4>
              <ul>
                <li>ファイル名を完全にサニタイズ（特殊文字をすべて除去）</li>
                <li>ランダムなファイル名を生成（UUID等）</li>
                <li>シェルコマンドの使用を避ける（ライブラリを使用）</li>
                <li>コマンドの引数を適切にエスケープ</li>
                <li>最小権限の原則に従う</li>
              </ul>
            </section>

            <section>
              <h2>テンプレートのご利用前に必ずお読み下さい</h2>

              <h3>利用規約のご案内</h3>
              <p>
                このテンプレートは、<a href="https://template-party.com/">Template Party</a>にて無料配布している
                『ポップでかわいいデザインの無料ホームページテンプレート tp_pop1』です。
                必ずダウンロード先のサイトの<a href="https://template-party.com/read.html">利用規約</a>をご一読の上でご利用下さい。
              </p>
              <p>
                <strong className="color-check">HP最下部の著作表示『Web Design:Template-Party』は無断で削除しないで下さい。</strong><br />
                わざと見えなく加工する事も禁止です。
              </p>
            </section>
          </main>
        </div>

        {/* フッター */}
        <footer>
          <div>
            <p className="logo">
              <img src="/rce/images/logo_inverse.png" alt="ファイル圧縮システム" />
            </p>
          </div>

          <nav>
            <ul>
              <li className="title">メニュー</li>
              <li><a href="#upload">ファイルアップロード</a></li>
              <li><a href="#files">ファイル一覧</a></li>
              <li><a href="#security">セキュリティ情報</a></li>
            </ul>
            <ul>
              <li className="title">サポート</li>
              <li><a href="#">よくある質問</a></li>
              <li><a href="#">お問い合わせ</a></li>
              <li><a href="#">利用規約</a></li>
            </ul>
            <ul>
              <li className="title">リンク</li>
              <li><a href="/">ホーム</a></li>
              <li><a href="/path-traversal">パストラバーサル</a></li>
              <li><a href="/stored-xss">XSS</a></li>
            </ul>
          </nav>

          <ul className="icons">
            <li><a href="#"><i className="fa-brands fa-x-twitter"></i></a></li>
            <li><a href="#"><i className="fab fa-line"></i></a></li>
            <li><a href="#"><i className="fab fa-youtube"></i></a></li>
            <li><a href="#"><i className="fab fa-instagram"></i></a></li>
          </ul>

          <div id="copyright">
            Copyright&copy; <a href="/rce">ファイル圧縮システム</a> All Rights Reserved.
            <span className="pr">
              <a href="https://template-party.com/" target="_blank" rel="noopener noreferrer">
                《Web Design:Template-Party》
              </a>
            </span>
          </div>
        </footer>
      </div>

      {/* 開閉ボタン（ハンバーガーアイコン） */}
      <div id="menubar_hdr">
        <div className="menu-icon">
          <span></span><span></span><span></span>
        </div>
      </div>

      {/* 開閉ブロック */}
      <div id="menubar">
        <p className="logo">
          <img src="/rce/images/logo.png" alt="ファイル圧縮システム" />
        </p>

        <nav>
          <ul>
            <li><a href="#upload">アップロード</a></li>
            <li><a href="#files">ファイル一覧</a></li>
            <li><a href="#security">セキュリティ情報</a></li>
          </ul>
        </nav>

        <p>
          ファイルを簡単に圧縮してダウンロードできるシステムです。<br />
          セキュリティ教育のためのデモアプリケーションです。
        </p>
      </div>
    </div>
  );
}
