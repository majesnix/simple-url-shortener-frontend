import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { macaronVitePlugin } from '@macaron-css/vite';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    macaronVitePlugin(),
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
