# Direção visual (Fase 3): duas propostas

Status: **aguardando escolha**. Valores de cor são candidatos; contraste (4.5:1 texto, 3:1 UI) é verificado por script antes de entrar em `tokens.css`.

Ideia comum às duas: o mundo do Fabiano é **diagnóstico**. Eletricista que achava a falha no circuito, hoje QA que acha o bug no sistema. A identidade sai daí (laudo, relatório de execução, quadro de disjuntores), não de um template de portfólio.

## Proposta A: "Laudo" (claro, documento técnico)

**Conceito:** o site é um relatório de inspeção. Fundo de papel levemente rosado, tinta bordô, marcas de status (aprovado / falhou / pendente) como única estrutura gráfica, porque o conteúdo é realmente sobre execução de testes. Cada projeto destaque é um "registro de execução" com problema, o que foi testado, stack.

**Cores**

| Papel                            | Nome               | Hex       |
| -------------------------------- | ------------------ | --------- |
| `--bg`                           | Papel rosado       | `#F1E9E7` |
| `--surface`                      | Folha              | `#FAF6F4` |
| `--ink`                          | Tinta vinho-escuro | `#2A0E15` |
| `--ink-muted`                    | Vinho acinzentado  | `#6B4F55` |
| `--accent`                       | Bordô              | `#7A1330` |
| `--line`                         | Traço              | `#D4C3C1` |
| `--ok` (só no marcador "passou") | Verde garrafa      | `#2F5D3A` |

**Tipografia (2 famílias, self-hosted, subset)**

- Títulos e nome: **Bricolage Grotesque** (variável, eixo de largura; o nome em corpo enorme, condensado no mobile).
- Texto: **Source Serif 4** (leitura longa, entrelinha 1.6, linhas < 70 caracteres).

**Layout:** coluna esquerda estreita fixa com nome e idioma, conteúdo à direita em grid 12 colunas assimétrico. Hero: nome gigante alinhado à esquerda, abaixo a frase e o status "mudando para a Espanha"; à direita o vídeo de 8 s da suíte Playwright passando (poster primeiro). Destaques com tamanhos diferentes (um largo, dois médios, um estreito). Alinhamento sempre à esquerda; nada centralizado.

```
| Fabiano        |  Fabiano Oliveira Silva (enorme)        |
| Oliveira       |  QA. Acho a falha antes do usuário.     |
| Silva          |  [vídeo/poster 16:9 ........]  Espanha  |
| PT ES EN       |----------------------------------------|
|                |  [ projeto 1 largo ........... ] passou |
|                |  [ projeto 2 ] [ projeto 3 ]            |
|                |  [ projeto 4 estreito ]                 |
```

**Elemento memorável:** a marca de status ao lado de cada item (um quadrado que "preenche" ao entrar na tela, só `transform`/`opacity`). Todo o resto é quieto.

**Risco:** parecer "papel creme + serif" (tendência comum). Mitigado por papel rosado frio, sans de largura variável no título e o sistema de status com função real.

## Proposta B: "Rótulo" (escuro vinho, tipografia como imagem)

**Conceito:** fundo bordô profundo, como o rótulo e a garrafa. A tipografia é a imagem: nome em fonte condensada alta ocupando a largura da tela. Sem foto grande; foto pequena recortada e vídeo no hero.

**Cores**

| Papel         | Nome              | Hex       |
| ------------- | ----------------- | --------- |
| `--bg`        | Borgonha profundo | `#2B0A16` |
| `--surface`   | Borgonha elevado  | `#3B1220` |
| `--ink`       | Osso              | `#F3E8E4` |
| `--ink-muted` | Rosé apagado      | `#C7A9AC` |
| `--accent`    | Dourado velho     | `#C9A45C` |
| `--line`      | Traço             | `#5A2434` |

**Tipografia**

- Títulos: **Big Shoulders Display** (condensada, peso 800, caixa normal, não maiúsculas).
- Texto: **Newsreader** (serif de texto, opsz variável).

**Layout:** nome em 3 linhas, preenchendo a largura; texto em coluna única deslocada à direita (alinhamento esquerdo). Destaques em faixas de alturas diferentes, separadas por linhas finas, sem cards.

```
| FABIANO                              |
| OLIVEIRA            [vídeo 4:5]      |
| SILVA                                |
|      QA que acha a falha... texto    |
|--------------------------------------|
| projeto 1 (faixa alta) ........ link |
| projeto 2 (faixa baixa) ....... link |
```

**Elemento memorável:** o nome em escala gigante.

**Risco:** fundo escuro com acento dourado lembra marca de luxo/vinícola; para um QA pode soar desconexo. Texto claro sobre escuro cansa em leitura longa.

## Recomendação

**Proposta A.** Combina com o objetivo (recrutador de QA entende a metáfora do relatório em 3 segundos), é mais legível, tem uma ideia própria em vez de só uma paleta, e o tema claro é mais leve de renderizar e de testar o contraste.

## Decisões de conteúdo para a Fase 3

**Frase de posicionamento** (sem métricas; escolher uma ou editar):

1. PT: "Engenheiro de QA. Testo API e interface, automatizo com Playwright e acho a falha antes do usuário." / ES: "Ingeniero de QA. Pruebo API e interfaz, automatizo con Playwright y encuentro el fallo antes que el usuario." / EN: "QA engineer. I test APIs and interfaces, automate with Playwright, and find the failure before the user does."
2. PT: "Quinze anos achando falha em instalações elétricas. Agora, em software." (15 anos: 2010–2024 = 14; confirmar o número antes de usar.)
3. PT: "QA com olhar de eletricista: diagnóstico primeiro, correção depois."

**Foto:** a foto atual parece gerada por IA (monitores ilegíveis, caneca "Developer"). Recomendo **não usar** no hero. Opções: (a) foto real sua, (b) sem rosto no hero e só o vídeo da suíte de testes, foto real mais abaixo em "Trajetória". Preciso da sua escolha.

**Vídeo do hero:** gravação de 8 s de uma suíte Playwright (terminal + relatório). Tem que ser gravada por você ou rodada por mim localmente nos seus repositórios; decidimos na Fase 4.
