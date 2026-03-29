import './Ceylon.css'

const base = import.meta.env.BASE_URL

const images = [
  'ceylon-00', 'ceylon-01', 'ceylon-02', 'ceylon-03', 'ceylon-04',
  'ceylon-05', 'ceylon-06', 'ceylon-07', 'ceylon-08', 'ceylon-09',
  'ceylon-10', 'ceylon-11', 'ceylon-12', 'ceylon-13', 'ceylon-14',
]

export default function Ceylon() {
  return (
    <div className="ceylon-page">

      <div className="ceylon-media">
        <img src={`${base}ceylon/ceylon-00.webp`} alt="" />
      </div>

      <div className="ceylon-text">
        <div className="ceylon-text-tag tag">Home Fragrance</div>
        <p className="ceylon-text-body text">Ceylon Home is a home fragrance brand built around the rituals of scent and space. The identity draws from the warmth and precision of artisanal craft — balancing the organic with the refined. A visual language was developed to reflect the brand's philosophy: that a home should feel both intentional and alive. Typography, packaging, and art direction work together to create a coherent sensory world around each product.</p>
        <div className="ceylon-text-secondary secondary-tag">[Brand Identity]  [Art Direction]  [Packaging Design]</div>
      </div>

      {images.slice(1).map(name => (
        <div key={name} className="ceylon-media">
          <img src={`${base}ceylon/${name}.webp`} alt="" />
        </div>
      ))}

      <div className="ceylon-nav">
        <div className="ceylon-nav-prev h2">Previous Case<br />🡰</div>
        <div className="ceylon-nav-next h2">Next Case<br />🡲</div>
      </div>

    </div>
  )
}
