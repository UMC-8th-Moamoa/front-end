import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  assetsInclude: ['**/*.svg'],
  server: {
    proxy: {
      '/api': {

        target: 'https://www.moamoas.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

