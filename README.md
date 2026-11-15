# Portfólio — Fabiano Oliveira Silva

Site estático em Astro (PT-BR, ES, EN). Regras do projeto em [CLAUDE.md](CLAUDE.md), arquitetura em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), direção visual em [docs/DESIGN.md](docs/DESIGN.md), plano e evidências de QA em [docs/QA.md](docs/QA.md), pendências em [docs/PENDENCIAS.md](docs/PENDENCIAS.md).

## Comandos

Requer Node 24 (`nvm use`).

| Comando                                   | O que faz                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`                             | servidor de desenvolvimento                                                                 |
| `npm run build`                           | build + cabeçalhos/CSP (`scripts/postbuild.mjs`) + orçamentos (`scripts/check-budgets.mjs`) |
| `npm run serve`                           | serve o build local com os mesmos cabeçalhos da Vercel (o adapter não tem `astro preview`)  |
| `npm run lint` / `typecheck` / `contrast` | ESLint + Prettier, `astro check`, contraste da paleta                                       |
| `npm test`                                | Playwright: E2E (3 navegadores), formulário, rate limit, unitários                          |
| `npm run test:visual`                     | regressão visual (`npx playwright test --project=visual --update-snapshots` para atualizar) |
| `npx lhci autorun`                        | Lighthouse CI com orçamentos (defina `CHROME_PATH` se necessário)                           |

## Conteúdo

- Textos por idioma: `src/content/profile/{pt-br,es,en}.json`. Projetos: `src/content/projects/*.json`. Conteúdo inválido quebra o build.
- Strings de interface: `src/i18n/ui.ts` (chave faltando em um idioma quebra o typecheck).
- Imagens originais em `assets-originais/` (nunca servidas); as otimizadas saem de `src/assets/images/`.

## Deploy (Vercel)

1. Importar o repositório; framework Astro; Node 24.
2. Variáveis de ambiente (ver `.env.example`): `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `SITE_ORIGINS` (domínio próprio, se houver), `WHATSAPP_NUMBER` (opcional: só dígitos com DDI; sem ele o botão do WhatsApp não aparece). Sem Upstash e sem chave de e-mail, o formulário responde 503 (falha fechada).
3. Cabeçalhos de segurança e cache são gravados em `.vercel/output/config.json` pelo `postbuild`.
4. Ao trocar o domínio, atualizar `site` em `astro.config.ts`, `public/robots.txt` e rodar `node scripts/og.mjs` se mudar a imagem social.
