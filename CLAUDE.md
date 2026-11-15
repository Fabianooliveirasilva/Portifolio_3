# Portfólio — Fabiano Oliveira Silva (QA Engineer)

Site de portfólio pessoal, bonito e leve. Referência só de estrutura: victorvarella.vercel.app (pesada, não copiar os erros).
Público: recrutadores de QA (Espanha/internacional, remoto/híbrido). Idiomas do site: PT-BR (padrão), ES e EN.

## Processo (obrigatório)

- Fases: 1 skills → 2 `docs/ARCHITECTURE.md` → 3 direção visual → 4 implementação → 5 QA/entrega.
- NÃO escrever código do projeto antes de concluir Fases 1–3 e o usuário aprovar. Parar ao fim de cada fase com resumo curto.
- Fase 4: uma seção por vez; rodar lint, typecheck e teste dela; resumo de no máximo 5 linhas, sem colar código.
- Mudar a arquitetura aprovada só perguntando antes.

## Stack (proposta, confirmar na Fase 2)

Astro + TypeScript, JS zero por padrão, ilhas só onde preciso. CSS moderno (custom properties, container queries). Conteúdo em Markdown/JSON tipados, sem CMS. Deploy Vercel ou Cloudflare Pages.

## Orçamentos (quebram o build)

- Lighthouse mobile ≥ 95 (Perf, A11y, Best Practices, SEO)
- LCP < 2,0 s, CLS < 0,05, INP < 200 ms em 4G
- JS inicial < 70 KB gzip, CSS crítico inline, primeira tela < 500 KB

## Cor

Paleta voltada ao vinho (bordô/borgonha). Definir tons exatos na Fase 3.

## Mídia

- Imagens AVIF/WebP, `srcset`/`sizes`, máx. 2000 px, lazy abaixo da dobra, `width`/`height` fixos, LQIP.
- Vídeo 5–12 s, sem áudio, `muted playsinline loop`, `preload="none"`, poster primeiro, play/pause via IntersectionObserver, ≤ 2 MB desktop (versão menor no mobile).
- Fotos originais em `./assets-originais/` (nunca servir direto; otimizar no build).

## Animação

Só `transform` e `opacity`; CSS / View Transitions / scroll-driven nativos; respeitar `prefers-reduced-motion`. Sem partículas, cursor trail ou WebGL.

## Segurança

CSP estrita, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors. Sem segredos no front. Formulário: validação no servidor, honeypot, rate limit. Links externos com `rel="noopener noreferrer"`. Dependências mínimas e fixadas; `npm audit`.

## Acessibilidade e SEO

WCAG 2.2 AA, teclado, foco visível, alt text real, HTML semântico. Meta, Open Graph, JSON-LD (Person), sitemap, robots.

## Design — proibido parecer feito por IA

Sem gradiente roxo/azul, blobs, glassmorphism, glow neon, tudo centralizado, grid 3×3 de cards idênticos, emoji como ícone, clichês ("Transformando ideias em realidade"), Inter + preto + gradiente, seções de mesma altura/ritmo.
Usar: direção editorial, tipografia expressiva (máx. 2 famílias, self-hosted, subset, `font-display: swap`), grid assimétrico intencional, microinterações discretas.

## Conteúdo

- Textos na voz do Fabiano, a partir do CV e do que ele informar.
- Faltou material → placeholder `TODO-CONTEUDO`. NUNCA inventar métricas, clientes, depoimentos ou projetos.
- Dados do CV: ver `docs/CONTEUDO.md` (CV + GitHub).

## QA

Playwright E2E (navegação, formulário, 360/768/1280/1920), axe, Lighthouse CI com orçamentos, regressão visual.

## Skills do projeto (`.claude/skills/`)

`frontend-design` (plugin global), `webapp-testing`, `accessibility`, `core-web-vitals`, `web-design-guidelines`; segurança via `/security-review`.
Código: limpo e mínimo, sem abstração prematura, sem comentário óbvio, dependência nova exige justificativa.
