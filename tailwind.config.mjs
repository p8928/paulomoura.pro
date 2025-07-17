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
        'serif': ['Ortica', 'serif'],
        'outfit': ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
