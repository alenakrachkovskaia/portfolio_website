import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]

function gitPullPlugin() {
  return {
    name: 'git-pull',
    configureServer(server: any) {
      server.middlewares.use('/api/git-pull', (req: any, res: any) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        try {
          const output = execSync('git pull', { cwd: process.cwd() }).toString()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true, output }))
        } catch (e: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: e.message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), gitPullPlugin()],
  base: process.env.NODE_ENV === 'production'
    ? (repo === 'portfolio_website' ? '/' : (repo ? `/${repo}/` : '/'))
    : '/',
})
