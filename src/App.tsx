import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main from './pages/Main'
import Projects from './pages/Projects'
import Placeholder from './pages/Placeholder'
import Skola from './pages/Skola'
import Ceylon from './pages/Ceylon'
import Ustar from './pages/Ustar'
import Mimicries from './pages/Mimicries'
import Book from './pages/Book'
import Info from './pages/Info'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/gallery" element={<Placeholder title="GALLERY" />} />
        <Route path="/info" element={<Info />} />
        <Route path="/skola" element={<Skola />} />
        <Route path="/ustar" element={<Ustar />} />
        <Route path="/ceylon" element={<Ceylon />} />
        <Route path="/mimicries" element={<Mimicries />} />
        <Route path="/book" element={<Book />} />
        <Route path="*" element={<Main />} />
      </Routes>
    </Router>
  )
}

export default App
