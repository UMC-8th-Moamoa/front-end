import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  assetsInclude: ['**/*.svg'],
  server: {
    proxy: {
      '/api': {
        target: 'http://www.moamoas.com',
        changeOrigin: true,

        // ✅ 로그 출력 추가!
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[🔁 PROXY_REQ] ${req.method} ${req.url}`);
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`[✅ PROXY_RES] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
          });

          proxy.on('error', (err, req, res) => {
            console.error(`[❌ PROXY_ERROR] ${req.method} ${req.url} - ${err.message}`);
          });
        },
      },
    },
  },
});