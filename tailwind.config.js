/**
 * Identidade visual do Resonate.
 * Cada cor tem um papel (ver docs/IDENTIDADE-VISUAL.md).
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        fundo: '#08161b', // fundo da página
        superficie: '#0f2229', // cartões e painéis
        borda: '#1d3a44', // linhas finas
        texto: '#e6f4f8', // texto principal
        suave: '#8fb0bb', // texto secundário
        destaque: '#4cb3ff', // tudo que é clicável
        onda: '#8de3ff', // apoio: linhas e brilhos
        profundo: '#2f6fd6', // apoio: gradientes
        erro: '#ff7a8a',
        sucesso: '#4fe3a8',
      },
      fontFamily: {
        titulo: ['Sora', 'system-ui', 'sans-serif'],
        texto: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        onda: '1.75rem', // curva marcante dos painéis
      },
      boxShadow: {
        brilho: '0 0 40px -12px rgba(76, 179, 255, 0.55)',
      },
    },
  },
  plugins: [],
};
