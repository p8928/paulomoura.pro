import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://paulomoura.com',
  integrations: [mdx()],
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