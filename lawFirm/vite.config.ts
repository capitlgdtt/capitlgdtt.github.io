import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      // Убираем React Compiler
      jsxRuntime: 'automatic',
    }),
  ],
  build: {
    target: 'es2020',
    sourcemap: false,
  }
})