import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const secret = (optional = true) =>
  envField.string({ context: 'server', access: 'secret', optional });

export default defineConfig({
  site: 'https://portfolio-fabiano.vercel.app',
  adapter: vercel(),
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'pt-br',
        locales: { 'pt-br': 'pt-BR', es: 'es', en: 'en' },
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  i18n: {
    defaultLocale: 'pt-br',
    locales: ['pt-br', 'es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  env: {
    schema: {
      WHATSAPP_NUMBER: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      RESEND_API_KEY: secret(),
      CONTACT_TO: secret(),
      CONTACT_FROM: secret(),
      UPSTASH_REDIS_REST_URL: secret(),
      UPSTASH_REDIS_REST_TOKEN: secret(),
      SITE_ORIGINS: secret(),
      CONTACT_RATE_LIMIT: envField.number({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CONTACT_DRY_RUN: envField.boolean({
        context: 'server',
        access: 'secret',
        default: false,
      }),
    },
  },
});
