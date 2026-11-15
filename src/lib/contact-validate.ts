export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type ValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; reason: 'invalid' | 'honeypot' };

const EMAIL =
  /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const clean = (v: unknown, max: number) =>
  typeof v === 'string'
    ? v
        .replace(CONTROL, '')
        .trim()
        .slice(0, max + 1)
    : '';

export function validateContact(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, reason: 'invalid' };
  }
  const raw = body as Record<string, unknown>;
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return { ok: false, reason: 'honeypot' };
  }
  const name = clean(raw.name, 100);
  const email = clean(raw.email, 200);
  const message = clean(raw.message, 2000);
  const valid =
    name.length >= 1 &&
    name.length <= 100 &&
    email.length <= 200 &&
    EMAIL.test(email) &&
    message.length >= 1 &&
    message.length <= 2000 &&
    !/[\r\n]/.test(name + email);
  return valid
    ? { ok: true, value: { name, email, message } }
    : { ok: false, reason: 'invalid' };
}

export function isAllowedOrigin(
  origin: string | null,
  allowed: string[],
): boolean {
  return origin !== null && allowed.includes(origin);
}
