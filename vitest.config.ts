import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: [],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    // Mock CSS imports, images, etc.
    css: false,
    // Short timeout — render tests should be instant
    testTimeout: 5000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
