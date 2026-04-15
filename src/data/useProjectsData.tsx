import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import bundledData from './projects-data.json'
import type { CardData, PageData } from './projects-data'

interface ProjectsData {
  indexLines: string[]
  projectCards: CardData[]
  projectPages: Record<string, PageData>
}

const initial = bundledData as unknown as ProjectsData

const ProjectsDataContext = createContext<ProjectsData>(initial)

const REPO = 'alenakrachkovskaia/portfolio_website'
const PROJECTS_FILE = 'src/data/projects-data.json'
const API = 'https://api.github.com'

function decodeBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ''))))
}

export function ProjectsDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProjectsData>(initial)

  useEffect(() => {
    if (!import.meta.env.DEV) return
    fetch(`${API}/repos/${REPO}/contents/${PROJECTS_FILE}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(r => r.json())
      .then(file => JSON.parse(decodeBase64(file.content)))
      .then(setData)
      .catch(() => {})
  }, [])

  return (
    <ProjectsDataContext.Provider value={data}>
      {children}
    </ProjectsDataContext.Provider>
  )
}

export function useProjectsData(): ProjectsData {
  return useContext(ProjectsDataContext)
}
