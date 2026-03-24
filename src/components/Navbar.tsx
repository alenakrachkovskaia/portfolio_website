import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/SELFBRANDING_Logo.svg'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const currentPath = location.pathname

  const isMain = currentPath === '/'
  const isProjects = currentPath === '/projects'
  const isGallery = currentPath === '/gallery'
  const isInfo = currentPath === '/info'

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* LOGO */}
        <div className="nav-item-container">
          <Link to="/" className="nav-logo-link">
            <img src={logo} alt="Logo" className="nav-logo" />
          </Link>
          {isMain && <div className="nav-dot" />}
        </div>

        {/* SELECTED PROJECTS */}
        <div className="nav-item-container">
          <Link to="/projects" className={`nav-text-link ${isProjects ? 'active' : ''}`}>
            SELECTED PROJECTS
          </Link>
          {isProjects && <div className="nav-dot" />}
        </div>

        {/* GALLERY */}
        <div className="nav-item-container">
          <Link to="/gallery" className={`nav-text-link ${isGallery ? 'active' : ''}`}>
            GALLERY
          </Link>
          {isGallery && <div className="nav-dot" />}
        </div>

        {/* INFO */}
        <div className="nav-item-container">
          <Link to="/info" className={`nav-text-link ${isInfo ? 'active' : ''}`}>
            INFO
          </Link>
          {isInfo && <div className="nav-dot" />}
        </div>
      </div>
    </nav>
  )
}
