# Arquitetura — Portfólio do Fabiano Oliveira Silva

Status: **Fase 2 com decisões respondidas; aguardando aprovação final**. Nenhum código do projeto existe ainda.
Conteúdo base: [CONTEUDO.md](CONTEUDO.md). Regras gerais: [../CLAUDE.md](../CLAUDE.md).

## 1. Objetivo e público

Site pessoal para recrutadores e líderes técnicos de QA (Espanha e internacional). Em 30 segundos o visitante precisa entender: quem é, o que sabe fazer, provas reais (4 projetos) e como falar com ele. Idiomas: PT-BR (padrão), ES, EN.

## 2. Stack e justificativa

| Camada         | Escolha                                                                                                                           | Por quê                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | **Astro** (SSG) + TypeScript estrito                                                                                              | HTML estático, zero JS por padrão. Um portfólio é conteúdo, não app. Next/React enviaria ≥ 80 KB de JS só para hidratar, estourando o orçamento de 70 KB antes do primeiro componente. |
| Estilo         | **CSS próprio** (custom properties, container queries, `clamp()`, `@layer`)                                                       | Sem Tailwind: o site tem poucos componentes e Tailwind adicionaria uma dependência e classes repetidas no HTML. CSS crítico fica inline por página (Astro faz inline de CSS pequeno).  |
| Conteúdo       | Astro Content Collections (Markdown + JSON tipados com schema Zod que já vem com o Astro)                                         | Sem CMS, validado em build: conteúdo faltando quebra o build, não a produção.                                                                                                          |
| i18n           | Roteamento nativo do Astro: `/` (PT-BR), `/es/`, `/en/`                                                                           | URLs separadas, `hreflang`, SEO por idioma, zero JS.                                                                                                                                   |
| Imagens        | `astro:assets` + `sharp`                                                                                                          | AVIF/WebP, `srcset`, `width`/`height` automáticos, tudo no build.                                                                                                                      |
| Animação       | CSS puro: View Transitions entre documentos (`@view-transition`), scroll-driven animations com `@supports`, `transform`/`opacity` | Sem biblioteca JS de animação.                                                                                                                                                         |
| Interatividade | Scripts vanilla minúsculos (vídeo, formulário, menu)                                                                              | Meta: **< 10 KB** de JS total, bem abaixo do teto de 70 KB.                                                                                                                            |
| Formulário     | Endpoint serverless do Astro (adapter Vercel)                                                                                     | Exige servidor para validar e limitar taxa.                                                                                                                                            |
| Deploy         | **Vercel**                                                                                                                        | Suporta o endpoint, headers por `vercel.json`, cache imutável, preview por PR. Cloudflare Pages seria equivalente; Vercel vence por exigir menos configuração do adapter.              |

### Dependências (todas fixadas em versão exata, `npm ci`, `npm audit` no CI)

Produção: `astro`, `@astrojs/vercel`, `@astrojs/sitemap`, `sharp`, `@upstash/ratelimit` + `@upstash/redis` (limite de taxa; em serverless a memória não persiste entre invocações, então um limite em memória seria inútil).
Dev/QA: `typescript`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`, `eslint`, `prettier`.
Não entram: Tailwind, React, GSAP/Framer, biblioteca de ícones, biblioteca de validação extra, SDK de e-mail (chamada `fetch` direta à API).

## 3. Mapa de seções

Seções com alturas e ritmos diferentes de propósito.

| #   | Seção                      | Conteúdo                                                                                                                              | Observação                                                                                                            |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero**                   | Nome, título, frase de posicionamento, status ("mudando para a Espanha, aberto a remoto/híbrido/presencial"), foto, vídeo curto       | O elemento LCP é o poster/foto, nunca o vídeo.                                                                        |
| 2   | **Trabalho** (4 destaques) | QA-Testing-Manager, API-Testing-Framework, QA.Ecommerce-Playwright, DEV-PULSE-AI. Problema, o que testei/construí, stack, link GitHub | Tamanhos e posições diferentes, grid assimétrico. Sem métricas inventadas.                                            |
| 3   | **Outros projetos**        | Lista de uma linha: SENTINELX, Black Smoke Burger, sites front-end                                                                    | Sem imagem.                                                                                                           |
| 4   | **O que faço em QA**       | Testes manuais, API, E2E, dados/SQL, IA aplicada a testes                                                                             | Substitui "Serviços": o CV busca emprego, não clientes. **Decisão pendente, ver seção 14.**                           |
| 5   | **Trajetória**             | Eletricista (2010–2024) → front-end → QA, formação e cursos                                                                           | Narrativa curta: como o diagnóstico de falhas em campo virou QA. Texto na voz dele, escrito na Fase 4 a partir do CV. |
| 6   | **Stack**                  | Ferramentas agrupadas em texto/lista (sem barras de porcentagem)                                                                      |                                                                                                                       |
| 7   | **Contato**                | E-mail (ofuscado) + formulário, LinkedIn, GitHub, idiomas falados                                                                     | Sem WhatsApp e sem download de CV.                                                                                    |

Rodapé mínimo: idioma, links, ano. Seletor de idioma no cabeçalho (links reais, sem JS).

## 4. Estrutura de pastas

```
.
├── CLAUDE.md
├── docs/                      ARCHITECTURE.md, CONTEUDO.md, QA.md
├── assets-originais/          fotos/vídeos brutos (fora do build e do deploy)
├── public/
│   ├── fonts/                 woff2 subset, self-hosted
│   └── video/                 mp4/webm otimizados + posters
├── src/
│   ├── content/
│   │   ├── config.ts          schemas (Zod)
│   │   ├── projects/          1 JSON por projeto (strings por idioma)
│   │   └── pages/             Markdown por idioma (sobre, trajetória)
│   ├── i18n/                  ui.ts (strings de interface), utils.ts
│   ├── assets/images/         originais já reduzidos (≤ 2000 px)
│   ├── components/            Hero, ProjectFeature, ProjectList, Timeline, ContactForm, LangSwitch, SEO
│   ├── layouts/Base.astro
│   ├── pages/                 index.astro, es/index.astro, en/index.astro, api/contact.ts, 404.astro
│   ├── scripts/               video.ts, contact.ts (cada um < 3 KB)
│   └── styles/                tokens.css, base.css, layout.css, (um CSS por componente via scoped)
├── tests/                     e2e/, a11y/, visual/
├── lighthouserc.json
├── playwright.config.ts
├── vercel.json                headers + cache
└── .github/workflows/ci.yml
```

## 5. Fluxo de dados

`content/*.json|md` → validação Zod no build → componentes `.astro` recebem props tipadas → HTML estático por idioma. Strings de interface em `i18n/ui.ts` (tipo `Record<Lang, …>`; chave faltando em um idioma quebra o typecheck). O único dado dinâmico é o POST do formulário.

## 6. Design system (tokens; valores finais na Fase 3)

- **Tipografia:** no máximo 2 famílias, woff2, subset (latin + latin-ext para ç, ñ, acentos), `font-display: swap`, `preload` só da fonte do título, `size-adjust` no fallback para CLS zero. Escolha das famílias na Fase 3.
- **Escala:** tipográfica fluida com `clamp()` (razão ~1.25 a 1.333); espaçamento em base 4 px (4, 8, 12, 16, 24, 32, 48, 64, 96, 144).
- **Paleta:** vinho/bordô como cor de identidade, com neutros quentes. Papéis definidos: `--bg`, `--surface`, `--ink`, `--ink-muted`, `--accent`, `--accent-ink`, `--line`. Contraste mínimo 4.5:1 em texto (3:1 em texto grande e UI) verificado por script.
- **Grid:** 12 colunas com assimetria intencional; container queries nos cards de projeto. Breakpoints de teste: 360, 768, 1280, 1920.
- **Tema:** um tema único (vinho). `color-scheme` e modo escuro só se a Fase 3 justificar.
- Todos os valores em custom properties em `tokens.css`. Nenhum valor mágico nos componentes.

## 7. Estratégia de mídia

### Imagens

- AVIF + WebP (fallback JPEG), `srcset`/`sizes`, **máximo 2000 px** de largura, qualidade 60–75 (foto) e AVIF para capturas de tela.
- `width`/`height` sempre definidos (CLS zero). LCP: `fetchpriority="high"`, sem `loading="lazy"`. Todo o resto: `loading="lazy"` + `decoding="async"`.
- Placeholder LQIP: miniatura ≤ 20 px (~300 B) em base64 como `background-image` do wrapper, ou cor dominante.
- Peso alvo: hero ≤ 120 KB; capturas de projeto ≤ 80 KB cada, carregadas sob demanda.
- Regra de build: script falha se qualquer imagem final passar de 200 KB ou 2000 px.

### Vídeo

- Hero: MP4 (H.264) + WebM (VP9/AV1), **5–12 s, sem áudio**, `muted playsinline loop`, `preload="none"`, `poster` AVIF/WebP otimizado.
- Mostra o poster primeiro; `video.ts` (IntersectionObserver) só troca para o vídeo depois do `load` da página e quando visível, e faz play/pause conforme entra e sai da tela.
- ≤ 2 MB desktop (1280 px), ≤ 700 KB mobile (720 px) via `<source media>`. Com `prefers-reduced-motion` ou `Save-Data`, o vídeo nunca carrega.
- **Sugestão de conteúdo real:** como a foto tem aparência de IA (ver CONTEUDO.md), o vídeo do hero pode ser uma gravação de tela de 8 s de uma suíte Playwright rodando nos seus projetos (terminal passando testes + relatório). É material verdadeiro, leve e conta a história de QA. Decisão na Fase 3.
- Capturas dos projetos: QA-Testing-Manager e DEV-PULSE-AI já têm screenshots nos repositórios. As outras duas serão geradas rodando os testes (relatório HTML do Playwright). Até lá, `TODO-CONTEUDO`.

## 8. Interatividade e animação

- Navegação entre páginas/idiomas: `@view-transition { navigation: auto; }` (CSS, sem JS, ignorado onde não há suporte).
- Revelações no scroll: `animation-timeline: view()` dentro de `@supports`. Sem suporte, o conteúdo aparece direto (nunca escondido por padrão).
- Só `transform` e `opacity`. `@media (prefers-reduced-motion: reduce)` desliga tudo, inclusive o vídeo.
- Microinterações: hover/focus/active nos links e cards, estado do botão de envio, sublinhado animado. Nada de partículas, cursor trail ou WebGL.
- JS no total: `video.ts`, `contact.ts`, menu mobile (se houver). Sem framework, sem biblioteca de animação.

## 9. Orçamentos de performance (obrigatórios)

| Métrica                                 | Orçamento                         | Como é imposto                                                |
| --------------------------------------- | --------------------------------- | ------------------------------------------------------------- |
| Lighthouse mobile (Perf, A11y, BP, SEO) | ≥ 95 cada                         | Lighthouse CI `assert` quebra o build                         |
| LCP / CLS / INP (4G, CPU 4x)            | < 2,0 s / < 0,05 / < 200 ms       | LHCI + teste Playwright com throttling                        |
| JS inicial                              | < 70 KB gzip (meta real: < 10 KB) | `resource-summary` no LHCI + script de build                  |
| CSS crítico                             | inline, ≤ 14 KB                   | script de build                                               |
| Peso da 1ª tela                         | < 500 KB                          | LHCI `total-byte-weight` + teste Playwright por transferência |
| Imagem individual                       | ≤ 200 KB e ≤ 2000 px              | script de build                                               |

Medir antes de afirmar: nenhum número de LCP/INP/CLS vai para o relatório sem medição em execução real.

## 10. Segurança

Headers via `vercel.json` (e conferidos por teste E2E):

- `Content-Security-Policy`: `default-src 'self'`; `script-src 'self'` (sem `unsafe-inline`; scripts em arquivos; se algum inline for necessário, usa hash); `style-src 'self'` + hashes para CSS crítico inline; `img-src 'self' data:`; `media-src 'self'`; `font-src 'self'`; `connect-src 'self'`; `frame-ancestors 'none'`; `base-uri 'none'`; `form-action 'self'`; `object-src 'none'`. Nenhum terceiro (sem analytics externo, sem fontes do Google).
- `Strict-Transport-Security` (2 anos, includeSubDomains, preload), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` com tudo negado (câmera, microfone, geolocalização etc.), `Cross-Origin-Opener-Policy: same-origin`.
- **Formulário** (`api/contact.ts`): aceita só POST JSON, limite de tamanho, validação e saneamento no servidor, campo honeypot, limite de taxa por IP (Upstash), checagem de `Origin`, resposta genérica. Envio por e-mail via API transacional; chave só em variável de ambiente do servidor. Nenhum segredo no front-end nem no repositório (`.env.example` sem valores, Gitleaks no CI).
- **E-mail público:** ofuscado no HTML (montado em tempo de execução por script ou imagem/`mailto` decodificado) contra coletores de spam, com fallback ao formulário.
- Links externos com `rel="noopener noreferrer"`. `npm audit --audit-level=high` no CI; Dependabot habilitado; versões exatas.
- Revisão final com `/security-review` na Fase 5.

## 11. Acessibilidade (WCAG 2.2 AA)

HTML semântico (`header`, `nav`, `main`, `section` com `aria-labelledby`, `footer`), um `h1`, hierarquia correta; link "pular para o conteúdo"; foco visível de alto contraste (`:focus-visible`), alvos ≥ 24 px (2.5.8); navegação 100% por teclado; `lang` correto por página e `lang` em trechos em outro idioma; alt text descritivo escrito por pessoa (decorativas com `alt=""`); vídeo decorativo sem áudio, com pausa acessível; formulário com `label`, erros anunciados (`aria-live`), sem depender só de cor; contraste verificado. Verificação: axe no CI + revisão manual com teclado e leitor de tela.

## 12. SEO

`<title>` e `meta description` por idioma; canonical; `hreflang` (pt-BR, es, en, x-default); Open Graph/Twitter com imagem 1200×630 gerada no build; JSON-LD `Person` (nome, jobTitle, url, sameAs LinkedIn/GitHub, knowsLanguage, alumniOf); `sitemap.xml` (`@astrojs/sitemap`) e `robots.txt`; favicon SVG; 404 própria. **Sem inventar dados**: `address` só com cidade/país quando ele confirmar.

## 13. Plano de QA

| Camada         | Ferramenta                                                             | O que cobre                                                                                                                                           |
| -------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| E2E            | Playwright (Chromium, Firefox, WebKit)                                 | navegação, troca de idioma, links de projeto, formulário (válido, inválido, honeypot, rate limit), headers de segurança, ausência de erros no console |
| Responsivo     | Playwright, viewports 360, 768, 1280, 1920                             | sem scroll horizontal, sem sobreposição                                                                                                               |
| Acessibilidade | `@axe-core/playwright`                                                 | 0 violações em todas as páginas e idiomas                                                                                                             |
| Performance    | Lighthouse CI (mobile e desktop)                                       | orçamentos da seção 9, **quebram o build**                                                                                                            |
| Throttling     | Playwright/CDP: 4G + CPU 4x                                            | LCP, CLS, INP e jank de scroll                                                                                                                        |
| Visual         | `toHaveScreenshot` nas seções principais                               | regressão visual por viewport                                                                                                                         |
| Qualidade      | ESLint, Prettier, `tsc --noEmit`, `astro check`, `npm audit`, Gitleaks | gate no CI                                                                                                                                            |

CI (GitHub Actions): lint → typecheck → build → testes → Lighthouse CI → audit. Deploy só com tudo verde. Plano e evidências em `docs/QA.md`.

## 14. Deploy

Vercel, branch `main` em produção, PRs em preview. `vercel.json`: headers da seção 10; `/_astro/*` e `/fonts/*` com `Cache-Control: public, max-age=31536000, immutable`; HTML com `max-age=0, must-revalidate`. Domínio próprio e DNS: `TODO-CONTEUDO` (precisa de decisão dele). Variáveis de ambiente: chave do e-mail, URL/token do Upstash, e-mail de destino.

## 15. Decisões (respondidas)

**Resolvido:** 1 manter formulário; 2 "O que faço em QA"; 3 vídeo = gravação de tela de testes; 4 `.vercel.app` por enquanto (domínio próprio = `TODO-CONTEUDO`). Texto original abaixo.

1. **Formulário:** a regra pede servidor + honeypot + rate limit, o que adiciona Upstash e um serviço de e-mail (ambos têm plano gratuito). Alternativa mais simples e sem backend: só e-mail ofuscado + `mailto`, mas aí cai a exigência do formulário. Recomendo manter o formulário.
2. **"Serviços":** trocar por "O que faço em QA" (recomendado, pois o objetivo é emprego) ou manter uma seção de serviços freelance?
3. **Vídeo do hero:** gravação de tela de testes rodando (recomendado) ou outro material seu?
4. **Domínio:** já tem um ou usamos o `.vercel.app` por enquanto?

## 16. Lista de tarefas (ordem e critério de "pronto")

| #   | Tarefa                                                                | Pronto quando                                                                 |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 0   | Fase 3: direção visual aprovada                                       | 2 propostas apresentadas, 1 escolhida                                         |
| 1   | Scaffold: Astro, TS estrito, ESLint, Prettier, scripts, versões fixas | `npm run build`, `lint` e `typecheck` passam; `npm audit` sem high            |
| 2   | Design tokens, fontes subset, base CSS, layout base                   | tokens aplicados, fonte sem CLS, contraste validado                           |
| 3   | i18n: rotas PT/ES/EN, `ui.ts`, seletor de idioma, hreflang            | 3 rotas geram HTML; chave faltando quebra o typecheck                         |
| 4   | Content collections e schemas                                         | conteúdo inválido quebra o build                                              |
| 5   | Pipeline de mídia e script de limites                                 | imagem > 200 KB ou > 2000 px falha o build                                    |
| 6   | Seção Hero (poster, vídeo sob demanda)                                | LCP medido < 2,0 s; JS do vídeo < 3 KB; reduced-motion respeitado             |
| 7   | Seção Trabalho (4 destaques)                                          | responsivo 360–1920, imagens lazy, CLS 0, links corretos                      |
| 8   | Outros projetos + Trajetória + O que faço + Stack                     | textos revisados por você, nenhum dado inventado, `TODO-CONTEUDO` onde faltar |
| 9   | Contato: formulário + endpoint                                        | testes de válido/inválido/honeypot/rate limit passam; sem segredo no bundle   |
| 10  | Headers, CSP, cache imutável                                          | teste E2E confere cada header; CSP sem violações no console                   |
| 11  | SEO: meta, OG, JSON-LD, sitemap, robots                               | validadores sem erro; hreflang correto                                        |
| 12  | Acessibilidade e microinterações                                      | axe 0 violações; teclado e foco revisados                                     |
| 13  | Suíte E2E, responsivo, visual                                         | verde em 3 navegadores e 4 viewports                                          |
| 14  | Lighthouse CI + throttling 4G/CPU 4x                                  | orçamentos da seção 9 atingidos; build quebra se falhar                       |
| 15  | Revisão de segurança                                                  | `/security-review` sem pendências críticas                                    |
| 16  | Deploy e relatório final                                              | site no ar; relatório com notas, peso por página, pendências                  |
