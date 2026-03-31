import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import './Projects.css'

interface ProjectData {
  id: number
  name: string
  year: string
  category: string
  imageWebp: string
  route: string
}

const indexLines = [
  '[1] — brand identity',
  '[2] — art direction',
  '[3] — Type Design',
  '[4] — editorial design',
  '[5] — packaging design',
  '[6] — production',
  '[7] — styling',
  '[8] — retouching',
]

const base = import.meta.env.BASE_URL

const projects: ProjectData[] = [
  { id: 1, name: 'Škola',     year: '[1] [2] [3] [4]', category: 'Culture & Education', imageWebp: `${base}projects/project-1.webp`, route: '/skola' },
  { id: 2, name: 'Ceylon Home',     year: '[1] [2] [5]', category: 'Home Fragrance',  imageWebp: `${base}projects/project-2.webp`, route: '/ceylon' },
  { id: 3, name: "Ust\u2019ar",    year: '[1] [2] [3]', category: 'Culture & Education',   imageWebp: `${base}projects/project-3.webp`, route: '/ustar' },
  { id: 4, name: 'Mimicries', year: '[2] [6] [7] [8]', category: 'Fashion Photoshoot',      imageWebp: `${base}projects/project-4.webp`, route: '/mimicries' },
  { id: 5, name: 'The Art of Printmaking',      year: '[4]', category: 'PhD Thesis Book',       imageWebp: `${base}projects/project-5.webp`, route: '/book' },
]

function Projects() {
  return (
    <div className="projects-container">
      <div className="projects-content">
        <div className="projects-grid">
          <div className="project-card project-card--index">
            <div className="project-card-index-text">
              {indexLines.map((line, i) => (
                <div key={i} className="tag">{line}</div>
              ))}
            </div>
          </div>
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-image">
                <Link to={project.route} className="project-image-link">
                  <LazyImage src={project.imageWebp} alt={project.name} />
                </Link>
              </div>
              <div className="project-card-info">
                <div className="project-card-header">
                  <Link to={project.route} className="project-name-link"><h2 className="h2">{project.name}</h2></Link>
                  <span className="tag">{project.year}</span>
                </div>
                <div className="project-card-sub tag">{project.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Projects
