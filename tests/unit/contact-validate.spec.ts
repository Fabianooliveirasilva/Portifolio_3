import { expect, test } from '@playwright/test';
import {
  isAllowedOrigin,
  validateContact,
} from '../../src/lib/contact-validate.ts';
import { createMemoryLimiter } from '../../src/lib/rate-limit.ts';

const ok = { name: ' Ana ', email: 'ana@example.com', message: 'Oi' };

test('trims and accepts valid input', () => {
  expect(validateContact(ok)).toEqual({
    ok: true,
    value: { name: 'Ana', email: 'ana@example.com', message: 'Oi' },
  });
});

test('strips control characters', () => {
  const r = validateContact({ ...ok, message: 'a\u0000b\u0007c' });
  expect(r).toMatchObject({ ok: true, value: { message: 'abc' } });
});

test('rejects header injection, bad emails and over-long fields', () => {
  for (const bad of [
    { ...ok, email: 'a@b.co\r\nBcc: x@y.z' },
    { ...ok, name: 'A\nB' },
    { ...ok, email: 'plain' },
    { ...ok, email: 'a b@c.de' },
    { ...ok, name: 'x'.repeat(101) },
    { ...ok, message: '' },
    { ...ok, message: 'x'.repeat(2001) },
    { name: 1, email: 2, message: 3 },
    null,
    'string',
  ]) {
    expect(validateContact(bad)).toMatchObject({ ok: false });
  }
});

test('flags honeypot', () => {
  expect(validateContact({ ...ok, website: 'x' })).toEqual({
    ok: false,
    reason: 'honeypot',
  });
  expect(validateContact({ ...ok, website: '  ' })).toMatchObject({ ok: true });
});

test('origin allow list', () => {
  expect(isAllowedOrigin('https://a.dev', ['https://a.dev'])).toBe(true);
  expect(isAllowedOrigin(null, ['https://a.dev'])).toBe(false);
  expect(isAllowedOrigin('https://b.dev', ['https://a.dev'])).toBe(false);
});

test('memory limiter blocks after the limit and is per key', async () => {
  const l = createMemoryLimiter(2, 60_000);
  expect([
    await l.allow('a'),
    await l.allow('a'),
    await l.allow('a'),
    await l.allow('b'),
  ]).toEqual([true, true, false, true]);
});
