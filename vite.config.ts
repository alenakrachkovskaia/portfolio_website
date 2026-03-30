import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

const hasCNAME = fs.existsSync('./public/CNAME')
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production'
    ? (hasCNAME ? '/' : (repoName ? `/${repoName}/` : '/'))
    : '/',
})
