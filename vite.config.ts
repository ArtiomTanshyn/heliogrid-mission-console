import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const projectRoot = decodeURIComponent(new URL('.', import.meta.url).pathname)
const sourcePath = decodeURIComponent(new URL('./src', import.meta.url).pathname)
const fromSource = (path: string) => `${sourcePath}/${path}`

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const appBasePath = loadEnv(mode, projectRoot, 'VITE_').VITE_BASE_PATH ?? '/'

  return {
    base: appBasePath,
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('node_modules/vue') ||
              id.includes('node_modules/vue-router') ||
              id.includes('node_modules/pinia')
            ) {
              return 'vue'
            }
            if (
              id.includes('node_modules/primevue') ||
              id.includes('node_modules/@primeuix') ||
              id.includes('node_modules/primeicons')
            ) {
              return 'primevue'
            }
            if (id.includes('node_modules/chart.js') || id.includes('node_modules/vue-chartjs')) {
              return 'charts'
            }
          },
        },
      },
    },
  }
})
