import { expect, test } from '@playwright/test';

const viewports = [
  { width: 360, height: 740 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];

for (const vp of viewports) {
  test(`no horizontal scroll or clipped hero at ${vp.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(vp);
    for (const path of ['/', '/es/', '/en/']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `${path} overflow`).toBeLessThanOrEqual(0);
      const box = await page.getByRole('heading', { level: 1 }).boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width);
    }
  });

  test(`interactive targets are at least 24px at ${vp.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('a, button, input, textarea')]
        .filter(
          (e) =>
            e.offsetParent !== null &&
            !e.closest('.trap') &&
            !e.classList.contains('skip-link'),
        )
        .map((e) => ({
          t: e.textContent?.trim().slice(0, 30),
          h: e.getBoundingClientRect().height,
          w: e.getBoundingClientRect().width,
        }))
        .filter((e) => e.h < 24 && e.w < 24),
    );
    expect(small).toEqual([]);
  });
}

test('hero video does not load with reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const videos: string[] = [];
  page.on('request', (r) => /\/video\//.test(r.url()) && videos.push(r.url()));
  await page.goto('/');
  await page.waitForTimeout(1500);
  expect(videos).toEqual([]);
  await context.close();
});

test('hero video loads after page load and can be paused', async ({ page }) => {
  await page.goto('/');
  const video = page.locator('[data-hero-video] video');
  await expect(video).toHaveAttribute('src', /\/video\/suite\.(webm|mp4)$/);
  const toggle = page.locator('[data-hero-video] .toggle');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await toggle.click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(false);
});
