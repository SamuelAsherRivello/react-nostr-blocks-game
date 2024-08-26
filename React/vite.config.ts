import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import cleanPlugin from 'vite-plugin-clean';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets',
          dest: 'src/',
        },
      ],
    }),
    cleanPlugin({
      targetFiles: ['dist/assets'],
    }) as any, // This is not working to delete the EXTRA /dist/assets/
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the limit as needed
  },
  base: './',
  server: {
    port: 3000,
  },
});
