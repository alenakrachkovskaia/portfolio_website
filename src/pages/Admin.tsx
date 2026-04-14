import { useState, useEffect } from 'react'

const REPO = 'alenakrachkovskaia/portfolio_website'
const FILE_PATH = 'src/pages/Gallery.tsx'
const API = 'https://api.github.com'

type GalleryItem =
  | { type: 'image'; src: string }  // src = 'gallery/filename.webp' (no base prefix)
  | { type: 'embed'; html: string }

// ── Parsing ─────────────────────────────────────────────────────────────────

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

// ── Base64 helpers ───────────────────────────────────────────────────────────

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

// ── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [token, setToken] = useState('')
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 12
    }}>
      <h2 style={{ margin: 0 }}>Gallery Admin</h2>
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

// ── Root component ───────────────────────────────────────────────────────────

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

// ── Admin UI ─────────────────────────────────────────────────────────────────

function AdminUI({ token, onSignOut }: { token: string; onSignOut: () => void }) {
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
        const res = await fetch(`${API}/repos/${REPO}/contents/${FILE_PATH}`, {
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
      const res = await fetch(`${API}/repos/${REPO}/contents/${FILE_PATH}`, {
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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Gallery Admin</h1>
        <button onClick={onSignOut} disabled={busy}>Sign out</button>
      </div>

      {/* Top action bar */}
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

      {/* Publish status */}
      {publishStatus && (
        <div style={{
          padding: '10px 14px', marginBottom: 16, borderRadius: 4, fontSize: 14,
          background: publishStatus.startsWith('Error') ? '#fee' : '#efe',
          color: publishStatus.startsWith('Error') ? '#900' : '#2d6a4f',
        }}>
          {publishStatus}
        </div>
      )}

      {/* Gallery list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            border: '1px solid #ddd', borderRadius: 6, padding: 10, background: '#fafafa'
          }}>
            {/* Thumbnail */}
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

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: '#444' }}>
              <div style={{ fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.type}
              </div>
              <div style={{ opacity: 0.65, wordBreak: 'break-all', lineHeight: 1.4 }}>
                {item.type === 'image' ? item.src : item.html.slice(0, 100) + '…'}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
              <button onClick={() => moveItem(i, -1)} disabled={i === 0 || busy} style={{ padding: '4px 10px' }}>↑</button>
              <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1 || busy} style={{ padding: '4px 10px' }}>↓</button>
              <button onClick={() => deleteItem(i)} disabled={busy} style={{ padding: '4px 10px', color: '#c00' }}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom publish bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 12, alignItems: 'center' }}>
        {hasChanges && <span style={{ color: '#b85c00', fontSize: 13 }}>Unsaved changes</span>}
        {publishButton}
      </div>

      {showAddImage && (
        <AddImageModal token={token} onAdd={onAddImage} onClose={() => setShowAddImage(false)} setBusy={setBusy} />
      )}
      {showAddVideo && (
        <AddVideoModal onAdd={onAddVideo} onClose={() => setShowAddVideo(false)} />
      )}
    </div>
  )
}

// ── Add Image Modal ───────────────────────────────────────────────────────────

function AddImageModal({ token, onAdd, onClose, setBusy }: {
  token: string
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
      const filePath = `public/gallery/${filename}`

      // Check if file already exists to get its sha
      let existingSha: string | undefined
      const checkRes = await fetch(`${API}/repos/${REPO}/contents/${filePath}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
      })
      if (checkRes.ok) {
        existingSha = (await checkRes.json()).sha
      }

      const body: Record<string, string> = {
        message: `Add gallery image ${filename}`,
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

      onAdd({ type: 'image', src: `gallery/${filename}` })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
      setBusy(false)
    }
  }

  return (
    <ModalOverlay onClose={uploading ? undefined : onClose}>
      <h2 style={{ marginTop: 0 }}>Add Picture</h2>
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
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <div style={{
        background: '#fff', borderRadius: 8, padding: 28,
        width: 480, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto'
      }}>
        {children}
      </div>
    </div>
  )
}
