import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main from './pages/Main'
import Placeholder from './pages/Placeholder'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<Placeholder title="PROJECTS" />} />
        <Route path="/gallery" element={<Placeholder title="GALLERY" />} />
        <Route path="/info" element={<Placeholder title="INFO" />} />
        <Route path="/skola" element={<Placeholder title="SKOLA" />} />
        <Route path="/ustar" element={<Placeholder title="USTAR" />} />
        <Route path="/ceylon" element={<Placeholder title="CEYLON" />} />
        <Route path="/mimicries" element={<Placeholder title="MIMICRIES" />} />
        <Route path="/book" element={<Placeholder title="BOOK" />} />
        <Route path="*" element={<Main />} />
      </Routes>
    </Router>
  )
}

export default App
