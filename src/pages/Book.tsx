import './Book.css'

const base = import.meta.env.BASE_URL

const images = [
  'book-00',
]

export default function Book() {
  return (
    <div className="book-page">

      <div className="book-media">
        <img src={`${base}book/book-00.webp`} alt="" />
      </div>

      <div className="book-text">
        <div className="book-text-tag tag">PhD Thesis Book</div>
        <p className="book-text-body text">The Art of Printmaking is a PhD thesis book.</p>
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
