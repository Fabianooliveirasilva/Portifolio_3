import { gzipSync } from 'node:zlib';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const root = '.vercel/output/static';
const limits = {
  image: 200 * 1024,
  imagePx: 2000,
  jsGzip: 70 * 1024,
  inlineCss: 14 * 1024,
  videoLg: 2 * 1024 * 1024,
  videoSm: 700 * 1024,
};
const errors = [];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let jsFiles = 0;
let jsInlineMax = 0;
for await (const file of walk(root)) {
  const { size } = await stat(file);
  if (/\.(avif|webp|png|jpe?g)$/.test(file)) {
    if (size > limits.image)
      errors.push(`${file}: ${(size / 1024).toFixed(0)} KB > 200 KB`);
    const { width = 0, height = 0 } = await sharp(file).metadata();
    if (Math.max(width, height) > limits.imagePx)
      errors.push(`${file}: ${width}x${height} > 2000 px`);
  } else if (file.endsWith('.js')) {
    jsFiles += gzipSync(await readFile(file)).length;
  } else if (file.endsWith('.html')) {
    const html = await readFile(file, 'utf8');
    const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce(
      (n, m) => n + gzipSync(m[1]).length,
      0,
    );
    const inline = [
      ...html.matchAll(
        /<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
      ),
    ].reduce((n, m) => n + gzipSync(m[1]).length, 0);
    jsInlineMax = Math.max(jsInlineMax, inline);
    if (css > limits.inlineCss)
      errors.push(`${file}: inline CSS ${css} B gzip > 14 KB`);
  } else if (file.includes('/video/')) {
    const max = file.includes('-sm.') ? limits.videoSm : limits.videoLg;
    if (size > max)
      errors.push(`${file}: ${(size / 1024).toFixed(0)} KB > ${max / 1024} KB`);
  }
}
const jsGzip = jsFiles + jsInlineMax;
if (jsGzip > limits.jsGzip) errors.push(`JS total gzip ${jsGzip} B > 70 KB`);

console.log(
  `budgets: JS ${(jsGzip / 1024).toFixed(1)} KB gzip, ${errors.length} violation(s)`,
);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
