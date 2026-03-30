import './Ustar.css'

const base = import.meta.env.BASE_URL

const images = [
  'ustar-01', 'ustar-02', 'ustar-03', 'ustar-04', 'ustar-05',
  'ustar-06', 'ustar-07', 'ustar-08', 'ustar-09', 'ustar-10',
  'ustar-11', 'ustar-12', 'ustar-13', 'ustar-14',
]

export default function Ustar() {
  return (
    <div className="ustar-page">

      <div className="ustar-media">
        <img src={`${base}ustar/ustar-01.webp`} alt="" />
      </div>

      <div className="ustar-text">
        <div className="ustar-text-tag tag">Culture & Education</div>
        <p className="ustar-text-body text">Устlар (Lezgian) — master of crafts.<br />Ust'ar is a project based in Tsmur, Republic of Dagestan, created to bring traditional crafts back into the lives of school students through contemporary workshops. The visual identity was built around the idea that heritage itself is the most powerful message. To express this, an ancient Caucasian Albanian script was studied and reinterpreted, its letterforms became the foundation for a bespoke typeface that works within the modern Lezgian language, bridging Cyrillic with ancient writing culture. The color palette was drawn from Caucasian landscapes, and supporting typeface was chosen to echo the same organic curves found throughout the graphic system.</p>
        <div className="ustar-text-secondary secondary-tag">[brand identity]  [art direction]  [Type Design]</div>
      </div>

      {images.slice(1).map(name => (
        <div key={name} className="ustar-media">
          <img src={`${base}ustar/${name}.webp`} alt="" />
        </div>
      ))}

      <div className="ustar-nav">
        <div className="ustar-nav-prev h2">Previous Case<br />🡰</div>
        <div className="ustar-nav-next h2">Next Case<br />🡲</div>
      </div>

    </div>
  )
}
