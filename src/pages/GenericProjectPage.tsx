import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import { ArrowLeft, ArrowRight } from '../components/NavArrows'
import { projectPages, projectCards } from '../data/projects-data'
import './GenericProjectPage.css'

const base = import.meta.env.BASE_URL

export default function GenericProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = slug ? projectPages[slug] : undefined

  if (!data) {
    return <div style={{ padding: 64, textAlign: 'center' }}>Project not found.</div>
  }

  const cardIdx = projectCards.findIndex(c => c.slug === slug)
  const prevCard = cardIdx > 0 ? projectCards[cardIdx - 1] : null
  const nextCard = cardIdx < projectCards.length - 1 ? projectCards[cardIdx + 1] : null

  const [hero, ...rest] = data.images

  return (
    <div className="gpp-page">

      {hero && (
        <div className="gpp-media">
          <LazyImage src={`${base}${slug}/${hero}`} alt="" />
        </div>
      )}

      <div className="gpp-text">
        <div className="gpp-text-tag tag">{data.pageTag}</div>
        <p className="gpp-text-body text">
          {data.pageBody.split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </p>
        <div className="gpp-text-secondary secondary-tag">{data.pageSecondaryTag}</div>
      </div>

      {rest.map(filename => (
        <div key={filename} className="gpp-media">
          <LazyImage src={`${base}${slug}/${filename}`} alt="" />
        </div>
      ))}

      {data.credits && (
        <div className="gpp-credits">
          <div className="gpp-credits-text secondary-tag">{data.credits}</div>
        </div>
      )}

      <div className="gpp-nav">
        {prevCard && (
          <Link to={prevCard.route} className="gpp-nav-prev h2">
            Previous Case<br /><ArrowLeft />
          </Link>
        )}
        {nextCard && (
          <Link to={nextCard.route} className="gpp-nav-next h2">
            Next Case<br /><ArrowRight />
          </Link>
        )}
      </div>

    </div>
  )
}
