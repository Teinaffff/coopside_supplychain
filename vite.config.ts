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
      "/api": {
        target: "http://10.8.100.39:5005",
        changeOrigin: true,
        secure: false,
      },
      "/files": {
        target: "http://10.8.100.39:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
