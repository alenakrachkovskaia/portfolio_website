export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="main-container">
      <h1 style={{ position: 'absolute', left: '665px', top: '338px', fontFamily: 'Montagu Slab', fontWeight: 300, fontSize: '36px', color: 'var(--BLACK)' }}>
        {title}
      </h1>
    </div>
  )
}
