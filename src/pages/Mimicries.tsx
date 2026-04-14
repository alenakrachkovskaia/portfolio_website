import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from '../components/NavArrows'
import { projectPages, projectCards } from '../data/projects-data'
import './Mimicries.css'

const base = import.meta.env.BASE_URL
const data = projectPages['mimicries']
const cardIdx = projectCards.findIndex(c => c.slug === 'mimicries')
const prevCard = cardIdx > 0 ? projectCards[cardIdx - 1] : null
const nextCard = cardIdx < projectCards.length - 1 ? projectCards[cardIdx + 1] : null

export default function Mimicries() {
  const [hero, ...rest] = data.images
  return (
    <div className="mimicries-page">

      <div className="mimicries-media">
        <img src={`${base}mimicries/${hero}`} alt="" />
      </div>

      <div className="mimicries-text">
        <div className="mimicries-text-tag tag">{data.pageTag}</div>
        <p className="mimicries-text-body text">{data.pageBody}</p>
        <div className="mimicries-text-secondary secondary-tag">{data.pageSecondaryTag}</div>
      </div>

      {rest.map(filename => (
        <div key={filename} className="mimicries-media">
          <img src={`${base}mimicries/${filename}`} alt="" />
        </div>
      ))}

      {data.credits && (
        <div className="mimicries-credits">
          <div className="mimicries-credits-text secondary-tag">{data.credits}</div>
        </div>
      )}

      <div className="mimicries-nav">
        {prevCard && <Link to={prevCard.route} className="mimicries-nav-prev h2">Previous Case<br /><ArrowLeft /></Link>}
        {nextCard && <Link to={nextCard.route} className="mimicries-nav-next h2">Next Case<br /><ArrowRight /></Link>}
      </div>

    </div>
  )
}
