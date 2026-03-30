import './Gallery.css'

const base = import.meta.env.BASE_URL

const items: { type: 'image'; src: string }[] = [
  { type: 'image', src: `${base}gallery/gallery-01.jpg` },
]

export default function Gallery() {
  return (
    <div className="gallery-page">
      {items.map((item, i) =>
        item.type === 'image' ? (
          <img key={i} src={item.src} alt="" className="gallery-image" />
        ) : null
      )}
    </div>
  )
}
