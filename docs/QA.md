# QA do portfólio: plano e evidências

Todas as medições abaixo foram feitas em 14/11/2026, na máquina de desenvolvimento (Linux, Node 24.22, Playwright 1.65, Lighthouse via `@lhci/cli` 0.16.1), contra o build de produção servido por `npm run serve`. Nenhum número foi estimado.

## Camadas

| Camada              | Ferramenta                                                                                                  | Onde                                                                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unitários           | Playwright test (Node)                                                                                      | `tests/unit`: validação do formulário, limitador, schema de conteúdo quebra o build                                                                                           |
| E2E                 | Playwright em Chromium, Firefox e WebKit                                                                    | `tests/e2e/navigation`, `security`: idiomas, hreflang, JSON-LD, links externos, skip link, 404, robots/sitemap, cabeçalhos, CSP sem violações, nenhuma requisição a terceiros |
| Formulário          | Playwright (servidor dev com `CONTACT_DRY_RUN`)                                                             | `tests/e2e/contact`, `rate-limit`: válido, inválido, honeypot, origem estranha, tipo de conteúdo, corpo grande, só POST, 429                                                  |
| Responsivo          | Playwright, 360 / 768 / 1280 / 1920                                                                         | `tests/e2e/responsive`: sem rolagem horizontal, alvos ≥ 24 px, vídeo respeita `prefers-reduced-motion` e pode ser pausado                                                     |
| Acessibilidade      | `@axe-core/playwright` (WCAG 2.0/2.1/2.2 A e AA)                                                            | `tests/a11y`: 3 idiomas + 404, em 360 e 1280 px                                                                                                                               |
| Estrangulamento     | Playwright + CDP (4G 1,6 Mbps / 150 ms, CPU 4x)                                                             | `tests/perf`: LCP, CLS, pior interação, peso da primeira tela                                                                                                                 |
| Visual              | `toHaveScreenshot`                                                                                          | `tests/visual`: home em 4 larguras + trecho em inglês                                                                                                                         |
| Desempenho          | Lighthouse CI, mobile simulado, 3 execuções por página                                                      | `lighthouserc.json`                                                                                                                                                           |
| Estático            | ESLint, Prettier, `astro check` (TypeScript strictest), `npm audit --audit-level=high`, contraste da paleta | `npm run lint`, `typecheck`, `contrast`                                                                                                                                       |
| Orçamentos de build | `scripts/check-budgets.mjs`                                                                                 | imagem ≤ 200 KB e ≤ 2000 px, JS ≤ 70 KB gzip, CSS inline ≤ 14 KB gzip, vídeo ≤ 2 MB (≤ 700 KB mobile); quebra o build                                                         |

## Resultados

- Testes: **108 passaram** (`npm test`: Chromium, Firefox, WebKit, formulário, rate limit, unitários) e **5 visuais passaram**. Nenhum teste ignorado.
- Lighthouse CI (mediana de 3 execuções, mobile): Performance, Acessibilidade, Boas práticas e SEO = **100** nas três páginas. LCP 1,88 s, CLS 0,002, TBT 0 ms, 247 KB transferidos. Todos os orçamentos do `lighthouserc.json` passaram.
- Playwright com 4G e CPU 4x (build com tema escuro e Texturina no nome): LCP 764 ms, CLS 0,019, pior interação 16 ms (orçamento 200 ms), primeira tela 150 KB (sem contar o vídeo, que só carrega depois do `load`).
- JS inicial: 1,0 KB gzip (orçamento 70 KB). CSS crítico inline dentro do orçamento de 14 KB gzip.
- `npm audit --audit-level=high`: sem vulnerabilidades altas ou críticas. Resta 1 aviso moderado (`minimatch`, dependência de desenvolvimento do `typescript-eslint`).

## Decisões e ressalvas

- O orçamento de 14 KB de CSS é medido comprimido (gzip), que é o que importa para a primeira viagem de rede. Em bytes brutos o CSS inline tem cerca de 14,4 KB.
- A medição do LCP no Lighthouse (1,88 s) é simulada e fica perto do limite de 2,0 s; no Playwright com estrangulamento real ficou em ~0,5 s. O que sustenta a margem é o preload das duas fontes: sem o preload da fonte serifada o CLS subiu para 0,042 e o LCP para 724 ms no teste estrangulado.
- Os fallbacks das fontes foram medidos no navegador: Arial para Bricolage e Texturina, Times New Roman para Source Serif (esta máquina não tem Georgia, por isso Times New Roman, cuja métrica é a do Liberation Serif instalado). Também troquei `ch` por `em` nas larguras máximas dos textos, porque `ch` depende da fonte e causava reflow na troca (CLS 0,04 antes da troca).
- Texturina (OFL) é usada só no nome do hero: subset de 5 KB com as letras de "Fabiano Oliveira Silva", eixo de peso variável (800 no nome, 300 no sobrenome).
- Tema escuro vinho: "vidro" feito só com CSS (faixas de reflexo e brilho de borda), sem `backdrop-filter`, por causa da regra de glassmorphism do CLAUDE.md.
- O adapter da Vercel não tem `astro preview`; por isso `scripts/serve.mjs` serve o build com os mesmos cabeçalhos. Os cabeçalhos reais da Vercel só são confirmáveis após o primeiro deploy: conferir com `curl -I` e rodar `npx lhci autorun --collect.url=<url>`.
- A rota do formulário foi testada em modo `CONTACT_DRY_RUN` (valida, limita taxa, não envia). O envio real via Resend e o limitador Upstash precisam das chaves e não foram exercitados.
- Playwright em WebKit/Firefox cobre navegação e segurança; responsivo, axe, estrangulamento e visual rodam só em Chromium.
