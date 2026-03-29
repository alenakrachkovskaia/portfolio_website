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
      {images.map(name => (
        <div key={name} className="skola-media">
          <img src={`${base}skola/${name}.webp`} alt="" />
        </div>
      ))}
    </div>
  )
}
