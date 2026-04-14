import LazyImage from '../components/LazyImage'
import './Gallery.css'

const base = import.meta.env.BASE_URL

type Item =
  | { type: 'image'; src: string }
  | { type: 'embed'; html: string }

const items: Item[] = [
  { type: 'image', src: `${base}gallery/gallery-01.webp` },
  { type: 'image', src: `${base}gallery/gallery-02.webp` },
  { type: 'image', src: `${base}gallery/gallery-03.webp` },
  { type: 'image', src: `${base}gallery/gallery-04.webp` },
  { type: 'image', src: `${base}gallery/gallery-05.webp` },
  { type: 'embed', html: `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/950513097?badge=0&autopause=0&player_id=0&app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="PARAJANIZE"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>` },
  { type: 'image', src: `${base}gallery/gallery-07.webp` },
  { type: 'image', src: `${base}gallery/gallery-08.webp` },
  { type: 'image', src: `${base}gallery/gallery-09.webp` },
  { type: 'embed', html: `<div style="position:relative;padding-top:56.25%;width:100%"><iframe src="https://kinescope.io/embed/7MSs9CDpyobatAQmKahnLD" allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;" frameborder="0" allowfullscreen style="position:absolute;width:100%;height:100%;top:0;left:0;"></iframe></div>` },
  { type: 'image', src: `${base}gallery/gallery-11.webp` },
  { type: 'image', src: `${base}gallery/gallery-12.webp` },
  { type: 'image', src: `${base}gallery/gallery-13.webp` },
  { type: 'image', src: `${base}gallery/gallery-14.webp` },
  { type: 'image', src: `${base}gallery/gallery-15.webp` },
  { type: 'image', src: `${base}gallery/gallery-16.webp` },
  { type: 'embed', html: `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/430480790?badge=0&autopause=0&player_id=0&app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Angst"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>` },
  { type: 'image', src: `${base}gallery/gallery-18.webp` },
  { type: 'image', src: `${base}gallery/gallery-19.webp` },
  { type: 'image', src: `${base}gallery/gallery-20.webp` },
  { type: 'image', src: `${base}gallery/gallery-22.webp` },
  { type: 'image', src: `${base}gallery/gallery-21.webp` },
  { type: 'image', src: `${base}gallery/gallery-23.webp` },
  { type: 'image', src: `${base}gallery/gallery-24.webp` },
  { type: 'image', src: `${base}gallery/gallery-25.webp` },
  { type: 'image', src: `${base}gallery/gallery-26.webp` },
  { type: 'image', src: `${base}gallery/gallery-27.webp` },
  { type: 'image', src: `${base}gallery/gallery-28.webp` },
  { type: 'image', src: `${base}gallery/gallery-29.webp` },
  { type: 'image', src: `${base}gallery/gallery-30.gif` },
  { type: 'image', src: `${base}gallery/gallery-31.webp` },
  { type: 'image', src: `${base}gallery/gallery-33.webp` },
  { type: 'image', src: `${base}gallery/gallery-34.webp` },
  { type: 'image', src: `${base}gallery/gallery-35.webp` },

]

export default function Gallery() {
  return (
    <div className="gallery-page">
      {items.map((item, i) =>
        item.type === 'image' ? (
          <LazyImage key={i} src={item.src} alt="" className="gallery-image" />
        ) : (
          <div key={i} className="gallery-embed" dangerouslySetInnerHTML={{ __html: item.html }} />
        )
      )}
    </div>
  )
}
