import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import { ArrowLeft, ArrowRight } from '../components/NavArrows'
import { projectPages, projectCards } from '../data/projects-data'
import './Ceylon.css'

const base = import.meta.env.BASE_URL
const data = projectPages['ceylon']
const cardIdx = projectCards.findIndex(c => c.slug === 'ceylon')
const prevCard = cardIdx > 0 ? projectCards[cardIdx - 1] : null
const nextCard = cardIdx < projectCards.length - 1 ? projectCards[cardIdx + 1] : null

export default function Ceylon() {
  const [hero, ...rest] = data.images
  return (
    <div className="ceylon-page">

      <div className="ceylon-media">
        <LazyImage src={`${base}ceylon/${hero}`} alt="" />
      </div>

      <div className="ceylon-text">
        <div className="ceylon-text-tag tag">{data.pageTag}</div>
        <p className="ceylon-text-body text">{data.pageBody}</p>
        <div className="ceylon-text-secondary secondary-tag">{data.pageSecondaryTag}</div>
      </div>

      {rest.map(filename => (
        <div key={filename} className="ceylon-media">
          <LazyImage src={`${base}ceylon/${filename}`} alt="" />
        </div>
      ))}

      <div className="ceylon-nav">
        {prevCard && <Link to={prevCard.route} className="ceylon-nav-prev h2">Previous Case<br /><ArrowLeft /></Link>}
        {nextCard && <Link to={nextCard.route} className="ceylon-nav-next h2">Next Case<br /><ArrowRight /></Link>}
      </div>

    </div>
  )
}
