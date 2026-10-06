# Resonate: frequências ambientes para foco, relaxamento e sono

O **Resonate** é uma SPA em Angular com Tailwind CSS, construída a partir do conceito de **Ressonância**, tirado de uma capa de álbum feita de linhas onduladas e paralelas.

> Escolhi esta capa porque ela fala de ressonância e frequências fluidas, e por isso meu site é um gerenciador de frequências para foco e relaxamento.

## Funcionalidades

- **Catálogo de frequências** com filtro por objetivo (Foco, Relaxamento, Sono) e busca por texto.
- **Sessão de escuta**: o usuário escolhe tocar as frequências em sequência ou ao mesmo tempo; duração e classificação acompanham o modo selecionado.
- **Página de detalhe** em `/detail/:id`, com dados técnicos, player e notas da comunidade.
- **Som gerado no navegador** com a Web Audio API: tons puros, batidas binaurais (use fones) e ruídos filtrados. Não há arquivos de áudio.
- **Presets**: formulário com validação para salvar combinações. Cada preset pode ser ativado ou pausado, e os totais mudam na hora.
- **Página 404** com o visual do projeto.

## Tecnologias

- Angular 19 (standalone components, signals, `input()`/`output()`, controle de fluxo `@if`/`@for`)
- Tailwind CSS 3 + CSS próprio (grão de filme, animação das ondas)
- TypeScript
- Node.js e Angular CLI no Linux (Pop!_OS)

## Como rodar

Requisitos: Node.js 20 ou superior e Angular CLI (`npm i -g @angular/cli`).

```bash
git clone https://github.com/ddanjos/resonate.git
cd resonate
npm install
npm start
```

Abra `http://localhost:4200`. Para gerar a versão de produção: `npm run build` (saída em `dist/resonate`).

## Estrutura

```
src/app/
├── core/
│   ├── models/frequency.model.ts      tipos e rótulos
│   └── services/
│       ├── frequency.service.ts       busca o catálogo (HttpClient)
│       ├── community.service.ts       notas da API pública JSONPlaceholder
│       ├── session.service.ts         sessão de escuta atual (signal)
│       ├── preset.service.ts          presets salvos (signals + computed)
│       └── audio-engine.service.ts    player global: prévias, sessões e presets (Web Audio API)
├── shared/components/
│   ├── navbar.component.ts            menu com destaque da rota atual
│   ├── wave-lines.component.ts        linhas onduladas (input: lines, amplitude, height)
│   ├── frequency-card.component.ts    input: freq | ações de sessão e rota de detalhe
│   ├── goal-filter.component.ts       input: options, active | output: changed
│   ├── stat-card.component.ts         input: label, value, hint
│   └── state-message.component.ts     carregando, erro e vazio | output: retry
└── pages/
    ├── home/        catálogo, filtros e sessão
    ├── detail/      /detail/:id
    ├── presets/     formulário e lista de presets
    └── not-found/   rota **
```

## Requisitos do trabalho e onde estão

| Requisito | Onde |
|---|---|
| 3+ rotas, menu com destaque | `app.routes.ts`, `navbar.component.ts` (`routerLinkActive`) |
| Rota com parâmetro | `detail/:id`, lida com `input()` via `withComponentInputBinding` |
| Rota `**` temática | `pages/not-found` |
| 2+ componentes com `input()` | `frequency-card`, `goal-filter`, `stat-card`, `state-message`, `wave-lines` |
| 1+ componente com `output()` | `frequency-card` (`toggle`), `goal-filter` (`changed`), `state-message` (`retry`) |
| `@if`, `@for` com `track` e `@empty` | `home.page.html`, `detail.page.html`, `presets.page.html` |
| Estado em signals | todos os serviços e páginas |
| 3+ `computed` com trabalho real | `home.page.ts` (`filtered`, `sessionItems`, `sessionMinutes`, `sessionLevel`), `preset.service.ts` (`count`, `activeCount`, `activeMinutes`), `presets.page.ts` (`pickedItems`, `pickedMinutes`), `wave-lines` (`paths`) |
| Serviço com `inject()` | `core/services/*` |
| `HttpClient`, carregando e erro | `frequency.service.ts` e `community.service.ts`; telas usam `state-message` |
| Formulário com validação | `presets.page.ts` (Reactive Forms; botão desabilitado enquanto inválido) |
| Tailwind + CSS próprio | `tailwind.config.js` com as cores da identidade; `styles.css` com o grão |
| Funciona no celular | layout em grid responsivo, menu que quebra linha |

### Sobre a API

Os dados das frequências ficam em `public/data/frequencies.json` e são buscados com `HttpClient`, porque não existe API pública de frequências terapêuticas. A API pública usada de verdade é o **JSONPlaceholder** (`/comments`), que alimenta as "Notas da comunidade" da página de detalhe. Esse arranjo deve ser combinado com o professor, como o enunciado pede quando a ideia não encaixa em uma API pronta.

## Documentos de planejamento e design

- [CONCEITO.md](./CONCEITO.md): capa, palavra-conceito e ligação funcional
- [docs/MOODBOARD.md](./docs/MOODBOARD.md): roteiro do moodboard (o painel final vai em `docs/moodboard.pdf`)
- [docs/IDENTIDADE-VISUAL.md](./docs/IDENTIDADE-VISUAL.md): paleta, tipografia, forma e frase de direção
