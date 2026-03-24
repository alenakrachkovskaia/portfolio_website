import { useState, useEffect } from 'react'

// Importing all images in the folder
const images = Object.values(import.meta.glob('../assets/letters/*.png', { eager: true, as: 'url' }))

export default function Main() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const [totalDistance, setTotalDistance] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.x
      const dy = e.clientY - lastPos.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      const newTotalDistance = totalDistance + distance
      
      if (newTotalDistance >= 100) {
        // Swap to random image
        const randomIndex = Math.floor(Math.random() * images.length)
        setCurrentImageIndex(randomIndex)
        setTotalDistance(0)
      } else {
        setTotalDistance(newTotalDistance)
      }
      
      setLastPos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [lastPos, totalDistance])

  return (
    <div className="main-container">
      <img 
        src={images[currentImageIndex] as string} 
        alt="Animated Design" 
        className="main-image" 
      />
      <p className="main-text">
        lena Krachkovskaia is a multidisciplinary designer with a wide range of skills: from typography and branding to media production. Her favorite things in design process are drawing letters and calculating grids.
      </p>
    </div>
  )
}
