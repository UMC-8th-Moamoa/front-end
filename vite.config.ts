import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  assetsInclude: ['**/*.svg'],
  server: {
    proxy: {
      '/api': {
        target: 'http://54.180.138.131:3000', // 백엔드 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});

