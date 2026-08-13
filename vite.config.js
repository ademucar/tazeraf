import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Varsayılan hedef (baseline-widely-available ≈ Safari 16 / Chrome 107) eski
    // telefonlarda beyaz ekrana yol açıyordu. Marketlerde eski cihazlar yaygın.
    // Not: safari15 alt sınır — @supabase/supabase-js private class metodu
    // (#getSession) kullanıyor ve derleyici bunu daha aşağıya indiremiyor.
    target: ['es2020', 'chrome87', 'edge88', 'firefox90', 'safari15'],
  },
  css: {
    // CSS de aynı tarayıcılara göre öneklensin (backdrop-filter, gap vb.)
    transformer: 'lightningcss',
    lightningcss: {
      targets: { chrome: 87 << 16, edge: 88 << 16, firefox: 78 << 16, safari: (14 << 16) | (1 << 8) },
    },
  },
})
