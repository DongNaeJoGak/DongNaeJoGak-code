import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({ exportAsDefault: false }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://dongnaejogak.kro.kr', // 👉 여기를 실제 백엔드 주소로 바꿔줘야 해
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
