import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://10.8.100.39:5005",
        changeOrigin: true,
        secure: false,
   
      },
    },
  },
})
