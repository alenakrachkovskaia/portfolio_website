import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Main from './pages/Main'
import Projects from './pages/Projects'
import Skola from './pages/Skola'
import Ceylon from './pages/Ceylon'
import Ustar from './pages/Ustar'
import Mimicries from './pages/Mimicries'
import Book from './pages/Book'
import Info from './pages/Info'
import Gallery from './pages/Gallery'
import Admin from './pages/Admin'
import GenericProjectPage from './pages/GenericProjectPage'
import { projectCards } from './data/projects-data'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/info" element={<Info />} />
        <Route path="/skola" element={<Skola />} />
        <Route path="/ustar" element={<Ustar />} />
        <Route path="/ceylon" element={<Ceylon />} />
        <Route path="/mimicries" element={<Mimicries />} />
        <Route path="/book" element={<Book />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/projects/:slug" element={<GenericProjectPage />} />
        {projectCards
          .filter(c => !['skola', 'ceylon', 'ustar', 'mimicries', 'book'].includes(c.slug))
          .map(c => <Route key={c.slug} path={c.route} element={<GenericProjectPage />} />)
        }
        <Route path="*" element={<Main />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
