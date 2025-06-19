import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Explicitly define environment variables for production builds
    __VITE_GROQ_API_KEY__: JSON.stringify(process.env.VITE_GROQ_API_KEY || ''),
  },
  envPrefix: 'VITE_',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})