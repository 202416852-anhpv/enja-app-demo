import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      pwaAssets: {
        preset: 'minimal-2023',
        image: 'public/favicon.svg',
        overrideManifestIcons: true,
      },
      manifest: {
        name: 'EnJa App',
        short_name: 'EnJa',
        description: 'Ứng dụng hỗ trợ học tiếng Anh và tiếng Nhật',
        lang: 'vi',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#faf9f5',
        background_color: '#faf9f5',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
