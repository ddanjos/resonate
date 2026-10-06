# Identidade visual: Resonate

## Nome

**Resonate** vem da palavra-conceito (ressonância), não do nome do álbum.

## Frase de direção

> Tudo vibra devagar: fundo escuro e granulado, linhas finas e fluidas, e um único brilho azul por tela.

Quando houver dúvida de design, a regra é: menos elementos, mais espaço, e só uma coisa brilhando.

## Paleta

| Papel | Nome no Tailwind | Código | Contraste sobre o fundo |
|---|---|---|---|
| Fundo | `fundo` | `#08161b` | n/a |
| Superfície (cartões) | `superficie` | `#0f2229` | n/a |
| Texto | `texto` | `#e6f4f8` | 16,4:1 |
| Texto secundário | `suave` | `#8fb0bb` | 8,0:1 |
| Destaque (tudo que é clicável) | `destaque` | `#4cb3ff` | 8,1:1 |
| Apoio: linhas e brilhos | `onda` | `#8de3ff` | 12,8:1 |
| Apoio: gradientes | `profundo` | `#2f6fd6` | uso decorativo |
| Erro | `erro` | `#ff7a8a` | 7,4:1 |
| Sucesso | `sucesso` | `#4fe3a8` | 11,3:1 |
| Borda | `borda` | `#1d3a44` | decorativa |

Cinco cores com função (fundo, texto, destaque e duas de apoio), mais erro e sucesso. O texto do botão (`fundo` sobre `destaque`) tem contraste de 8,1:1. Todos os valores foram calculados pela fórmula de luminância da WCAG; o mínimo para texto normal é 4,5:1.

**De onde vêm:** o azul luminoso e o azul-água da capa viraram `destaque` e `onda`; o verde-petróleo escuro do fundo virou `fundo`.

## Tipografia

- **Títulos:** Sora, pesos 500 e 600. Geométrica e arredondada, combina com as curvas das ondas.
- **Texto:** Inter, pesos 400 e 500. Neutra e legível em tamanho pequeno.

| Uso | Tamanho |
|---|---|
| Título principal (h1) | 36 px no celular, 48 px no desktop |
| Subtítulo (h2) | 20 px |
| Texto | 16 px |
| Apoio e rótulos | 14 px e 12 px |

Fontes carregadas pelo Google Fonts em `src/index.html`.

## Forma

- Painéis grandes com cantos bem arredondados (`rounded-onda`, 28 px), lembrando a curva da capa.
- Botões e filtros em formato de pílula.
- Bordas finas de 1 px em `borda`; sem sombras cinzas.
- A única sombra é um brilho azul (`shadow-brilho`), usado só no item selecionado.
- Grão de filme sobre a página inteira (7% de opacidade) e linhas onduladas animadas como textura.

## Duas telas principais

Referência de composição para o catálogo e a tela de detalhe:

```
Catálogo                          Detalhe
+---------------------------+     +---------------------------+
| Resonate     Catálogo Presets   | Voltar ao catálogo         |
|---------------------------|     | +-----------------------+ |
| [ondas ~~~~~~~~~~~~~~~~ ] |     | | ondas + título        | |
| Escolha a frequência...   |     | +-----------------------+ |
|                           |     | [Tom] [Pulso] [Min] [Tipo]|
| [3 números de resumo]     |     | ( Ouvir agora ) volume --o|
| (Foco)(Relax)(Sono) busca |     | pontos fortes             |
| [card] [card] [card]      |     | notas da comunidade       |
+---------------------------+     +---------------------------+
```
