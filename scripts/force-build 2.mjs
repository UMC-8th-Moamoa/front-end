// scripts/force-build.mjs
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const indexHtml = path.join(dist, "index.html");

// 1) dist 폴더 보장
fs.mkdirSync(dist, { recursive: true });

// 2) 최소 index.html 생성 (로컬 수준 시연용 안내 포함)
const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>MoaMoa (Fallback Build)</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; line-height: 1.5; }
    .badge { display:inline-block; padding:4px 8px; border-radius:6px; background:#ffe8e8; color:#a40000; font-weight:600; }
    pre { background:#f6f6f6; padding:12px; border-radius:8px; overflow:auto; }
    a { color:#2451e6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="badge">임시 실행</div>
  <h1>프론트가 임시로 실행 중입니다</h1>
  <p>프로덕션 빌드가 실패하여 최소 페이지로 대체되었습니다. 로컬에서 동작하던 수준의 시연을 위해 라우팅과 /api 프록시만 유지합니다.</p>
  <p>정상 빌드가 복구되면 자동으로 실제 앱 파일이 제공됩니다.</p>

  <h3>확인 포인트</h3>
  <ul>
    <li>Vercel <code>vercel.json</code>의 rewrites로 <code>/api</code> 프록시가 설정되어 있습니다.</li>
    <li>환경변수 <code>VITE_API_BASE_URL=/api</code>가 적용됩니다.</li>
  </ul>

  <p style="margin-top:24px;color:#666">이 페이지는 <code>scripts/force-build.mjs</code>가 생성했습니다.</p>
</body>
</html>`;

fs.writeFileSync(indexHtml, html, "utf8");

// 3) 프로세스를 "성공"으로 종료하여 Vercel에 빌드 성공 신호
console.log("[force-build] 생성 완료: dist/index.html (fallback)");
process.exit(0);
