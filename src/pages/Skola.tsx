import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import { ArrowLeft, ArrowRight } from '../components/NavArrows'
import { projectPages, projectCards } from '../data/projects-data'
import './Skola.css'

const base = import.meta.env.BASE_URL
const data = projectPages['skola']
const cardIdx = projectCards.findIndex(c => c.slug === 'skola')
const prevCard = cardIdx > 0 ? projectCards[cardIdx - 1] : null
const nextCard = cardIdx < projectCards.length - 1 ? projectCards[cardIdx + 1] : null

export default function Skola() {
  const [hero, ...rest] = data.images
  return (
    <div className="skola-page">

      <div className="skola-media">
        <LazyImage src={`${base}skola/${hero}`} alt="" />
      </div>

      <div className="skola-text">
        <div className="skola-text-tag tag">{data.pageTag}</div>
        <p className="skola-text-body text">{data.pageBody}</p>
        <div className="skola-text-secondary secondary-tag">{data.pageSecondaryTag}</div>
      </div>

      {rest.map(filename => {
        const nameBase = filename.replace(/\.[^.]+$/, '')
        const videoUrl = data.videos?.[nameBase]
        return (
          <div key={filename} className="skola-media">
            {videoUrl ? (
              <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                <iframe
                  src={videoUrl}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
                  frameBorder="0"
                  allowFullScreen
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
                />
              </div>
            ) : (
              <LazyImage src={`${base}skola/${filename}`} alt="" />
            )}
          </div>
        )
      })}

      <div className="skola-nav">
        {prevCard && <Link to={prevCard.route} className="skola-nav-prev h2">Previous Case<br /><ArrowLeft /></Link>}
        {nextCard && <Link to={nextCard.route} className="skola-nav-next h2">Next Case<br /><ArrowRight /></Link>}
      </div>

    </div>
  )
}
