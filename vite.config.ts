// vite.config.ts
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

        // ✅ 프록시 로그 추가
        configure: (proxy) => {
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log(`[🔁 PROXY_REQ] ${req.method} ${req.url}`);
          });

          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`[✅ PROXY_RES] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
          });

          proxy.on('error', (err, req) => {
            console.error(`[❌ PROXY_ERROR] ${req.method} ${req.url} - ${err.message}`);
          });
        },
      },
    },
  },
});
