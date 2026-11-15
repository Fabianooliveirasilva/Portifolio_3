import { expect, test } from '@playwright/test';

const viewports = [
  { width: 360, height: 740 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];

test.use({ reducedMotion: 'reduce' });

for (const vp of viewports) {
  test(`home at ${vp.width}px`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      scrollTo(0, 0);
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`home-${vp.width}.png`, {
      fullPage: true,
    });
  });
}

test('english home at 1280px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/en/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot('home-en-1280-fold.png');
});
