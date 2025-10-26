'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
  slug: string
  value: string
  onChange: (url: string) => void
}

export default function ImageUpload({ slug, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('slug', slug)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload image')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="form-group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {value ? (
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '200px',
              height: '150px',
              borderRadius: 'var(--border-radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
            }}
          >
            <img
              src={value}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="url"
              className="form-input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              style={{ marginBottom: 'var(--spacing-2)' }}
            />
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Change Image'}
              </button>
              <button
                type="button"
                className="btn btn-outlined btn-small"
                onClick={() => onChange('')}
                disabled={uploading}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              height: '200px',
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--border-radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'var(--color-systemFill)',
              transition: 'var(--transition-all)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
              e.currentTarget.style.background = 'var(--color-primaryTranslucent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.background = 'var(--color-systemFill)'
            }}
          >
            <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-2)' }}>
              📸
            </div>
            <p className="text-secondary">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
            <p className="text-tertiary" style={{ fontSize: 'var(--font-size-sm)' }}>
              or enter URL below
            </p>
          </div>
          <input
            type="url"
            className="form-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL"
            style={{ marginTop: 'var(--spacing-2)' }}
          />
        </div>
      )}

      {error && (
        <div className="text-error" style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)' }}>
          {error}
        </div>
      )}
    </div>
  )
}

