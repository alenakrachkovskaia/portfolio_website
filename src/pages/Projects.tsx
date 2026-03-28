import './Projects.css'

interface ProjectData {
  id: number
  name: string
  year: string
  category: string
  image: string
}

const projects: ProjectData[] = [
  { id: 1, name: 'SKOLA',     year: '2024', category: 'Brand Identity', image: '/projects/project-1.jpg' },
  { id: 2, name: 'USTAR',     year: '2023', category: 'Visual Design',  image: '/projects/project-2.jpg' },
  { id: 3, name: 'CEYLON',    year: '2023', category: 'Art Direction',   image: '/projects/project-3.jpg' },
  { id: 4, name: 'MIMICRIES', year: '2022', category: 'Typography',      image: '/projects/project-4.jpg' },
  { id: 5, name: 'BOOK',      year: '2022', category: 'Editorial',       image: '/projects/project-5.jpg' },
]

function Projects() {
  return (
    <div className="projects-container">
      <div className="projects-content">
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-image">
                <img src={project.image} alt={project.name} />
              </div>
              <div className="project-card-info">
                <div className="project-card-header">
                  <h2 className="h2">{project.name}</h2>
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
