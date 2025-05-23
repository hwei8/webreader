import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Change this from '/webreader/' to './'
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})