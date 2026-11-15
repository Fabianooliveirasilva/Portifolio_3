import { expect, test } from '@playwright/test';

test.describe('4G + CPU 4x', () => {
  test('LCP, CLS, INP and first-screen weight stay inside the budget', async ({
    page,
    context,
  }) => {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.setViewportSize({ width: 412, height: 823 });

    await page.addInitScript(() => {
      const w = window as unknown as {
        __m: { lcp: number; cls: number; inp: number };
      };
      w.__m = { lcp: 0, cls: 0, inp: 0 };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) w.__m.lcp = e.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as {
          value: number;
          hadRecentInput: boolean;
        }[]) {
          if (!e.hadRecentInput) w.__m.cls += e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (/^(click|pointerdown|pointerup|keydown|keyup)$/.test(e.name))
            w.__m.inp = Math.max(w.__m.inp, e.duration);
        }
      }).observe({
        type: 'event',
        durationThreshold: 16,
        buffered: true,
      } as PerformanceObserverInit);
    });

    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    const weight = await page.evaluate(() => {
      const nav = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      const res = performance.getEntriesByType(
        'resource',
      ) as PerformanceResourceTiming[];
      return (
        nav.transferSize +
        res
          .filter((r) => !/\/video\//.test(r.name))
          .reduce((n, r) => n + r.transferSize, 0)
      );
    });

    await page.locator('[data-hero-video] .toggle').click();
    await page.getByRole('link', { name: 'Contato' }).first().click();
    await page.getByLabel('Nome').click();
    await page.getByLabel('Nome').pressSequentially('Ana', { delay: 30 });
    await page.getByRole('button', { name: 'Enviar mensagem' }).hover();
    await page.waitForTimeout(500);

    const m = await page.evaluate(
      () =>
        (
          window as unknown as {
            __m: { lcp: number; cls: number; inp: number };
          }
        ).__m,
    );
    console.log(
      `LCP ${m.lcp.toFixed(0)} ms, CLS ${m.cls.toFixed(3)}, worst interaction ${m.inp.toFixed(0)} ms, first-screen ${(weight / 1024).toFixed(0)} KB`,
    );
    expect(m.lcp).toBeLessThan(2000);
    expect(m.cls).toBeLessThan(0.05);
    expect(m.inp).toBeLessThan(200);
    expect(weight).toBeLessThan(500 * 1024);
  });
});
