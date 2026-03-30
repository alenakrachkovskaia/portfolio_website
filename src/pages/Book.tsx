import './Book.css'

const base = import.meta.env.BASE_URL

const images = [
  'book-00', 'book-01', 'book-02', 'book-03', 'book-04', 'book-05',
  'book-06', 'book-07', 'book-08', 'book-09', 'book-10', 'book-11',
]

export default function Book() {
  return (
    <div className="book-page">

      <div className="book-media">
        <img src={`${base}book/book-00.webp`} alt="" />
      </div>

      <div className="book-text">
        <div className="book-text-tag tag">PhD Thesis Book</div>
        <p className="book-text-body text">The Art of Printmaking (Alexey Veselovsky's PhD thesis) traces the history of printmaking through five key techniques, weaving together artworks, illustrations, and personal accounts from figures who shaped the craft. The accompanying publication was designed as a printed book of five chapters, one per technique. The design draws directly from the subject: layouts echo the structure of engraving plates with wide margins, and the color palette is built around copper and ink tones.</p>
        <div className="book-text-secondary secondary-tag">[Editorial Design]</div>
      </div>

      {images.slice(1).map(name => (
        <div key={name} className="book-media">
          <img src={`${base}book/${name}.webp`} alt="" />
        </div>
      ))}

      <div className="book-nav">
        <div className="book-nav-prev h2">Previous Case<br />🡰</div>
        <div className="book-nav-next h2">Next Case<br />🡲</div>
      </div>

    </div>
  )
}
