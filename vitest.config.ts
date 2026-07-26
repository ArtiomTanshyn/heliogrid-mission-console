import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const sourcePath = decodeURIComponent(new URL('./src', import.meta.url).pathname)
const fromSource = (path: string) => `${sourcePath}/${path}`

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': sourcePath,
      '@api': fromSource('api'),
      '@app': fromSource('app'),
      '@entities': fromSource('entities'),
      '@features': fromSource('features'),
      '@mock': fromSource('mock'),
      '@shared': fromSource('shared'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.ts'],
  },
})
