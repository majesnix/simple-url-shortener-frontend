import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';
import { macaronVitePlugin } from '@macaron-css/vite';

export default defineConfig({
  plugins: [
    macaronVitePlugin(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
  ssr: {
    noExternal: [/solid-js/, /@solidjs\//, /@solid-primitives\//, /solid-toast/, /@macaron-css\/solid/, /^msw/, /@mswjs\//],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
