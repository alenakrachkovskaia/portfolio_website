export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="main-container">
      <h1 className="placeholder-title">
        {title}
      </h1>
    </div>
  )
}
