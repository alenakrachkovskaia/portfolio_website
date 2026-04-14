import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from '../components/NavArrows'
import './Mimicries.css'

const base = import.meta.env.BASE_URL

const images = [
  'mimicries-01', 'mimicries-02', 'mimicries-03', 'mimicries-04', 'mimicries-05',
  'mimicries-06', 'mimicries-07', 'mimicries-08', 'mimicries-09', 'mimicries-10',
  'mimicries-11',
]

export default function Mimicries() {
  return (
    <div className="mimicries-page">

      <div className="mimicries-media">
        <img src={`${base}mimicries/mimicries-01.webp`} alt="" />
      </div>

      <div className="mimicries-text">
        <div className="mimicries-text-tag tag">Fashion Photoshoot</div>
        <p className="mimicries-text-body text">Mimicries is an outdoor fashion editorial exploring the aesthetics of imperfection, the beauty found in human attempts to imitate what nature creates effortlessly. Five looks from showroom IERI were shot across the landscapes of Georgia. Styling, color, and silhouette were chosen to echo each terrain and seamlessly match natural light from afternoon through dusk.</p>
        <div className="mimicries-text-secondary secondary-tag">[Art Direction]  [Production]  [Styling]  [Retouching]</div>
      </div>

      {images.slice(1).map(name => (
        <div key={name} className="mimicries-media">
          <img src={`${base}mimicries/${name}.webp`} alt="" />
        </div>
      ))}

      <div className="mimicries-credits">
        <div className="mimicries-credits-text secondary-tag">[Photographer] Gio Kostava | [Clothes] IERI Store |  [Hair Stylist] Slava Kavtaradze | [Model] Rusiko Tsivtsivadze</div>
      </div>

      <div className="mimicries-nav">
        <Link to="/ustar" className="mimicries-nav-prev h2">Previous Case<br /><ArrowLeft /></Link>
        <Link to="/book" className="mimicries-nav-next h2">Next Case<br /><ArrowRight /></Link>
      </div>

    </div>
  )
}
