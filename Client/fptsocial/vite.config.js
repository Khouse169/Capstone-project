import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [
    react(),
  ],
  optimizeDeps: {
    include: [
      '@tailwindConfig',
    ]
  },
  resolve: {
    alias: [
      { find: '~', replacement: '/src' },
      {
        find: '@tailwindConfig', replacement: path.resolve(__dirname, 'tailwind.config.js'),
      }
    ]
  }
})