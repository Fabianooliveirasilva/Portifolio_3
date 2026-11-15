import type { APIRoute } from 'astro';
import {
  CONTACT_DRY_RUN,
  CONTACT_FROM,
  CONTACT_RATE_LIMIT,
  CONTACT_TO,
  RESEND_API_KEY,
  SITE_ORIGINS,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from 'astro:env/server';
import { isAllowedOrigin, validateContact } from '../../lib/contact-validate';
import {
  createMemoryLimiter,
  createUpstashLimiter,
  type Limiter,
} from '../../lib/rate-limit';

export const prerender = false;

const MAX_BYTES = 8 * 1024;
const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });

let limiter: Limiter | undefined;
const getLimiter = (): Limiter | undefined => {
  if (limiter) return limiter;
  if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
    limiter = createUpstashLimiter(
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN,
    );
  } else if (CONTACT_DRY_RUN) {
    limiter = createMemoryLimiter(CONTACT_RATE_LIMIT);
  }
  return limiter;
};

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  const allowed = [
    url.origin,
    ...(SITE_ORIGINS?.split(',').map((o) => o.trim()) ?? []),
  ];
  if (!isAllowedOrigin(request.headers.get('origin'), allowed))
    return json(403, { ok: false });
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return json(415, { ok: false });
  }
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > MAX_BYTES) return json(413, { ok: false });

  const sender = getLimiter();
  if (!sender) return json(503, { ok: false });
  if (!(await sender.allow(clientAddress))) return json(429, { ok: false });

  const text = await request.text();
  if (text.length > MAX_BYTES) return json(413, { ok: false });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json(400, { ok: false });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return result.reason === 'honeypot'
      ? json(200, { ok: true })
      : json(400, { ok: false });
  }
  if (CONTACT_DRY_RUN) return json(200, { ok: true });
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM)
    return json(503, { ok: false });

  const { name, email, message } = result.value;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: `${message}\n\n${name} <${email}>`,
    }),
  });
  return response.ok ? json(200, { ok: true }) : json(502, { ok: false });
};

export const ALL: APIRoute = () => json(405, { ok: false });
