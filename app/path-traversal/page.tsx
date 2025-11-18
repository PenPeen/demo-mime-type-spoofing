'use client';

import { useState, useEffect } from 'react';

export default function PathTraversal() {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [logoExists, setLogoExists] = useState(true);

  const fetchAvatars = async () => {
    const res = await fetch('/api/path-traversal/avatars');
    const data = await res.json();
    setAvatars(data.avatars);
  };

  const checkLogo = async () => {
    try {
      const res = await fetch('/site-logo.png', { method: 'HEAD' });
      setLogoExists(res.ok);
    } catch {
      setLogoExists(false);
    }
  };

  useEffect(() => {
    // CSS読み込み
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = '/path-traversal/css/style.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link2);

    // jQuery と依存スクリプトを動的に読み込み
    const scripts: HTMLScriptElement[] = [];

    // jQuery を最初に読み込み
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    jqueryScript.async = false;

    jqueryScript.onload = () => {
      // jQuery が読み込まれた後に依存スクリプトを読み込む
      const inviewScript = document.createElement('script');
      inviewScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/protonet-jquery.inview/1.1.2/jquery.inview.min.js';
      inviewScript.async = false;

      inviewScript.onload = () => {
        // jquery.inview が読み込まれた後に jquery.inview_set.js を読み込む
        const inviewSetScript = document.createElement('script');
        inviewSetScript.src = '/path-traversal/js/jquery.inview_set.js';
        inviewSetScript.async = false;

        inviewSetScript.onload = () => {
          // main.js を読み込む
          const mainScript = document.createElement('script');
          mainScript.src = '/path-traversal/js/main.js';
          mainScript.async = false;

          mainScript.onload = () => {
            // すべてのスクリプトが読み込まれた後にメニュー初期化
            if (typeof (window as any).open_close === 'function') {
              (window as any).open_close("menubar_hdr", "menubar");
            }
          };

          document.body.appendChild(mainScript);
          scripts.push(mainScript);
        };

        document.body.appendChild(inviewSetScript);
        scripts.push(inviewSetScript);
      };

      document.body.appendChild(inviewScript);
      scripts.push(inviewScript);
    };

    document.body.appendChild(jqueryScript);
    scripts.push(jqueryScript);

    fetchAvatars();
    checkLogo();
    const interval = setInterval(checkLogo, 2000);

    // 動画の自動再生を遅延実行（DOM が安定してから）
    const videoTimeout = setTimeout(() => {
      const videos = document.querySelectorAll('#mainimg video');
      videos.forEach((video) => {
        const videoElement = video as HTMLVideoElement;
        const playPromise = videoElement.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // 自動再生エラーを無視
            console.log('Video autoplay prevented:', error);
          });
        }
      });
    }, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(videoTimeout);
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      // スクリプトをクリーンアップ
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      // 動画を停止
      const videos = document.querySelectorAll('#mainimg video');
      videos.forEach((video) => {
        (video as HTMLVideoElement).pause();
      });
    };
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await fetch('/api/path-traversal/upload', {
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
      fetchAvatars();
      form.reset();
      setTimeout(checkLogo, 500);
    } else if (data.error) {
      alert(data.error);
    }
  };

  const handleRestore = async () => {
    const res = await fetch('/api/path-traversal/restore', { method: 'POST' });
    const data = await res.json();
    if (data.message) {
      alert('ロゴを復元しました');
      window.location.reload();
    }
  };

  return (
    <div className="home">
      <div id="container">
          {/* ヘッダー */}
          <header>
            <h1 id="logo">
              <a href="/path-traversal">
                <img src="/site-logo.png" alt="プロフィール管理システム" />
              </a>
            </h1>

            {/* 開閉メニュー */}
            <div id="menubar">
              <nav>
                <ul>
                  <li><a href="#kodawari">システムの特徴</a></li>
                  <li><a href="#service">アバター管理</a></li>
                  <li><a href="#flow">ご利用の流れ</a></li>
                  <li><a href="#voice">ユーザーの声</a></li>
                  <li><a href="#faq">セキュリティ情報</a></li>
                  <li><a href="#footer">お問い合わせ</a></li>
                </ul>
              </nav>
            </div>

            <div id="header-box">
              <ul className="btn">
                <li><a href="#service"><i className="fa-solid fa-user"></i>アバター設定</a></li>
                {!logoExists && (
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleRestore(); }}>
                      <i className="fa-solid fa-wrench"></i>ロゴ復元
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </header>

          {/* 動画スライドショー */}
          <div id="mainimg">
            <video muted playsInline loop>
              <source src="/path-traversal/images/1-yoko.mp4" type="video/mp4" />
            </video>
            <video muted playsInline loop>
              <source src="/path-traversal/images/2-yoko.mp4" type="video/mp4" />
            </video>
            <video muted playsInline loop>
              <source src="/path-traversal/images/3-yoko.mp4" type="video/mp4" />
            </video>
          </div>

          {/* お知らせ */}
          <div className="new-top">
            <h2>お知らせ</h2>
            <p className="text">新しいプロフィール管理システムがリリースされました。アバター画像をアップロードして、あなたの個性を表現しましょう。</p>
          </div>

          <div id="contents">
            <main>
              {/* システムの特徴 */}
              <section id="kodawari">
                <h2 className="c">
                  <span className="fade-in-text">システムの特徴</span>
                  <span className="small">Our Features</span>
                </h2>

                <div className="list-half">
                  <div className="list up">
                    <div className="text">
                      <h4>簡単アップロード<span>Easy Upload</span></h4>
                      <p>
                        ドラッグ&ドロップまたはファイル選択で、簡単にアバター画像をアップロードできます。
                        対応形式：JPEG、PNG、GIF。最大ファイルサイズ：5MB。
                      </p>
                      <p>
                        アップロードした画像は自動的にサーバーに保存され、すぐにプロフィールに反映されます。
                      </p>
                    </div>
                    <div className="image-r">
                      <figure><img src="/path-traversal/images/kodawari-1.jpg" alt="" /></figure>
                    </div>
                  </div>

                  <div className="list up">
                    <div className="text">
                      <h4>安全な管理<span>Secure Management</span></h4>
                      <p>
                        アップロードされた画像は専用のディレクトリに保存され、安全に管理されます。
                        ファイル名は自動的にサニタイズされ、セキュリティが確保されています。
                      </p>
                    </div>
                    <div className="image-l">
                      <figure><img src="/path-traversal/images/kodawari-2.jpg" alt="" /></figure>
                    </div>
                  </div>

                  <div className="list up">
                    <div className="text">
                      <h4>リアルタイム表示<span>Real-time Display</span></h4>
                      <p>
                        アップロードしたアバターは即座にギャラリーに表示されます。
                        複数の画像を管理でき、いつでも切り替えが可能です。
                      </p>
                      <p>
                        過去にアップロードした画像の履歴も確認でき、お気に入りの一枚を見つけることができます。
                      </p>
                    </div>
                    <div className="image-r">
                      <figure><img src="/path-traversal/images/kodawari-3.jpg" alt="" /></figure>
                    </div>
                  </div>
                </div>
              </section>

              {/* アバター管理 */}
              <section id="service" className="bg1">
                <h2 className="c">
                  <span className="fade-in-text">アバター管理</span>
                  <span className="small">Avatar Management</span>
                </h2>

                <div style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
                  <div style={{
                    background: '#fff',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.3em' }}>アバター画像をアップロード</h3>
                    <form onSubmit={handleUpload} style={{ marginBottom: '20px' }}>
                      <input
                        type="file"
                        name="file"
                        accept="image/*"
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
                  </div>
                </div>

                <h3 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.3em' }}>
                  アップロード済みアバター
                </h3>

                {avatars.length > 0 ? (
                  <div className="list-grid7">
                    {avatars.map((avatar, index) => (
                      <div key={index} className="list up">
                        <figure>
                          <img
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '10px'
                            }}
                          />
                        </figure>
                        <h4>アバター #{index + 1}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    まだアバターがアップロードされていません。最初の一枚をアップロードしましょう！
                  </p>
                )}
              </section>

              {/* ご利用の流れ */}
              <section id="flow">
                <h2 className="c">
                  <span className="fade-in-text">ご利用の流れ</span>
                  <span className="small">Flow</span>
                </h2>

                <div className="flow-box up">
                  <span className="step-num">Step01</span>
                  <div className="title">
                    <h3>アカウント登録<span>Registration</span></h3>
                  </div>
                  <div className="text">
                    <h3>アカウント登録の説明ブロックです。</h3>
                    <p>
                      まずは無料でアカウントを作成します。メールアドレスとパスワードを設定するだけで、
                      すぐにサービスをご利用いただけます。
                    </p>
                  </div>
                </div>

                <div className="flow-box up">
                  <span className="step-num">Step02</span>
                  <div className="title">
                    <h3>アバター画像をアップロード<span>Upload Avatar</span></h3>
                  </div>
                  <div className="text">
                    <h3>アバター画像のアップロード手順です。</h3>
                    <p>
                      お好きな画像を選択してアップロードしてください。JPEG、PNG、GIF形式に対応しています。
                      画像は自動的に最適化され、サーバーに保存されます。
                    </p>
                  </div>
                </div>

                <div className="flow-box up">
                  <span className="step-num">Step03</span>
                  <div className="title">
                    <h3>プロフィールに反映<span>Update Profile</span></h3>
                  </div>
                  <div className="text">
                    <h3>プロフィールへの反映について</h3>
                    <p>
                      アップロードした画像は即座にプロフィールに反映されます。
                      他のユーザーからもあなたの新しいアバターが見えるようになります。
                    </p>
                  </div>
                </div>

                <div className="flow-box up">
                  <span className="step-num">Step04</span>
                  <div className="title">
                    <h3>いつでも変更可能<span>Easy Update</span></h3>
                  </div>
                  <div className="text">
                    <h3>アバターの変更はいつでも可能です。</h3>
                    <p>
                      気分や季節に合わせて、いつでもアバターを変更できます。
                      過去にアップロードした画像から選ぶことも、新しい画像をアップロードすることも可能です。
                    </p>
                  </div>
                </div>
              </section>

              {/* ユーザーの声 */}
              <div id="voice" className="bg-slideup slideup1">
                <section>
                  <h2 className="c">
                    <span className="fade-in-text">ユーザーの声</span>
                    <span className="small">User Testimonials</span>
                  </h2>

                  <div className="list-yoko-scroll">
                    <div className="list">
                      <h4>使いやすいインターフェース</h4>
                      <p className="text">
                        初めて使いましたが、とても直感的で使いやすかったです。
                        アップロードも簡単で、すぐにプロフィールに反映されました。
                      </p>
                    </div>

                    <div className="list">
                      <h4>安心して利用できます</h4>
                      <p className="text">
                        セキュリティがしっかりしているので、安心して個人の画像をアップロードできます。
                      </p>
                    </div>

                    <div className="list">
                      <h4>レスポンスが早い</h4>
                      <p className="text">
                        画像のアップロードから表示まで、とてもスムーズでストレスがありません。
                      </p>
                    </div>

                    <div className="list">
                      <h4>複数の画像を管理できる</h4>
                      <p className="text">
                        過去にアップロードした画像も保存されているので、いつでも切り替えられて便利です。
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* セキュリティ情報 */}
              <section id="faq" className="bg1">
                <h2>
                  <span className="fade-in-text">セキュリティ情報</span>
                  <span className="small">Security Information</span>
                </h2>

                <dl className="faq">
                  <dt className="openclose2">ファイル名のサニタイズについて</dt>
                  <dd>
                    アップロードされたファイルは、ファイル名から危険な文字（;、|、&、$、`、&lt;、&gt;など）を自動的に除去します。
                    これにより、コマンドインジェクションなどの攻撃を防ぎます。
                  </dd>

                  <dt className="openclose2">【デモ】パストラバーサル攻撃について</dt>
                  <dd>
                    <strong style={{ color: '#d9534f' }}>※ これは教育目的のデモです ※</strong>
                    <br /><br />
                    ファイル名に <code>../../</code> を含めることで、意図したディレクトリの外にファイルを保存できる脆弱性があります。
                    <br /><br />
                    <strong>攻撃スクリプト例：</strong>
                    <pre style={{
                      background: '#f5f5f5',
                      padding: '15px',
                      borderRadius: '5px',
                      overflow: 'auto',
                      fontSize: '0.9em'
                    }}>{`// 悪意のある画像を作成
const response = await fetch('./evil-logo.png');
const blob = await response.blob();

// ファイル名にパストラバーサルを含める
const file = new File([blob], '../../site-logo.png', {
  type: 'image/png'
});

// ファイル入力に設定
const dt = new DataTransfer();
dt.items.add(file);

const input = document.querySelector('input[type="file"]');
input.files = dt.files;`}</pre>
                  </dd>

                  <dt className="openclose2">脆弱性の詳細と対策</dt>
                  <dd>
                    <strong>問題点：</strong>
                    <ul style={{ marginTop: '10px', marginBottom: '10px' }}>
                      <li>ファイル名のサニタイズが不完全（<code>../</code> が除去されていない）</li>
                      <li><code>path.join()</code> は相対パスを正規化するが、ファイルシステムレベルでは有効</li>
                      <li>アップロード先ディレクトリの外にファイルが保存可能</li>
                      <li>重要なファイル（ロゴ、設定ファイルなど）を上書きできる</li>
                    </ul>
                    <br />
                    <strong>対策：</strong>
                    <ul style={{ marginTop: '10px' }}>
                      <li>ファイル名を完全にサニタイズ（<code>path.basename()</code> を使用）</li>
                      <li>ランダムなファイル名を生成（UUID等）</li>
                      <li>アップロード先ディレクトリの検証</li>
                      <li>ファイルパスが想定ディレクトリ内か確認</li>
                    </ul>
                  </dd>
                </dl>
              </section>

              {/* CTAボタン */}
              <div className="bg-slideup slideup2">
                <section className="btn-box">
                  <ul className="btn">
                    <li><a href="#service"><i className="fa-solid fa-user"></i>アバター設定</a></li>
                    <li><a href="#faq"><i className="fa-solid fa-shield-alt"></i>セキュリティ情報</a></li>
                  </ul>
                </section>
              </div>
            </main>
          </div>

          {/* ウェーブアニメーション */}
          <svg style={{ display: 'none' }}>
            <defs>
              <path id="wavePath" d="M0 30 V15 Q30 3 60 15 T120 15 V30z" />
            </defs>
          </svg>

          <div className="wave-section">
            <div className="wave wave-top">
              <svg viewBox="0 0 120 28" preserveAspectRatio="none">
                <g className="wave-wrap">
                  <use href="#wavePath" x="0" y="0" />
                  <use href="#wavePath" x="120" y="0" />
                </g>
              </svg>
            </div>
          </div>

          {/* フッター */}
          <footer id="footer">
            <div className="footer1">
              <p><img src="/path-traversal/images/logo-footer.png" alt="プロフィール管理システム" /></p>

              <p>
                〒000-0000 東京都〇〇区XXXXXX1丁目1号<br />
                代表電話：000-0000-0000<br />
                受付時間：月曜日から金曜日の9時から18時まで
              </p>

              <ul className="sns">
                <li><a href="#"><i className="fa-brands fa-x-twitter"></i></a></li>
                <li><a href="#"><i className="fab fa-line"></i></a></li>
                <li><a href="#"><i className="fab fa-youtube"></i></a></li>
                <li><a href="#"><i className="fab fa-instagram"></i></a></li>
              </ul>

              <h3>サポート時間</h3>

              <table className="week">
                <tbody>
                  <tr>
                    <th>受付時間</th>
                    <th>月</th>
                    <th>火</th>
                    <th>水</th>
                    <th>木</th>
                    <th>金</th>
                    <th>土</th>
                    <th>日</th>
                  </tr>
                  <tr>
                    <td>9:00 - 12:00</td>
                    <td>○</td>
                    <td>○</td>
                    <td>○</td>
                    <td>○</td>
                    <td>○</td>
                    <td>○</td>
                    <td>×</td>
                  </tr>
                  <tr>
                    <td>14:00 - 18:00</td>
                    <td>○</td>
                    <td>○</td>
                    <td>○</td>
                    <td>△</td>
                    <td>○</td>
                    <td>×</td>
                    <td>×</td>
                  </tr>
                </tbody>
              </table>
              <p className="r">△はメールサポートのみです。×は休業日です。</p>
            </div>

            <div className="footer2">
              <h3>お問い合わせ</h3>
              <p>セキュリティに関するご質問は、お気軽にお問い合わせください。</p>

              <small>Copyright© プロフィール管理システム All Rights Reserved.</small>
            </div>
          </footer>

          {/* テンプレート著作 */}
          <span className="pr">
            <a href="https://template-party.com/" target="_blank" rel="noopener noreferrer">
              《Web Design:Template-Party》
            </a>
          </span>
        </div>

        {/* ページの上部へ戻るボタン */}
        <div className="pagetop">
          <a href="#"><i className="fas fa-angle-double-up"></i></a>
        </div>

        {/* 開閉ボタン（ハンバーガーアイコン） */}
        <div id="menubar_hdr">
          <span></span><span></span><span></span>
        </div>

    </div>
  );
}
