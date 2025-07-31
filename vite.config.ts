import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NOTE: Before deploying to GitHub Pages, set base to '/<repo-name>/'
// Example: base: '/gatango-puzzle/'
export default defineConfig({
  plugins: [react()],
  base: './'
})
