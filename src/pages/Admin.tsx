import { useState, useEffect, useRef } from 'react'
import defaultProjectsData from '../data/projects-data.json'

const REPO = 'alenakrachkovskaia/portfolio_website'
const GALLERY_FILE = 'src/pages/Gallery.tsx'
const PROJECTS_FILE = 'src/data/projects-data.json'
const API = 'https://api.github.com'

// ── Shared types ─────────────────────────────────────────────────────────────

type GalleryItem =
  | { type: 'image'; src: string }
  | { type: 'embed'; html: string }

interface CardData {
  slug: string
  name: string
  services: string
  category: string
  cardImage: string
  route: string
}

interface PageData {
  slug: string
  pageTag: string
  pageBody: string
  pageSecondaryTag: string
  images: string[]
  credits?: string
  overlayImages?: string[]
  videos?: Record<string, string>
}

interface ProjectsData {
  indexLines: string[]
  projectCards: CardData[]
  projectPages: Record<string, PageData>
}

// ── Gallery parsing ───────────────────────────────────────────────────────────

function parseItems(source: string): GalleryItem[] {
  const startMarker = 'const items: Item[] = ['
  const startIdx = source.indexOf(startMarker)
  if (startIdx === -1) return []
  const afterStart = startIdx + startMarker.length
  const endIdx = source.indexOf('\n]', afterStart)
  if (endIdx === -1) return []
  const arrayStr = source.slice(afterStart, endIdx)

  const items: GalleryItem[] = []
  for (const line of arrayStr.split('\n')) {
    const t = line.trim()
    if (!t.startsWith('{')) continue

    const imgMatch = t.match(/type:\s*'image',\s*src:\s*`\$\{base\}([^`]+)`/)
    if (imgMatch) {
      items.push({ type: 'image', src: imgMatch[1] })
      continue
    }

    const embedMatch = t.match(/type:\s*'embed',\s*html:\s*`([\s\S]*?)`\s*[,}]/)
    if (embedMatch) {
      items.push({ type: 'embed', html: embedMatch[1] })
    }
  }
  return items
}

function serializeItems(items: GalleryItem[]): string {
  const lines = items.map(item => {
    if (item.type === 'image') {
      return `  { type: 'image', src: \`\${base}${item.src}\` },`
    }
    const escaped = item.html
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${')
    return `  { type: 'embed', html: \`${escaped}\` },`
  })
  return '\n' + lines.join('\n') + '\n'
}

function reconstructSource(original: string, items: GalleryItem[]): string {
  const startMarker = 'const items: Item[] = ['
  const startIdx = original.indexOf(startMarker) + startMarker.length
  const endIdx = original.indexOf('\n]', startIdx)
  return original.slice(0, startIdx) + serializeItems(items) + original.slice(endIdx)
}

// ── Base64 helpers ────────────────────────────────────────────────────────────

function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
}

function decodeBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ''))))
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

// ── Login screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [token, setToken] = useState('')
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 12
    }}>
      <h2 style={{ margin: 0 }}>Admin</h2>
      <input
        type="password"
        placeholder="Password"
        value={token}
        onChange={e => setToken(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && token && onLogin(token)}
        style={{ padding: '8px 12px', fontSize: 16, width: 280 }}
      />
      <button
        onClick={() => token && onLogin(token)}
        style={{ padding: '8px 24px', fontSize: 16, cursor: 'pointer' }}
      >
        Sign in
      </button>
    </div>
  )
}

// ── Root component ────────────────────────────────────────────────────────────

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gh_admin_token'))

  function handleLogin(t: string) {
    localStorage.setItem('gh_admin_token', t)
    setToken(t)
  }

  function handleSignOut() {
    localStorage.removeItem('gh_admin_token')
    setToken(null)
  }

  if (!token) return <LoginScreen onLogin={handleLogin} />
  return <AdminUI token={token} onSignOut={handleSignOut} />
}

// ── Admin UI (tab switcher) ───────────────────────────────────────────────────

function AdminUI({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<'gallery' | 'projects'>('gallery')

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Admin</h1>
        <button onClick={onSignOut}>Sign out</button>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #ddd' }}>
        {(['gallery', 'projects'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 24px', border: 'none', background: 'none',
              fontSize: 15, cursor: 'pointer', fontWeight: tab === t ? 700 : 400,
              borderBottom: tab === t ? '2px solid #222' : '2px solid transparent',
              marginBottom: -2, textTransform: 'capitalize'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'gallery' ? (
        <GalleryAdmin token={token} />
      ) : (
        <ProjectsAdmin token={token} />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// GALLERY ADMIN
// ═══════════════════════════════════════════════════════════════════════════════

function GalleryAdmin({ token }: { token: string }) {
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [originalSource, setOriginalSource] = useState('')
  const [fileSha, setFileSha] = useState('')
  const [items, setItems] = useState<GalleryItem[]>([])
  const [originalItems, setOriginalItems] = useState<GalleryItem[]>([])
  const [busy, setBusy] = useState(false)
  const [publishStatus, setPublishStatus] = useState<string | null>(null)
  const [showAddImage, setShowAddImage] = useState(false)
  const [showAddVideo, setShowAddVideo] = useState(false)

  const base = import.meta.env.BASE_URL

  useEffect(() => {
    async function load() {
      setLoading(true)
      setFetchError(null)
      try {
        const res = await fetch(`${API}/repos/${REPO}/contents/${GALLERY_FILE}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
        })
        if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`)
        const data = await res.json()
        const decoded = decodeBase64(data.content)
        setOriginalSource(decoded)
        setFileSha(data.sha)
        const parsed = parseItems(decoded)
        setItems(parsed)
        setOriginalItems(parsed)
      } catch (e: any) {
        setFetchError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const hasChanges = JSON.stringify(items) !== JSON.stringify(originalItems)

  function moveItem(index: number, dir: -1 | 1) {
    setItems(prev => {
      const next = [...prev]
      const t = index + dir;
      [next[index], next[t]] = [next[t], next[index]]
      return next
    })
    setPublishStatus(null)
  }

  function deleteItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
    setPublishStatus(null)
  }

  async function publish() {
    setBusy(true)
    setPublishStatus(null)
    try {
      const newSource = reconstructSource(originalSource, items)
      const res = await fetch(`${API}/repos/${REPO}/contents/${GALLERY_FILE}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update gallery order and content',
          content: encodeBase64(newSource),
          sha: fileSha,
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setFileSha(data.content.sha)
      setOriginalItems(items)
      setOriginalSource(newSource)
      setPublishStatus('Published! GitHub Actions will redeploy in ~1 minute.')
    } catch (e: any) {
      setPublishStatus(`Error: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  function onAddImage(item: GalleryItem) {
    setItems(prev => [...prev, item])
    setShowAddImage(false)
    setPublishStatus(null)
  }

  function onAddVideo(item: GalleryItem) {
    setItems(prev => [...prev, item])
    setShowAddVideo(false)
    setPublishStatus(null)
  }

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Loading Gallery.tsx…</div>
  if (fetchError) return <div style={{ padding: 32, color: 'red' }}>Error: {fetchError}</div>

  const publishButton = (
    <button
      onClick={publish}
      disabled={!hasChanges || busy}
      style={{
        padding: '10px 24px', fontSize: 15, border: 'none', borderRadius: 4,
        background: hasChanges && !busy ? '#2d6a4f' : '#888',
        color: '#fff', cursor: hasChanges && !busy ? 'pointer' : 'default'
      }}
    >
      {busy ? 'Publishing…' : 'Publish changes'}
    </button>
  )

  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setShowAddImage(true)} disabled={busy} style={{ padding: '8px 18px', cursor: 'pointer' }}>
          + Add Picture
        </button>
        <button onClick={() => setShowAddVideo(true)} disabled={busy} style={{ padding: '8px 18px', cursor: 'pointer' }}>
          + Add Video
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {hasChanges && <span style={{ color: '#b85c00', fontSize: 13 }}>Unsaved changes</span>}
          {publishButton}
        </div>
      </div>

      {publishStatus && (
        <div style={{
          padding: '10px 14px', marginBottom: 16, borderRadius: 4, fontSize: 14,
          background: publishStatus.startsWith('Error') ? '#fee' : '#efe',
          color: publishStatus.startsWith('Error') ? '#900' : '#2d6a4f',
        }}>
          {publishStatus}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            border: '1px solid #ddd', borderRadius: 6, padding: 10, background: '#fafafa'
          }}>
            <div style={{ width: 160, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.type === 'image' ? (
                <img
                  src={`${base}${item.src}`}
                  alt=""
                  style={{ maxHeight: 120, maxWidth: 160, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: 160, height: 90, background: '#ccc', borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: '#555'
                }}>
                  Video embed
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: '#444' }}>
              <div style={{ fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.type}
              </div>
              <div style={{ opacity: 0.65, wordBreak: 'break-all', lineHeight: 1.4 }}>
                {item.type === 'image' ? item.src : item.html.slice(0, 100) + '…'}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
              <button onClick={() => moveItem(i, -1)} disabled={i === 0 || busy} style={{ padding: '4px 10px' }}>↑</button>
              <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1 || busy} style={{ padding: '4px 10px' }}>↓</button>
              <button onClick={() => deleteItem(i)} disabled={busy} style={{ padding: '4px 10px', color: '#c00' }}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 12, alignItems: 'center' }}>
        {hasChanges && <span style={{ color: '#b85c00', fontSize: 13 }}>Unsaved changes</span>}
        {publishButton}
      </div>

      {showAddImage && (
        <AddImageModal token={token} onAdd={onAddImage} onClose={() => setShowAddImage(false)} setBusy={setBusy} folder="gallery" />
      )}
      {showAddVideo && (
        <AddVideoModal onAdd={onAddVideo} onClose={() => setShowAddVideo(false)} />
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS ADMIN
// ═══════════════════════════════════════════════════════════════════════════════

function ProjectsAdmin({ token }: { token: string }) {
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [fileSha, setFileSha] = useState('')
  const [data, setData] = useState<ProjectsData | null>(null)
  const [originalData, setOriginalData] = useState<ProjectsData | null>(null)
  const [busy, setBusy] = useState(false)
  const [publishStatus, setPublishStatus] = useState<string | null>(null)
  const [section, setSection] = useState<'tags' | 'cards' | 'pages'>('tags')
  const [selectedSlug, setSelectedSlug] = useState<string>('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setFetchError(null)
      try {
        const res = await fetch(`${API}/repos/${REPO}/contents/${PROJECTS_FILE}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
        })
        let parsed: ProjectsData
        if (res.status === 404) {
          // File doesn't exist on GitHub yet — bootstrap from the bundled data
          parsed = defaultProjectsData as unknown as ProjectsData
          setFileSha('')
        } else {
          if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`)
          const file = await res.json()
          const decoded = decodeBase64(file.content)
          parsed = JSON.parse(decoded)
          setFileSha(file.sha)
        }
        setData(parsed)
        setOriginalData(parsed)
        if (parsed.projectCards.length > 0) setSelectedSlug(parsed.projectCards[0].slug)
      } catch (e: any) {
        setFetchError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData)

  async function publish() {
    if (!data) return
    setBusy(true)
    setPublishStatus(null)
    try {
      const json = JSON.stringify(data, null, 2) + '\n'
      const res = await fetch(`${API}/repos/${REPO}/contents/${PROJECTS_FILE}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update projects data',
          content: encodeBase64(json),
          ...(fileSha ? { sha: fileSha } : {}),
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || `HTTP ${res.status}`)
      }
      const result = await res.json()
      setFileSha(result.content.sha)
      setOriginalData(data)
      setPublishStatus('Published! GitHub Actions will redeploy in ~1 minute.')
    } catch (e: any) {
      setPublishStatus(`Error: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Loading projects data…</div>
  if (fetchError) return <div style={{ padding: 32, color: 'red' }}>Error: {fetchError}</div>
  if (!data) return null

  const publishBar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
      {hasChanges && <span style={{ color: '#b85c00', fontSize: 13 }}>Unsaved changes</span>}
      <button
        onClick={publish}
        disabled={!hasChanges || busy}
        style={{
          padding: '10px 24px', fontSize: 15, border: 'none', borderRadius: 4,
          background: hasChanges && !busy ? '#2d6a4f' : '#888',
          color: '#fff', cursor: hasChanges && !busy ? 'pointer' : 'default'
        }}
      >
        {busy ? 'Publishing…' : 'Publish changes'}
      </button>
    </div>
  )

  return (
    <>
      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {([['tags', 'Service Tags'], ['cards', 'Project Cards'], ['pages', 'Project Pages']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            style={{
              padding: '7px 16px', borderRadius: 4, border: '1px solid #ccc',
              background: section === key ? '#222' : '#fff',
              color: section === key ? '#fff' : '#222',
              cursor: 'pointer', fontSize: 13
            }}
          >
            {label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {hasChanges && <span style={{ color: '#b85c00', fontSize: 13 }}>Unsaved changes</span>}
          <button
            onClick={publish}
            disabled={!hasChanges || busy}
            style={{
              padding: '7px 20px', fontSize: 13, border: 'none', borderRadius: 4,
              background: hasChanges && !busy ? '#2d6a4f' : '#888',
              color: '#fff', cursor: hasChanges && !busy ? 'pointer' : 'default'
            }}
          >
            {busy ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      {publishStatus && (
        <div style={{
          padding: '10px 14px', marginBottom: 16, borderRadius: 4, fontSize: 14,
          background: publishStatus.startsWith('Error') ? '#fee' : '#efe',
          color: publishStatus.startsWith('Error') ? '#900' : '#2d6a4f',
        }}>
          {publishStatus}
        </div>
      )}

      {section === 'tags' && (
        <ServiceTagsSection data={data} setData={setData} busy={busy} setPublishStatus={setPublishStatus} />
      )}
      {section === 'cards' && (
        <ProjectCardsSection
          data={data} setData={setData} busy={busy} setBusy={setBusy}
          token={token} setPublishStatus={setPublishStatus}
        />
      )}
      {section === 'pages' && (
        <ProjectPagesSection
          data={data} setData={setData} busy={busy} setBusy={setBusy}
          token={token} setPublishStatus={setPublishStatus}
          selectedSlug={selectedSlug} setSelectedSlug={setSelectedSlug}
        />
      )}

      {publishBar}
    </>
  )
}

// ── Section A: Service Tags ───────────────────────────────────────────────────

function ServiceTagsSection({ data, setData, busy, setPublishStatus }: {
  data: ProjectsData
  setData: (d: ProjectsData) => void
  busy: boolean
  setPublishStatus: (s: string | null) => void
}) {
  function updateLine(i: number, val: string) {
    const next = [...data.indexLines]
    next[i] = val
    setData({ ...data, indexLines: next })
    setPublishStatus(null)
  }

  function deleteLine(i: number) {
    setData({ ...data, indexLines: data.indexLines.filter((_, idx) => idx !== i) })
    setPublishStatus(null)
  }

  function moveLine(i: number, dir: -1 | 1) {
    const next = [...data.indexLines]
    const t = i + dir;
    [next[i], next[t]] = [next[t], next[i]]
    setData({ ...data, indexLines: next })
    setPublishStatus(null)
  }

  function addLine() {
    setData({ ...data, indexLines: [...data.indexLines, ''] })
    setPublishStatus(null)
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: '#555', marginTop: 0 }}>
        These lines appear in the index card on the Projects page.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.indexLines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={line}
              onChange={e => updateLine(i, e.target.value)}
              disabled={busy}
              style={{ flex: 1, padding: '6px 10px', fontFamily: 'monospace', fontSize: 13 }}
            />
            <button onClick={() => moveLine(i, -1)} disabled={i === 0 || busy} style={{ padding: '4px 10px' }}>↑</button>
            <button onClick={() => moveLine(i, 1)} disabled={i === data.indexLines.length - 1 || busy} style={{ padding: '4px 10px' }}>↓</button>
            <button onClick={() => deleteLine(i)} disabled={busy} style={{ padding: '4px 10px', color: '#c00' }}>🗑</button>
          </div>
        ))}
      </div>
      <button onClick={addLine} disabled={busy} style={{ marginTop: 12, padding: '7px 16px', cursor: 'pointer' }}>
        + Add tag
      </button>
    </div>
  )
}

// ── Section B: Project Cards ──────────────────────────────────────────────────

function ProjectCardsSection({ data, setData, busy, setBusy, token, setPublishStatus }: {
  data: ProjectsData
  setData: (d: ProjectsData) => void
  busy: boolean
  setBusy: (b: boolean) => void
  token: string
  setPublishStatus: (s: string | null) => void
}) {
  const [editingCard, setEditingCard] = useState<CardData | null>(null)
  const [showAddProject, setShowAddProject] = useState(false)
  const base = import.meta.env.BASE_URL

  function moveCard(i: number, dir: -1 | 1) {
    const next = [...data.projectCards]
    const t = i + dir;
    [next[i], next[t]] = [next[t], next[i]]
    setData({ ...data, projectCards: next })
    setPublishStatus(null)
  }

  function deleteCard(slug: string) {
    if (!confirm(`Delete project "${slug}"? This only removes it from the list, not its page files.`)) return
    const next = data.projectCards.filter(c => c.slug !== slug)
    const pages = { ...data.projectPages }
    delete pages[slug]
    setData({ ...data, projectCards: next, projectPages: pages })
    setPublishStatus(null)
  }

  function saveCard(card: CardData) {
    const idx = data.projectCards.findIndex(c => c.slug === card.slug)
    const next = [...data.projectCards]
    if (idx === -1) {
      next.push(card)
      // also create a blank page entry if not exists
      const pages = { ...data.projectPages }
      if (!pages[card.slug]) {
        pages[card.slug] = {
          slug: card.slug,
          pageTag: card.category,
          pageBody: '',
          pageSecondaryTag: '',
          images: [],
        }
      }
      setData({ ...data, projectCards: next, projectPages: pages })
    } else {
      next[idx] = card
      setData({ ...data, projectCards: next })
    }
    setEditingCard(null)
    setShowAddProject(false)
    setPublishStatus(null)
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: '#555', marginTop: 0 }}>
        Manage the project cards shown on the Projects page. Order here controls the display order.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.projectCards.map((card, i) => (
          <div key={card.slug} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            border: '1px solid #ddd', borderRadius: 6, padding: 10, background: '#fafafa'
          }}>
            <div style={{ width: 120, flexShrink: 0 }}>
              <img
                src={`${base}${card.cardImage}`}
                alt=""
                style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 3, display: 'block' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 13 }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{card.name}</div>
              <div style={{ color: '#666', fontSize: 12 }}>{card.category} · {card.services}</div>
              <div style={{ color: '#999', fontSize: 11, marginTop: 2 }}>{card.route}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
              <button onClick={() => moveCard(i, -1)} disabled={i === 0 || busy} style={{ padding: '3px 8px' }}>↑</button>
              <button onClick={() => moveCard(i, 1)} disabled={i === data.projectCards.length - 1 || busy} style={{ padding: '3px 8px' }}>↓</button>
              <button onClick={() => setEditingCard(card)} disabled={busy} style={{ padding: '3px 8px' }}>✏️</button>
              <button onClick={() => deleteCard(card.slug)} disabled={busy} style={{ padding: '3px 8px', color: '#c00' }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setShowAddProject(true)} disabled={busy} style={{ marginTop: 12, padding: '7px 16px', cursor: 'pointer' }}>
        + Add Project
      </button>

      {editingCard && (
        <EditCardModal
          card={editingCard}
          token={token}
          busy={busy}
          setBusy={setBusy}
          onSave={saveCard}
          onClose={() => setEditingCard(null)}
        />
      )}
      {showAddProject && (
        <EditCardModal
          card={{ slug: '', name: '', services: '', category: '', cardImage: '', route: '' }}
          token={token}
          busy={busy}
          setBusy={setBusy}
          onSave={saveCard}
          onClose={() => setShowAddProject(false)}
          isNew
        />
      )}
    </div>
  )
}

// ── Section C: Project Pages ──────────────────────────────────────────────────

function ProjectPagesSection({ data, setData, busy, setBusy, token, setPublishStatus, selectedSlug, setSelectedSlug }: {
  data: ProjectsData
  setData: (d: ProjectsData) => void
  busy: boolean
  setBusy: (b: boolean) => void
  token: string
  setPublishStatus: (s: string | null) => void
  selectedSlug: string
  setSelectedSlug: (s: string) => void
}) {
  const [showUpload, setShowUpload] = useState(false)
  const base = import.meta.env.BASE_URL
  const page = data.projectPages[selectedSlug]

  function updatePage(updates: Partial<PageData>) {
    setData({
      ...data,
      projectPages: {
        ...data.projectPages,
        [selectedSlug]: { ...page, ...updates }
      }
    })
    setPublishStatus(null)
  }

  function moveImage(i: number, dir: -1 | 1) {
    const next = [...page.images]
    const t = i + dir;
    [next[i], next[t]] = [next[t], next[i]]
    updatePage({ images: next })
  }

  function deleteImage(i: number) {
    updatePage({ images: page.images.filter((_, idx) => idx !== i) })
  }

  function addUploadedImage(filename: string) {
    updatePage({ images: [...page.images, filename] })
    setShowUpload(false)
  }

  if (!selectedSlug || !page) {
    return <div style={{ color: '#888', fontSize: 13 }}>Select a project to edit its page.</div>
  }

  return (
    <div>
      {/* Project selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Project</label>
        <select
          value={selectedSlug}
          onChange={e => setSelectedSlug(e.target.value)}
          style={{ padding: '6px 10px', fontSize: 14 }}
        >
          {data.projectCards.map(c => (
            <option key={c.slug} value={c.slug}>{c.name} ({c.slug})</option>
          ))}
        </select>
      </div>

      {/* Text fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        <Field label="Page Tag (category on project page)">
          <input
            type="text" value={page.pageTag} disabled={busy}
            onChange={e => updatePage({ pageTag: e.target.value })}
            style={fieldStyle}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={page.pageBody} disabled={busy} rows={6}
            onChange={e => updatePage({ pageBody: e.target.value })}
            style={{ ...fieldStyle, fontFamily: 'inherit', resize: 'vertical' }}
          />
        </Field>
        <Field label="Secondary Tag (services on project page)">
          <input
            type="text" value={page.pageSecondaryTag} disabled={busy}
            onChange={e => updatePage({ pageSecondaryTag: e.target.value })}
            style={fieldStyle}
          />
        </Field>
        <Field label="Credits (optional)">
          <input
            type="text" value={page.credits ?? ''} disabled={busy}
            onChange={e => updatePage({ credits: e.target.value || undefined })}
            style={fieldStyle}
            placeholder="[Photographer] Name | [Clothes] Brand..."
          />
        </Field>
        <Field label="Overlay images (optional, comma-separated basenames without extension)">
          <input
            type="text"
            value={(page.overlayImages ?? []).join(', ')} disabled={busy}
            onChange={e => {
              const val = e.target.value.trim()
              updatePage({ overlayImages: val ? val.split(',').map(s => s.trim()).filter(Boolean) : undefined })
            }}
            style={fieldStyle}
            placeholder="book-02, book-06, book-08"
          />
        </Field>
        <Field label="Video positions (optional — format: filename-without-ext: url, one per line)">
          <textarea
            disabled={busy} rows={4}
            value={page.videos
              ? Object.entries(page.videos).map(([k, v]) => `${k}: ${v}`).join('\n')
              : ''}
            onChange={e => {
              const val = e.target.value.trim()
              if (!val) { updatePage({ videos: undefined }); return }
              const obj: Record<string, string> = {}
              for (const line of val.split('\n')) {
                const idx = line.indexOf(':')
                if (idx === -1) continue
                const k = line.slice(0, idx).trim()
                const v = line.slice(idx + 1).trim()
                if (k && v) obj[k] = v
              }
              updatePage({ videos: Object.keys(obj).length ? obj : undefined })
            }}
            style={{ ...fieldStyle, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
            placeholder={'skola-07: https://kinescope.io/embed/...\nskola-10: https://kinescope.io/embed/...'}
          />
        </Field>
      </div>

      {/* Images */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>Images ({page.images.length})</h3>
        <button onClick={() => setShowUpload(true)} disabled={busy} style={{ padding: '6px 14px', cursor: 'pointer' }}>
          + Upload Image
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#777', marginTop: 0, marginBottom: 12 }}>
        First image is the hero. Images are shown in this order.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {page.images.map((filename, i) => (
          <div key={`${filename}-${i}`} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid #ddd', borderRadius: 5, padding: 8, background: '#fafafa'
          }}>
            <div style={{ width: 120, flexShrink: 0 }}>
              {filename === '__grid__' ? (
                // Composite preview: 2×2 sample from the alb grid
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, width: '100%', height: 70, borderRadius: 3, overflow: 'hidden' }}>
                  {['alb-01', 'alb-02', 'alb-08', 'alb-09'].map(name => (
                    <img
                      key={name}
                      src={`${base}ustar/alb/${name}.webp`}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ))}
                </div>
              ) : (
                <img
                  src={`${base}${selectedSlug}/${filename}`}
                  alt=""
                  style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 3, display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2' }}
                />
              )}
            </div>
            <div style={{ flex: 1, fontSize: 12, color: '#555', wordBreak: 'break-all' }}>
              {i === 0 && <span style={{ background: '#eee', padding: '1px 6px', borderRadius: 3, marginRight: 6, fontSize: 11 }}>hero</span>}
              {filename === '__grid__' ? (
                <span>
                  <span style={{ background: '#e8f0fe', color: '#1a56db', padding: '1px 6px', borderRadius: 3, marginRight: 6, fontSize: 11 }}>special</span>
                  Type Design Grid (Albanian ↔ Cyrillic hover overlay)
                </span>
              ) : filename}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
              <button onClick={() => moveImage(i, -1)} disabled={i === 0 || busy} style={{ padding: '3px 8px' }}>↑</button>
              <button onClick={() => moveImage(i, 1)} disabled={i === page.images.length - 1 || busy} style={{ padding: '3px 8px' }}>↓</button>
              <button onClick={() => deleteImage(i)} disabled={busy} style={{ padding: '3px 8px', color: '#c00' }}>🗑</button>
            </div>
          </div>
        ))}
        {page.images.length === 0 && (
          <div style={{ color: '#aaa', fontSize: 13, padding: 16, textAlign: 'center', border: '1px dashed #ddd', borderRadius: 5 }}>
            No images yet. Upload one to get started.
          </div>
        )}
      </div>

      {showUpload && (
        <AddImageModal
          token={token}
          folder={selectedSlug}
          onAdd={item => { if (item.type === 'image') addUploadedImage(item.src.split('/').pop()!) }}
          onClose={() => setShowUpload(false)}
          setBusy={setBusy}
        />
      )}
    </div>
  )
}

// ── Field helper ──────────────────────────────────────────────────────────────

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '7px 10px', fontSize: 14, boxSizing: 'border-box'
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#444' }}>{label}</label>
      {children}
    </div>
  )
}

// ── Edit Card Modal ───────────────────────────────────────────────────────────

function EditCardModal({ card, token, busy, setBusy, onSave, onClose, isNew }: {
  card: CardData
  token: string
  busy: boolean
  setBusy: (b: boolean) => void
  onSave: (card: CardData) => void
  onClose: () => void
  isNew?: boolean
}) {
  const [form, setForm] = useState<CardData>({ ...card })
  const [showImgUpload, setShowImgUpload] = useState(false)
  const base = import.meta.env.BASE_URL

  function set(key: keyof CardData, val: string) {
    const next = { ...form, [key]: val }
    if (isNew && key === 'name') {
      next.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      next.route = `/${next.slug}`
    }
    setForm(next)
  }

  function valid() {
    return form.slug && form.name && form.route
  }

  return (
    <ModalOverlay onClose={busy ? undefined : onClose}>
      <h2 style={{ marginTop: 0 }}>{isNew ? 'Add Project' : 'Edit Project Card'}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="Name">
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)} style={fieldStyle} />
        </Field>
        <Field label="Slug (used as folder name and route ID)">
          <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} style={fieldStyle} />
        </Field>
        <Field label="Route (URL path, e.g. /my-project or /projects/my-project)">
          <input type="text" value={form.route} onChange={e => set('route', e.target.value)} style={fieldStyle} />
        </Field>
        <Field label="Category">
          <input type="text" value={form.category} onChange={e => set('category', e.target.value)} style={fieldStyle} />
        </Field>
        <Field label="Services (e.g. [1] [2] [3])">
          <input type="text" value={form.services} onChange={e => set('services', e.target.value)} style={fieldStyle} />
        </Field>
        <Field label="Card image path (e.g. projects/project-1.webp)">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text" value={form.cardImage} onChange={e => set('cardImage', e.target.value)}
              style={{ ...fieldStyle, flex: 1 }}
              placeholder="projects/project-1.webp"
            />
            <button onClick={() => setShowImgUpload(true)} disabled={busy} style={{ padding: '6px 12px', whiteSpace: 'nowrap', cursor: 'pointer' }}>
              Upload
            </button>
          </div>
          {form.cardImage && (
            <img
              src={`${base}${form.cardImage}`}
              alt=""
              style={{ marginTop: 8, maxHeight: 100, maxWidth: '100%', objectFit: 'contain', display: 'block', borderRadius: 3 }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </Field>
      </div>
      {isNew && (
        <p style={{ fontSize: 12, color: '#777', marginTop: 12 }}>
          New projects use the generic template at <code>/projects/{'{'}slug{'}'}</code>. You can change the route above.
        </p>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={() => valid() && onSave(form)} disabled={!valid() || busy} style={{ padding: '8px 18px', cursor: 'pointer' }}>
          {isNew ? 'Create Project' : 'Save'}
        </button>
        <button onClick={onClose} disabled={busy} style={{ padding: '8px 18px' }}>Cancel</button>
      </div>
      {showImgUpload && (
        <AddImageModal
          token={token}
          folder="projects"
          onAdd={item => {
            if (item.type === 'image') set('cardImage', item.src)
            setShowImgUpload(false)
          }}
          onClose={() => setShowImgUpload(false)}
          setBusy={setBusy}
        />
      )}
    </ModalOverlay>
  )
}

// ── Add Image Modal ───────────────────────────────────────────────────────────

function AddImageModal({ token, onAdd, onClose, setBusy, folder }: {
  token: string
  folder: string
  onAdd: (item: GalleryItem) => void
  onClose: () => void
  setBusy: (b: boolean) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [convertWebp, setConvertWebp] = useState(true)
  const [filename, setFilename] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFile(f: File) {
    setFile(f)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(f))
    const nameBase = f.name.replace(/\.[^.]+$/, '')
    setFilename(convertWebp ? `${nameBase}.webp` : f.name)
  }

  function handleConvertToggle(val: boolean) {
    setConvertWebp(val)
    if (file) {
      const nameBase = file.name.replace(/\.[^.]+$/, '')
      setFilename(val ? `${nameBase}.webp` : file.name)
    }
  }

  async function handleUpload() {
    if (!file || !filename) return
    setUploading(true)
    setBusy(true)
    setError(null)
    try {
      let blob: Blob
      if (convertWebp) {
        const img = await createImageBitmap(file)
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d')!.drawImage(img, 0, 0)
        blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob(b => b ? res(b) : rej(new Error('Canvas toBlob failed')), 'image/webp')
        )
      } else {
        blob = file
      }

      const base64 = await blobToBase64(blob)
      const filePath = `public/${folder}/${filename}`

      let existingSha: string | undefined
      const checkRes = await fetch(`${API}/repos/${REPO}/contents/${filePath}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
      })
      if (checkRes.ok) {
        existingSha = (await checkRes.json()).sha
      }

      const body: Record<string, string> = {
        message: `Add image ${filename} to ${folder}`,
        content: base64,
      }
      if (existingSha) body.sha = existingSha

      const res = await fetch(`${API}/repos/${REPO}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || `HTTP ${res.status}`)
      }

      onAdd({ type: 'image', src: `${folder}/${filename}` })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
      setBusy(false)
    }
  }

  return (
    <ModalOverlay onClose={uploading ? undefined : onClose}>
      <h2 style={{ marginTop: 0 }}>Upload Image</h2>
      <p style={{ fontSize: 12, color: '#777', margin: '0 0 10px' }}>Destination: <code>public/{folder}/</code></p>
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        style={{ display: 'block', marginBottom: 12 }}
      />
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', marginBottom: 12, display: 'block', borderRadius: 4 }}
        />
      )}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer' }}>
        <input type="checkbox" checked={convertWebp} onChange={e => handleConvertToggle(e.target.checked)} disabled={uploading} />
        Convert to WebP
      </label>
      <input
        type="text"
        value={filename}
        onChange={e => setFilename(e.target.value)}
        placeholder="Filename"
        disabled={uploading}
        style={{ width: '100%', padding: '6px 10px', marginBottom: 12, boxSizing: 'border-box' }}
      />
      {error && <div style={{ color: 'red', marginBottom: 12, fontSize: 13 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleUpload} disabled={!file || !filename || uploading} style={{ padding: '8px 18px', cursor: 'pointer' }}>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <button onClick={onClose} disabled={uploading} style={{ padding: '8px 18px' }}>Cancel</button>
      </div>
    </ModalOverlay>
  )
}

// ── Add Video Modal ───────────────────────────────────────────────────────────

function AddVideoModal({ onAdd, onClose }: {
  onAdd: (item: GalleryItem) => void
  onClose: () => void
}) {
  const [html, setHtml] = useState('')

  return (
    <ModalOverlay onClose={onClose}>
      <h2 style={{ marginTop: 0 }}>Add Video</h2>
      <p style={{ fontSize: 13, color: '#555', margin: '0 0 8px' }}>
        Paste the full &lt;iframe&gt; embed code from Vimeo or Kinescope
      </p>
      <textarea
        value={html}
        onChange={e => setHtml(e.target.value)}
        placeholder="Paste embed code"
        rows={6}
        style={{
          width: '100%', padding: 8, boxSizing: 'border-box',
          fontFamily: 'monospace', fontSize: 12, marginBottom: 12
        }}
      />
      {html.trim() && (
        <div style={{ marginBottom: 12, border: '1px solid #ddd', borderRadius: 4, padding: 8, background: '#f9f9f9' }}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => html.trim() && onAdd({ type: 'embed', html: html.trim() })}
          disabled={!html.trim()}
          style={{ padding: '8px 18px', cursor: 'pointer' }}
        >
          Add to gallery
        </button>
        <button onClick={onClose} style={{ padding: '8px 18px' }}>Cancel</button>
      </div>
    </ModalOverlay>
  )
}

// ── Modal overlay ─────────────────────────────────────────────────────────────

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}
      onClick={e => e.target === overlayRef.current && onClose?.()}
    >
      <div style={{
        background: '#fff', borderRadius: 8, padding: 28,
        width: 520, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto'
      }}>
        {children}
      </div>
    </div>
  )
}
