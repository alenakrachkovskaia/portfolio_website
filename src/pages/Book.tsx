import { useEffect, useState } from 'react'
import './Book.css'

const base = import.meta.env.BASE_URL

const images = [
  'book-00', 'book-01', 'book-02', 'book-03', 'book-04', 'book-05',
  'book-06', 'book-07', 'book-08', 'book-09', 'book-10', 'book-11',
]

const overlays = new Set(['book-02', 'book-06', 'book-08'])

export default function Book() {
  const [overlayOpacity, setOverlayOpacity] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      const opacity = Math.min(1, Math.max(0, (scrolled - 0.3) / 0.3))
      setOverlayOpacity(opacity)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="book-page">

      <div className="book-media">
        <img src={`${base}book/book-00.webp`} alt="" />
      </div>

      <div className="book-text">
        <div className="book-text-tag tag">PhD Thesis Book</div>
        <p className="book-text-body text">The Art of Printmaking (Alexey Veselovsky's PhD thesis) traces the history of printmaking through five key techniques, weaving together artworks, illustrations, and personal accounts from figures who shaped the craft. The accompanying publication was designed as a printed book of five chapters, one per technique. The design draws directly from the subject: layouts echo the structure of engraving plates with wide margins, and the color palette is built around copper and ink tones.</p>
        <div className="book-text-secondary secondary-tag">[Editorial Design]</div>
      </div>

      {images.slice(1).map(name => (
        <div key={name} className="book-media">
          {overlays.has(name) ? (
            <div className="book-media-overlay-wrapper">
              <img src={`${base}book/${name}.webp`} alt="" />
              <img
                src={`${base}book/${name}-overlay.webp`}
                alt=""
                className="book-media-overlay"
                style={{ opacity: overlayOpacity }}
              />
            </div>
          ) : (
            <img src={`${base}book/${name}.webp`} alt="" />
          )}
        </div>
      ))}

      <div className="book-nav">
        <div className="book-nav-prev h2">Previous Case<br />🡰</div>
        <div className="book-nav-next h2">Next Case<br />🡲</div>
      </div>

    </div>
  )
}
