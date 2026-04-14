import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import { ArrowLeft, ArrowRight } from '../components/NavArrows'
import { projectPages, projectCards } from '../data/projects-data'
import './Book.css'

const base = import.meta.env.BASE_URL
const data = projectPages['book']
const overlays = new Set(data.overlayImages ?? [])
const cardIdx = projectCards.findIndex(c => c.slug === 'book')
const prevCard = cardIdx > 0 ? projectCards[cardIdx - 1] : null
const nextCard = cardIdx < projectCards.length - 1 ? projectCards[cardIdx + 1] : null

export default function Book() {
  const wrapperRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [opacities, setOpacities] = useState<Record<string, number>>(
    () => Object.fromEntries((data.overlayImages ?? []).map(name => [name, 0]))
  )

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight
      const next: Record<string, number> = {}
      for (const name of overlays) {
        const el = wrapperRefs.current[name]
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const progress = (vh - rect.top) / vh
        const start = window.innerWidth >= 992 ? 0.85 : 0.7
        next[name] = Math.min(1, Math.max(0, (progress - start) / 0.3))
      }
      setOpacities(prev => ({ ...prev, ...next }))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [hero, ...rest] = data.images
  return (
    <div className="book-page">

      <div className="book-media">
        <LazyImage src={`${base}book/${hero}`} alt="" />
      </div>

      <div className="book-text">
        <div className="book-text-tag tag">{data.pageTag}</div>
        <p className="book-text-body text">{data.pageBody}</p>
        <div className="book-text-secondary secondary-tag">{data.pageSecondaryTag}</div>
      </div>

      {rest.map(filename => {
        const nameBase = filename.replace(/\.[^.]+$/, '')
        return (
          <div key={filename} className="book-media">
            {overlays.has(nameBase) ? (
              <div
                ref={el => { wrapperRefs.current[nameBase] = el }}
                className="book-media-overlay-wrapper"
              >
                <LazyImage src={`${base}book/${filename}`} alt="" />
                <img
                  src={`${base}book/${nameBase}-overlay.webp`}
                  alt=""
                  loading="lazy"
                  className="book-media-overlay"
                  style={{ opacity: opacities[nameBase] ?? 0 }}
                />
              </div>
            ) : (
              <LazyImage src={`${base}book/${filename}`} alt="" />
            )}
          </div>
        )
      })}

      <div className="book-nav">
        {prevCard && <Link to={prevCard.route} className="book-nav-prev h2">Previous Case<br /><ArrowLeft /></Link>}
        {nextCard && <Link to={nextCard.route} className="book-nav-next h2">Next Case<br /><ArrowRight /></Link>}
      </div>

    </div>
  )
}
