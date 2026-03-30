import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const basePath = process.env.VITE_BASE_PATH

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production'
    ? (basePath || (repoName ? `/${repoName}/` : '/'))
    : '/',
})
