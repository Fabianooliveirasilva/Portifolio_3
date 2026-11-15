import { expect, test } from '@playwright/test';

test('blocks after the limit with 429', async ({ request }) => {
  const send = () =>
    request.post('/api/contact', {
      data: { name: 'Ana', email: 'ana@example.com', message: 'oi' },
      headers: { origin: 'http://localhost:4323' },
    });
  const statuses: number[] = [];
  for (let i = 0; i < 5; i++) statuses.push((await send()).status());
  expect(statuses).toEqual([200, 200, 200, 429, 429]);
});
