# Resonate

[![Resonate](docs/sondae_album.png)](https://github.com/ddanjos/resonate/tree/main)

O Resonate é uma aplicação web em Angular para explorar frequências sonoras com foco em bem-estar, concentração, relaxamento e sono. A experiência combina catálogo de sons, reprodução em navegador, sessões personalizadas e presets salvos no próprio navegador.

## Visão geral

A aplicação foi pensada como uma SPA para ajudar o usuário a:

- descobrir frequências por objetivo e contexto;
- montar uma sessão com múltiplas frequências;
- ouvir sons gerados localmente com a Web Audio API;
- salvar combinações favoritas em presets;
- acompanhar o progresso da reprodução com indicadores visuais.

## Funcionalidades principais

- Catálogo de frequências com filtros por objetivo
- Busca por texto no catálogo
- Página de detalhe para cada frequência
- Reprodução de áudio no navegador, sem arquivos externos
- Modo de reprodução sequencial e simultâneo
- Sessão de escuta com duração e progresso
- Presets salvos localmente com armazenamento em `localStorage`
- Layout responsivo para desktop e mobile
- Roteamento com páginas de home, detalhe, presets e 404

## Stack tecnológica

- Angular 19
- TypeScript
- Tailwind CSS
- Signals e computed values do Angular
- RxJS
- Web Audio API

## Como executar

### Requisitos

- Node.js 20+
- npm

### Instalação

```bash
cd resonate
npm install
```

### Desenvolvimento

```bash
npm start
```

A aplicação estará disponível em:

```text
http://localhost:4200
```

### Build de produção

```bash
npm run build
```

A saída será gerada na pasta `dist/resonate`.

## Estrutura do projeto

```text
resonate/
├── public/
│   └── data/
│       └── frequencies.json
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── audio/
│   │   │   │   └── audio-engine.service.ts
│   │   │   ├── models/
│   │   │   │   └── frequency.model.ts
│   │   │   └── services/
│   │   │       ├── frequency.service.ts
│   │   │       ├── preset.service.ts
│   │   │       └── session.service.ts
│   │   ├── pages/
│   │   │   ├── detail/
│   │   │   ├── home/
│   │   │   ├── not-found/
│   │   │   └── presets/
│   │   ├── shared/
│   │   │   └── components/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── README.md
├── CONCEITO.md
├── docs/
│   ├── IDENTIDADE-VISUAL.md
│   └── MOODBOARD.md
└── apresentacao.html
```

## Fluxo de uso

1. O usuário acessa a home e navega pelo catálogo.
2. Filtra frequências por objetivo ou pesquisa por termos.
3. Adiciona frequências à sessão atual.
4. Escolhe o modo de reprodução: sequencial ou simultâneo.
5. Inicia a reprodução e acompanha o tempo restante e progresso.
6. Salva combinações como preset para reutilização posterior.

## Dados e integrações

- O catálogo principal de frequências está em `public/data/frequencies.json`.
- As notas da comunidade na página de detalhe podem ser alimentadas via API pública, como JSONPlaceholder.
- Os presets são persistidos no navegador usando `localStorage`, permitindo que a experiência continue mesmo após recarregar a página.

## Observações de uso

- Para melhor experiência, sons binaurais são mais perceptíveis com headphones.
- A geração de áudio ocorre totalmente no navegador, sem depender de arquivos de áudio estáticos.
- A lógica principal de áudio está centralizada no serviço `AudioEngine` e é reutilizada pela sessão e pelos presets.

## Documentação complementar

- [CONCEITO.md](./CONCEITO.md)
- [docs/IDENTIDADE-VISUAL.md](./docs/IDENTIDADE-VISUAL.md)
- [docs/MOODBOARD.md](./docs/MOODBOARD.md)

## Status do projeto

Este README foi atualizado para refletir a versão atual da aplicação e seus recursos em funcionamento, substituindo a documentação inicial mais antiga do projeto.
