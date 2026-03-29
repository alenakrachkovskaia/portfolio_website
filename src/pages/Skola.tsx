import './Skola.css'

const base = import.meta.env.BASE_URL

const images = [
  'skola-00', 'skola-01', 'skola-02', 'skola-03', 'skola-04',
  'skola-05', 'skola-06', 'skola-07', 'skola-08', 'skola-09',
  'skola-10', 'skola-11', 'skola-12', 'skola-13', 'skola-14',
  'skola-15', 'skola-16', 'skola-17', 'skola-18',
]

export default function Skola() {
  return (
    <div className="skola-page">

      <div className="skola-media">
        <img src={`${base}skola/skola-00.webp`} alt="" />
      </div>

      <div className="skola-text">
        <div className="skola-text-tag tag">Culture & Education</div>
        <p className="skola-text-body text">Škola (meaning "school") is an initiative by an art residency that brings together artists and educational institutions through shared programs. A brand was built around the idea of synthesis: the meeting point between the informal and the structured, the intuitive and the precise. At the core of the identity is a custom typeface. It was designed by merging the organic, almost childlike quality of handwritten letterforms with the strict grid of a monospaced typeface. The result is a visual language that feels both familiar and considered, mirroring the project's effort to connect artistic tradition with modern technology.</p>
        <div className="skola-text-secondary secondary-tag">[Brand Identity]  [Art Direction]  [Type Design]  [Editorial Design]</div>
      </div>

      {images.slice(1).map(name => (
        <div key={name} className="skola-media">
          {name === 'skola-07' || name === 'skola-10' ? (
            <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
              <iframe
                src={name === 'skola-07'
                  ? 'https://kinescope.io/embed/7MSs9CDpyobatAQmKahnLD'
                  : 'https://kinescope.io/embed/j12mmne64foZxuhyDBSCaT'}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
                frameBorder="0"
                allowFullScreen
                style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
              />
            </div>
          ) : (
            <img src={`${base}skola/${name}.webp`} alt="" />
          )}
        </div>
      ))}

      <div className="skola-nav">
        <div className="skola-nav-prev h2">Previous Case<br />🡰</div>
        <div className="skola-nav-next h2">Next Case<br />🡲</div>
      </div>

    </div>
  )
}
