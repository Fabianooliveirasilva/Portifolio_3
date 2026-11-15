import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const out = '.vercel/output';
const staticDir = join(out, 'static');

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const hash = (s) =>
  `'sha256-${createHash('sha256').update(s).digest('base64')}'`;
const styles = new Set();
const scripts = new Set();
for await (const file of walk(staticDir)) {
  if (!file.endsWith('.html')) continue;
  const html = await readFile(file, 'utf8');
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g))
    styles.add(hash(m[1]));
  for (const m of html.matchAll(
    /<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    scripts.add(hash(m[1]));
  }
}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...scripts].join(' ')}`.trim(),
  `style-src 'self' ${[...styles].join(' ')}`.trim(),
  "img-src 'self' data:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const security = {
  'content-security-policy': csp,
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()',
  'cross-origin-opener-policy': 'same-origin',
};
const immutable = { 'cache-control': 'public, max-age=31536000, immutable' };

const rules = [
  {
    src: '^/(.*)$',
    headers: {
      ...security,
      'cache-control': 'public, max-age=0, must-revalidate',
    },
    continue: true,
  },
  { src: '^/fonts/(.*)$', headers: immutable, continue: true },
  { src: '^/video/(.*)$', headers: immutable, continue: true },
];

const configPath = join(out, 'config.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));
config.routes = [
  ...rules,
  ...config.routes.filter((r) => !r.headers || r.src?.startsWith('^/_astro')),
];
await writeFile(configPath, JSON.stringify(config, null, 2));
await writeFile(join(out, 'headers.json'), JSON.stringify(rules, null, 2));
console.log(
  `headers: ${styles.size} style hash(es), ${scripts.size} script hash(es)`,
);
