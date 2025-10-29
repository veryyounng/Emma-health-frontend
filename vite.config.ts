import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://core.lucycare.co.kr',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
