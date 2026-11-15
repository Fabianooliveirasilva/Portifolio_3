import { expect, test } from '@playwright/test';

const valid = {
  name: 'Ana',
  email: 'ana@example.com',
  message: 'Olá, vaga de QA.',
};
const post = (
  request: import('@playwright/test').APIRequestContext,
  data: unknown,
  headers: Record<string, string> = {},
) =>
  request.post('/api/contact', {
    data,
    headers: { origin: 'http://localhost:4322', ...headers },
  });

test('valid submit shows the success message and clears the form', async ({
  page,
}) => {
  await page.goto('/#contact');
  await expect(page.locator('form[data-ready]')).toBeAttached();
  await page.getByLabel('Nome').fill(valid.name);
  await page.getByLabel('E-mail', { exact: true }).last().fill(valid.email);
  await page.getByLabel('Mensagem').fill(valid.message);
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(page.getByRole('status')).toContainText('Mensagem enviada');
  await expect(page.getByLabel('Nome')).toHaveValue('');
});

test('invalid submit marks the fields and announces the error', async ({
  page,
}) => {
  await page.goto('/en/#contact');
  await expect(page.locator('form[data-ready]')).toBeAttached();
  await page.getByLabel('Email', { exact: true }).last().fill('not-an-email');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status')).toContainText('Check the fields');
  await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Name')).toBeFocused();
});

test('honeypot field is hidden from users and assistive tech', async ({
  page,
}) => {
  await page.goto('/#contact');
  await expect(page.locator('.trap')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.trap input')).toHaveAttribute('tabindex', '-1');
});

test.describe('API', () => {
  test('accepts a valid message', async ({ request }) => {
    expect((await post(request, valid)).status()).toBe(200);
  });

  test('rejects invalid payloads with 400', async ({ request }) => {
    for (const bad of [
      {},
      { ...valid, email: 'nope' },
      { ...valid, name: '' },
      { ...valid, message: 'x'.repeat(2001) },
      { ...valid, email: 'a@b.co\nBcc: x@y.z' },
      [],
    ]) {
      expect(
        (await post(request, bad)).status(),
        JSON.stringify(bad).slice(0, 40),
      ).toBe(400);
    }
  });

  test('answers 200 to honeypot bots without doing anything different', async ({
    request,
  }) => {
    const response = await post(request, { ...valid, website: 'http://spam' });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test('rejects foreign origins, wrong content type and oversized bodies', async ({
    request,
  }) => {
    expect(
      (await post(request, valid, { origin: 'https://evil.example' })).status(),
    ).toBe(403);
    expect(
      (
        await request.post('/api/contact', {
          data: 'x=1',
          headers: {
            origin: 'http://localhost:4322',
            'content-type': 'text/plain',
          },
        })
      ).status(),
    ).toBe(415);
    expect(
      (await post(request, { ...valid, message: 'x'.repeat(20_000) })).status(),
    ).toBe(413);
  });

  test('only accepts POST', async ({ request }) => {
    expect((await request.get('/api/contact')).status()).toBe(405);
  });

  test('responses are not cacheable and reveal nothing', async ({
    request,
  }) => {
    const response = await post(request, { ...valid, email: 'nope' });
    expect(response.headers()['cache-control']).toBe('no-store');
    expect(await response.json()).toEqual({ ok: false });
  });
});
