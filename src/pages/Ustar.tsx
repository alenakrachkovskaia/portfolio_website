import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import { ArrowLeft, ArrowRight } from '../components/NavArrows'
import { projectPages, projectCards } from '../data/projects-data'
import './Ustar.css'

const base = import.meta.env.BASE_URL
const data = projectPages['ustar']
const cardIdx = projectCards.findIndex(c => c.slug === 'ustar')
const prevCard = cardIdx > 0 ? projectCards[cardIdx - 1] : null
const nextCard = cardIdx < projectCards.length - 1 ? projectCards[cardIdx + 1] : null

const albImages = Array.from({ length: 42 }, (_, i) =>
  `alb-${String(i + 1).padStart(2, '0')}`
)

const cyrImages = Array.from({ length: 42 }, (_, i) =>
  `cyr-${String(i + 43).padStart(2, '0')}`
)

export default function Ustar() {
  // images[0] = hero, images[1] = shown before grid, images.slice(2) = after grid
  const [hero, second, ...afterGrid] = data.images
  return (
    <div className="ustar-page">

      <div className="ustar-media">
        <LazyImage src={`${base}ustar/${hero}`} alt="" />
      </div>

      <div className="ustar-text">
        <div className="ustar-text-tag tag">{data.pageTag}</div>
        <p className="ustar-text-body text">
          {data.pageBody.split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </p>
        <div className="ustar-text-secondary secondary-tag">{data.pageSecondaryTag}</div>
      </div>

      {second && (
        <div className="ustar-media">
          <LazyImage src={`${base}ustar/${second}`} alt="" />
        </div>
      )}

      <div className="ustar-grid-wrapper">
        <div className="ustar-alb-grid">
          {albImages.map(name => (
            <LazyImage key={name} src={`${base}ustar/alb/${name}.webp`} alt="" />
          ))}
        </div>
        <div className="ustar-cyr-grid">
          {cyrImages.map(name => (
            <LazyImage key={name} src={`${base}ustar/cyr/${name}.webp`} alt="" />
          ))}
        </div>
      </div>

      {afterGrid.map(filename => (
        <div key={filename} className="ustar-media">
          <LazyImage src={`${base}ustar/${filename}`} alt="" />
        </div>
      ))}

      <div className="ustar-nav">
        {prevCard && <Link to={prevCard.route} className="ustar-nav-prev h2">Previous Case<br /><ArrowLeft /></Link>}
        {nextCard && <Link to={nextCard.route} className="ustar-nav-next h2">Next Case<br /><ArrowRight /></Link>}
      </div>

    </div>
  )
}
