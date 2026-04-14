import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import { indexLines, projectCards } from '../data/projects-data'
import './Projects.css'

const base = import.meta.env.BASE_URL

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
          {projectCards.map((project) => (
            <div key={project.slug} className="project-card">
              <div className="project-card-image">
                <Link to={project.route} className="project-image-link">
                  <LazyImage src={`${base}${project.cardImage}`} alt={project.name} />
                </Link>
              </div>
              <div className="project-card-info">
                <div className="project-card-header">
                  <Link to={project.route} className="project-name-link"><h2 className="h2">{project.name}</h2></Link>
                  <span className="tag">{project.services}</span>
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
