import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
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
=======
  plugins: [react(), svgr()],
  assetsInclude: ['**/*.svg'], 
  base: './',
});
>>>>>>> 8065684465d00bb329f5517eaf4c55441daa84ad
