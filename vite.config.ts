import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { hocuspocus } from './src/server/plugins/hocuspocus_dev'

export default defineConfig({
  plugins: [sveltekit(), hocuspocus],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
