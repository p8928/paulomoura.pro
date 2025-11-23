import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static', // For static site generation
  site: 'https://paulomoura.pro',
  integrations: [mdx(), sitemap()],
  vite: {
    resolve: {
      alias: {
        '$': new URL('./src', import.meta.url).pathname,
      }
    },
    optimizeDeps: {
      include: ['three'],
      exclude: ['@react-three/fiber']
    },
    ssr: {
      noExternal: ['three']
    }
  }
});
