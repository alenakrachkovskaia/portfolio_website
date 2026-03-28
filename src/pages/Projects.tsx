import { Link } from 'react-router-dom'
import './Projects.css'

interface ProjectData {
  id: number
  name: string
  year: string
  category: string
  image: string
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
  '[9] — Lettering',
  '[10] — illustration',
]

const base = import.meta.env.BASE_URL

const projects: ProjectData[] = [
  { id: 1, name: ‘Škola’,     year: ‘[1] [2] [3] [4]’, category: ‘Culture & Education’, image: `${base}projects/project-1.jpg`, route: ‘/skola’ },
  { id: 2, name: ‘Ceylon Home’,     year: ‘[1] [2] [5]’, category: ‘Home Fragrance’,  image: `${base}projects/project-2.jpg`, route: ‘/ceylon’ },
  { id: 3, name: ‘Ust’ar’,    year: ‘[1] [2] [3]’, category: ‘Culture & Education’,   image: `${base}projects/project-3.jpg`, route: ‘/ustar’ },
  { id: 4, name: ‘Mimicries’, year: ‘[2] [6] [7] [8]’, category: ‘Fashion Photoshoot’,      image: `${base}projects/project-4.jpg`, route: ‘/mimicries’ },
  { id: 5, name: ‘The Art of Printmaking’,      year: ‘[4]’, category: ‘PhD Thesis Book’,       image: `${base}projects/project-5.jpg`, route: ‘/book’ },
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
                <img src={project.image} alt={project.name} />
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
