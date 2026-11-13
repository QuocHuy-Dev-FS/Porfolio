/**
 * scripts/dev.mjs — dev server cục bộ. Node 18+, chỉ dùng module có sẵn.
 * Build lần đầu, phục vụ docs/ trên http://localhost:PORT,
 * tự build lại khi data/ hoặc templates/ đổi.
 *
 * Usage: npm run dev     (đổi cổng: PORT=4000 npm run dev)
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

function build() {
  const r = spawnSync(process.execPath, [join(ROOT, 'scripts', 'build.mjs')], { cwd: ROOT, stdio: 'inherit' });
  console.log(r.status === 0 ? '[dev] build OK' : '[dev] build LỖI (xem log phía trên)');
}

build();

let timer;
for (const dir of ['data', 'templates']) {
  try {
    watch(join(ROOT, dir), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(build, 200);
    });
  } catch (e) {
    console.warn(`[dev] không theo dõi được ${dir}/: ${e.message}`);
  }
}

async function resolveFile(urlPath) {
  const rel = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '');
  let file = join(DOCS, rel);
  if (!file.startsWith(DOCS)) return null;
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  let file = await resolveFile(pathname);
  let status = 200;
  if (!file) { file = join(DOCS, '404.html'); status = 404; }
  try {
    const body = await readFile(file);
    res.writeHead(status, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`[dev] http://localhost:${PORT}  (Ctrl+C để dừng)`));
