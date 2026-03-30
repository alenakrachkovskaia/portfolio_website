import './Mimicries.css'

const base = import.meta.env.BASE_URL

const images = [
  'mimicries-00', 'mimicries-01', 'mimicries-02', 'mimicries-03', 'mimicries-04',
]

export default function Mimicries() {
  return (
    <div className="mimicries-page">

      <div className="mimicries-media">
        <img src={`${base}mimicries/mimicries-00.webp`} alt="" />
      </div>

      <div className="mimicries-text">
        <div className="mimicries-text-tag tag">Fashion Photoshoot</div>
        <p className="mimicries-text-body text">Description text.</p>
        <div className="mimicries-text-secondary secondary-tag">[Art Direction]  [Production]  [Styling]  [Retouching]</div>
      </div>

      {images.slice(1).map(name => (
        <div key={name} className="mimicries-media">
          <img src={`${base}mimicries/${name}.webp`} alt="" />
        </div>
      ))}

      <div className="mimicries-nav">
        <div className="mimicries-nav-prev h2">Previous Case<br />🡰</div>
        <div className="mimicries-nav-next h2">Next Case<br />🡲</div>
      </div>

    </div>
  )
}
