import { expect, test } from '@playwright/test';

test('security headers are present on pages', async ({ request }) => {
  for (const path of ['/', '/es/', '/en/']) {
    const h = (await request.get(path)).headers();
    expect(h['strict-transport-security']).toContain('max-age=63072000');
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['permissions-policy']).toContain('camera=()');
    expect(h['cross-origin-opener-policy']).toBe('same-origin');
    expect(h['cache-control']).toContain('must-revalidate');
    const csp = h['content-security-policy']!;
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain('unsafe-inline');
    expect(csp).not.toContain('unsafe-eval');
  }
});

test('fonts and video are cached as immutable', async ({ request }) => {
  for (const path of ['/fonts/bricolage.woff2', '/video/suite.mp4']) {
    const h = (await request.get(path)).headers();
    expect(h['cache-control']).toContain('immutable');
  }
});

test('page loads without CSP violations', async ({ page }) => {
  const problems: string[] = [];
  page.on(
    'console',
    (m) =>
      /content security policy|refused to/i.test(m.text()) &&
      problems.push(m.text()),
  );
  page.on('pageerror', (e) => problems.push(e.message));
  for (const path of ['/', '/es/', '/en/']) {
    await page.goto(path);
    await page.waitForLoadState('load');
    await page.waitForTimeout(500);
  }
  expect(problems).toEqual([]);
});

test('no third-party requests', async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on('request', (r) => {
    if (!r.url().startsWith(baseURL!) && !r.url().startsWith('data:'))
      external.push(r.url());
  });
  await page.goto('/');
  await page.waitForLoadState('load');
  expect(external).toEqual([]);
});

test('no secrets leak into the built output', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).not.toMatch(/RESEND_API_KEY|UPSTASH|re_[A-Za-z0-9]{20,}/);
});
