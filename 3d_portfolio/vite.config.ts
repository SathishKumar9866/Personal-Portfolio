import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // split rarely-changing vendor code into cacheable chunks
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react')) return 'react'
          if (id.includes('@emailjs')) return 'emailjs'
          return 'vendor'
        },
      },
    },
  },
})
