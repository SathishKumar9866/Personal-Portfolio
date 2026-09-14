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
          // three MUST stay out of `vendor`. `vendor` is in the entry graph, so
          // naming three there pulls 193kB gzipped into the first paint for
          // every reader — including the phones and reduced-motion readers the
          // dynamic import in NeuralField exists to spare. Left unnamed, it
          // stays in the chunk Rollup creates for that import() and is fetched
          // only when the 3D field is actually going to run. Measured: naming
          // it here made vendor 193.49kB gzipped; not naming it leaves vendor
          // at 1.78kB and puts three in a lazy 138kB chunk.
          if (/[\\/]three[\\/]/.test(id)) return undefined
          if (id.includes('react')) return 'react'
          return 'vendor'
        },
      },
    },
  },
})
