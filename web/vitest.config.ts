import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'text-summary'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/cms/types.ts', 'src/lib/cms/client.ts', 'src/lib/cms/mockData.ts'],
    },
  },
})
