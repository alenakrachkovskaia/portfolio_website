import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import './Ceylon.css'

const base = import.meta.env.BASE_URL

const images = [
  'ceylon-00', 'ceylon-01', 'ceylon-02', 'ceylon-03', 'ceylon-04',
  'ceylon-05', 'ceylon-06', 'ceylon-07', 'ceylon-08', 'ceylon-09',
  'ceylon-10', 'ceylon-11', 'ceylon-12', 'ceylon-13', 'ceylon-14',
  'ceylon-15',
]

export default function Ceylon() {
  return (
    <div className="ceylon-page">

      <div className="ceylon-media">
        <LazyImage src={`${base}ceylon/ceylon-00.webp`} alt="" />
      </div>

      <div className="ceylon-text">
        <div className="ceylon-text-tag tag">Home Fragrance</div>
        <p className="ceylon-text-body text">Ceylon Home is a home fragrance company whose products are rooted in the traditions of Sri Lanka. Brand identity aims to build a sense of origin and journey, the feeling that each product has traveled a great distance to arrive in your home. Every detail of the project was chosen to carry that weight. Each box, each object becomes a small artifact, something that brings the atmosphere of a faraway place into everyday living.</p>
        <div className="ceylon-text-secondary secondary-tag">[Brand Identity]  [Art Direction]  [Packaging Design]</div>
      </div>

      {images.slice(1).map(name => (
        <div key={name} className="ceylon-media">
          <LazyImage src={`${base}ceylon/${name === 'ceylon-02' ? `${name}.gif` : `${name}.webp`}`} alt="" />
        </div>
      ))}

      <div className="ceylon-nav">
        <Link to="/skola" className="ceylon-nav-prev h2">Previous Case<br />←</Link>
        <Link to="/ustar" className="ceylon-nav-next h2">Next Case<br />→</Link>
      </div>

    </div>
  )
}
