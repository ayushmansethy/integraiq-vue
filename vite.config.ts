import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// For GitHub Pages, CI sets this to '/' or '/<repository>/'.
// Local development always defaults to '/'.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [vue()],
  server: { port: 5173 },
  test: { include: ['src/**/*.test.ts'] },
})
