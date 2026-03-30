import './Gallery.css'

const base = import.meta.env.BASE_URL

const items: { type: 'image'; src: string }[] = [
  { type: 'image', src: `${base}gallery/gallery-01.webp` },
  { type: 'image', src: `${base}gallery/gallery-02.webp` },
  { type: 'image', src: `${base}gallery/gallery-03.webp` },
  { type: 'image', src: `${base}gallery/gallery-04.webp` },
  { type: 'image', src: `${base}gallery/gallery-05.webp` },
  { type: 'image', src: `${base}gallery/gallery-06.webp` },
  { type: 'image', src: `${base}gallery/gallery-07.webp` },
  { type: 'image', src: `${base}gallery/gallery-08.webp` },
  { type: 'image', src: `${base}gallery/gallery-09.webp` },
  { type: 'image', src: `${base}gallery/gallery-10.webp` },
  { type: 'image', src: `${base}gallery/gallery-11.webp` },
  { type: 'image', src: `${base}gallery/gallery-12.webp` },
  { type: 'image', src: `${base}gallery/gallery-13.webp` },
  { type: 'image', src: `${base}gallery/gallery-14.webp` },
  { type: 'image', src: `${base}gallery/gallery-15.webp` },
  { type: 'image', src: `${base}gallery/gallery-16.webp` },
  { type: 'image', src: `${base}gallery/gallery-17.webp` },
  { type: 'image', src: `${base}gallery/gallery-18.webp` },
  { type: 'image', src: `${base}gallery/gallery-19.webp` },
  { type: 'image', src: `${base}gallery/gallery-20.webp` },
  { type: 'image', src: `${base}gallery/gallery-21.webp` },
  { type: 'image', src: `${base}gallery/gallery-22.webp` },
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
