/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'brand-background': '#E2DBBE',
        'brand-text': '#0C120C',
        'brand-accent': '#725752',
        'brand-primary': '#C69300',
        'brand-secondary': '#226F54',
      },
      fontFamily: {
        'sans': ['Outfit', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia', 'serif'], // Usando fontes padrão do sistema
        'outfit': ['Outfit', 'sans-serif'],
        'ortica': ['Ortica', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
