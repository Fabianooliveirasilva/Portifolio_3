// Local static server for tests: serves .vercel/output/static with the same headers the postbuild
// script writes to the Vercel config. Needed because the Vercel adapter has no `astro preview`.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync } from 'node:zlib';

const root = '.vercel/output/static';
const port = Number(process.env.PORT ?? 4321);
const loadRules = async () =>
  JSON.parse(await readFile('.vercel/output/headers.json', 'utf8'));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain',
};

const compressible = new Set([
  '.html',
  '.css',
  '.js',
  '.json',
  '.xml',
  '.svg',
  '.txt',
]);

async function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(
    /^(\.\.[/\\])+/,
    '',
  );
  for (const candidate of [clean, join(clean, 'index.html')]) {
    const p = join(root, candidate);
    try {
      if ((await stat(p)).isFile()) return p;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  const headers = {};
  for (const r of await loadRules())
    if (new RegExp(r.src).test(pathname)) Object.assign(headers, r.headers);
  const file = await resolveFile(pathname);
  const status = file ? 200 : 404;
  const target = file ?? join(root, '404.html');
  let body = await readFile(target);
  const ext = extname(target);
  const encoded =
    compressible.has(ext) &&
    /\bbr\b/.test(req.headers['accept-encoding'] ?? '');
  if (encoded) body = brotliCompressSync(body);
  res.writeHead(status, {
    ...headers,
    'content-type': types[ext] ?? 'application/octet-stream',
    ...(encoded && { 'content-encoding': 'br', vary: 'accept-encoding' }),
  });
  res.end(req.method === 'HEAD' ? undefined : body);
}).listen(port, () => console.log(`serving on http://localhost:${port}`));
