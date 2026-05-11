'use client'

import type { PutBlobResult } from '@vercel/blob'
import { upload } from '@vercel/blob/client'
import { useRef, useState } from 'react'

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [blob, setBlob] = useState<PutBlobResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: '#050505',
        color: '#F8F4EE',
        fontFamily: 'var(--font-inter, system-ui, sans-serif)',
      }}
    >
      <p style={{ opacity: 0.6, marginBottom: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.12em' }}>
        OCTOVISUAL · BLOB
      </p>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        Envoyer vers Vercel Blob
      </h1>
      <p style={{ opacity: 0.75, maxWidth: '42rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
        Fichiers lourds (vidéos) : upload direct depuis le navigateur. Copie l’URL publique dans{' '}
        <code style={{ opacity: 0.9 }}>data/videos/list.ts</code> (champs{' '}
        <code style={{ opacity: 0.9 }}>videoUrl</code> / <code style={{ opacity: 0.9 }}>thumbnail</code>).
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setBlob(null)
          const files = inputRef.current?.files
          if (!files?.length) {
            setError('Choisis un fichier.')
            return
          }
          const file = files[0]
          setLoading(true)
          try {
            const result = await upload(file.name, file, {
              access: 'public',
              handleUploadUrl: '/api/blob/upload',
            })
            setBlob(result)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Échec de l’upload')
          } finally {
            setLoading(false)
          }
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}
      >
        <input
          ref={inputRef}
          name="file"
          type="file"
          accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"
          required
          style={{ color: 'inherit' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            border: 'none',
            background: '#FF6A3D',
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Envoi…' : 'Uploader'}
        </button>
      </form>

      {error && (
        <p style={{ color: '#ff6b6b', marginTop: '1rem', maxWidth: '40rem' }} role="alert">
          {error}
        </p>
      )}

      {blob && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', maxWidth: '52rem', wordBreak: 'break-all' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>URL publique</p>
          <a href={blob.url} style={{ color: '#7ec8ff' }}>
            {blob.url}
          </a>
          <p style={{ marginTop: '0.75rem', opacity: 0.65, fontSize: '0.85rem' }}>
            Chemin : {blob.pathname}
          </p>
        </div>
      )}

      <p style={{ marginTop: '2rem', opacity: 0.45, fontSize: '0.8rem', maxWidth: '40rem' }}>
        Local : assure-toi d’avoir exécuté <code>vercel link</code> puis <code>vercel env pull</code> pour
        charger <code>BLOB_READ_WRITE_TOKEN</code>. Sans ce token, l’API renverra une erreur.
      </p>
    </main>
  )
}
