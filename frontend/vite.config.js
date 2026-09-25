import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('three')) return 'three-core';
          if (id.includes('recharts') || id.includes('d3')) return 'charting';
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('react')) return 'react-vendor';

          return 'vendor';
        }
      }
    }
  }
})
