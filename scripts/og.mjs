// Generates public/og.png (1200x630) with the site fonts and photo. Run manually: node scripts/og.mjs
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';

const fonts = pathToFileURL(resolve('public/fonts')).href;
const photo = pathToFileURL(resolve('src/assets/images/fabiano.jpg')).href;
const html = `<style>
@font-face{font-family:B;src:url(${fonts}/bricolage.woff2);font-weight:200 800}
@font-face{font-family:S;src:url(${fonts}/source-serif.woff2);font-weight:200 900}
@font-face{font-family:T;src:url(${fonts}/texturina-name.woff2);font-weight:100 900}
*{box-sizing:border-box}
body{margin:0;width:1200px;height:630px;color:#f3e8e4;position:relative;overflow:hidden;
background:
radial-gradient(circle 140px at 62% 24%,rgb(255 190 210/.16),transparent 70%),
linear-gradient(108deg,transparent 20%,rgb(255 205 225/.1) 32%,transparent 44%,rgb(255 205 225/.06) 58%,transparent 68%),
radial-gradient(900px 560px at 6% -8%,#6e1b42,transparent 62%),
radial-gradient(760px 520px at 100% 12%,#5c1236,transparent 64%),
radial-gradient(800px 460px at 55% 108%,#7a1d44,transparent 62%),
linear-gradient(165deg,#3b0f23,#1f0611 62%,#2b0a16)}
.name{position:absolute;left:72px;top:64px}
h1{font:800 124px/0.95 T;letter-spacing:-0.03em;margin:0}
h1 span{font-weight:300;display:block;letter-spacing:-0.04em}
.info{position:absolute;left:72px;bottom:64px}
.r{font:600 40px B;color:#f2b6c3;margin-bottom:10px}
p{margin:0;font:400 32px/1.3 S;max-width:640px}
.glass{position:absolute;right:72px;top:72px;width:360px;padding:12px;border-radius:22px;
background:linear-gradient(118deg,rgb(255 255 255/.2) 0 34%,rgb(255 255 255/.06) 34.2% 100%),rgb(74 14 40/.46);
border:1px solid rgb(255 255 255/.3);box-shadow:inset 0 1px 0 rgb(255 255 255/.5),0 40px 60px -24px rgb(0 0 0/.6)}
.glass img{display:block;width:100%;aspect-ratio:1;object-fit:cover;object-position:50% 20%;border-radius:12px}
</style>
<div class="name"><h1>Fabiano<span>Oliveira Silva</span></h1></div>
<div class="info"><div class="r">QA engineer, ingeniero de QA, engenheiro de QA</div><p>Playwright, API testing, E2E</p></div>
<div class="glass"><img src="${photo}" alt=""></div>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
const dir = await mkdtemp(join(tmpdir(), 'og-'));
const file = join(dir, 'og.html');
await writeFile(file, html);
await p.goto(pathToFileURL(file).href);
await p.evaluate(() => document.fonts.ready);
await p.waitForFunction(() => document.images[0].complete);
const shot = await p.screenshot();
await sharp(shot)
  .png({ palette: true, quality: 85, effort: 10 })
  .toFile('public/og.png');
await b.close();
