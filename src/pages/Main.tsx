import { useState, useEffect } from 'react'

// Using public folder paths, which are static
const letterImages = [
  '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png',
  '9.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png', '16.png'
].map(name => `${import.meta.env.BASE_URL}letters/${name}`)

// Swap image every 7% of viewport width of mouse travel
const MOUSE_THRESHOLD_VW = 0.07

export default function Main() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const [totalDistance, setTotalDistance] = useState(0)

  useEffect(() => {
    let lastTouchPos = { x: 0, y: 0 }
    let touchDistance = 0

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      lastTouchPos = { x: touch.clientX, y: touch.clientY }
      touchDistance = 0
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const dx = touch.clientX - lastTouchPos.x
      const dy = touch.clientY - lastTouchPos.y
      touchDistance += Math.sqrt(dx * dx + dy * dy)

      if (touchDistance >= window.innerWidth * MOUSE_THRESHOLD_VW) {
        setCurrentImageIndex(Math.floor(Math.random() * letterImages.length))
        touchDistance = 0
      }

      lastTouchPos = { x: touch.clientX, y: touch.clientY }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.x
      const dy = e.clientY - lastPos.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      const newTotalDistance = totalDistance + distance

      if (newTotalDistance >= window.innerWidth * MOUSE_THRESHOLD_VW) {
        const randomIndex = Math.floor(Math.random() * letterImages.length)
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
      <div className="main-content">
        <img
          src={letterImages[currentImageIndex]}
          alt="Animated Design"
          className="main-image"
        />
        <p className="main-text">
          lena Krachkovskaia is a multidisciplinary designer with a wide range of skills: from typography and branding to media production. Her favorite things in design process are drawing letters and calculating grids.
        </p>
      </div>
    </div>
  )
}
