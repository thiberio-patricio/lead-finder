import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [/^api\/.*/],
    },
  },
  optimizeDeps: {
    exclude: ['mongoose'],
  },
  server: {
    watch: {
      ignored: ['**/api/**'],
    },
  },
})
