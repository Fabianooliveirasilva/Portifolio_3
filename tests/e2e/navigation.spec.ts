import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', lang: 'pt-BR', h1: 'Fabiano Oliveira Silva' },
  { path: '/es/', lang: 'es', h1: 'Fabiano Oliveira Silva' },
  { path: '/en/', lang: 'en', h1: 'Fabiano Oliveira Silva' },
];

for (const { path, lang, h1 } of pages) {
  test.describe(`${path}`, () => {
    test('renders with correct lang, one h1 and no console errors', async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(
        h1.split(' ')[0]!,
      );
      await page.waitForLoadState('load');
      expect(errors).toEqual([]);
    });

    test('has canonical, hreflang, Open Graph and Person JSON-LD', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      for (const l of ['pt-BR', 'es', 'en', 'x-default']) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${l}"]`),
        ).toHaveCount(1);
      }
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /og\.png$/,
      );
      const ld = JSON.parse(
        (await page
          .locator('script[type="application/ld+json"]')
          .textContent())!,
      );
      expect(ld['@type']).toBe('Person');
      expect(ld.sameAs).toHaveLength(2);
    });

    test('shows four featured projects with safe external links', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator('#work article')).toHaveCount(4);
      const external = page.locator('a[target="_blank"]');
      const count = await external.count();
      expect(count).toBeGreaterThanOrEqual(6);
      for (let i = 0; i < count; i++) {
        await expect(external.nth(i)).toHaveAttribute(
          'rel',
          'noopener noreferrer',
        );
      }
    });

    test('skip link moves focus to main', async ({ page }) => {
      await page.goto(path);
      await page.keyboard.press('Tab');
      const skip = page.locator('.skip-link');
      await expect(skip).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#main$/);
    });

    test('does not expose the email address', async ({ page, request }) => {
      await page.goto(path);
      await expect(
        page.locator('[data-email], a[href^="mailto:"]'),
      ).toHaveCount(0);
      expect(await (await request.get(path)).text()).not.toContain('hotmail');
    });
  });
}

test('language switcher navigates between languages', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Idioma' })
    .getByRole('link', { name: 'ES' })
    .click();
  await expect(page).toHaveURL(/\/es\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page
    .getByRole('navigation', { name: 'Idioma' })
    .getByRole('link', { name: 'EN' })
    .click();
  await expect(page).toHaveURL(/\/en\/$/);
  await page
    .getByRole('navigation', { name: 'Language' })
    .getByRole('link', { name: 'PT' })
    .click();
  await expect(page).toHaveURL(/localhost:\d+\/$/);
});

test('section links reach each section', async ({ page }) => {
  await page.goto('/en/');
  for (const id of ['education', 'skills', 'work', 'qa', 'path', 'contact']) {
    await expect(page.locator(`a[href="/en/#${id}"]`).first()).toBeVisible();
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('unknown route returns the 404 page', async ({ page }) => {
  const response = await page.goto('/nao-existe');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
});

test('robots and sitemap are served', async ({ request }) => {
  expect((await request.get('/robots.txt')).ok()).toBeTruthy();
  const sitemap = await request.get('/sitemap-0.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('/es/');
});
