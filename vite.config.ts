import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: false })
  ],
  server: {
    proxy: {
      "/api/files": {
        target: "http://10.12.50.101:5001",
        changeOrigin: true,
        secure: false,
      },
      "/files": {
        target: "http://10.12.50.101:5001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/files/, '/api/files'), // Convert /files to /api/files
      },
      "/api": {
        target: "http://10.12.50.101:5005",
        changeOrigin: true,
        secure: false,
      }
    },
  },
})
