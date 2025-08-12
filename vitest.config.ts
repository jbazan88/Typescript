import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    include: [
      '**/use-cases/**/*.test.ts', 
    ],
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['**/node_modules/**']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './domain/src')
    }
  }
})