'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import VariantManager from './VariantManager'

interface Article {
  id?: string
  slug: string
  title: string
  author?: string
  canonicalUrl?: string
  published: boolean
}

interface ArticleFormProps {
  article?: Article
}

export default function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slug, setSlug] = useState(article?.slug || '')
  
  const [formData, setFormData] = useState<Article>({
    slug: article?.slug || '',
    title: article?.title || '',
    author: article?.author || 'MartiCMS',
    canonicalUrl: article?.canonicalUrl || '',
    published: article?.published || false,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    if (!slug || slug === article?.slug) return true
    
    try {
      const response = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()
      return data.length === 0
    } catch (error) {
      console.error('Error checking slug availability:', error)
      return true // Allow if check fails
    }
  }

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title })
    if (!article) {
      const newSlug = generateSlug(title)
      setSlug(newSlug)
      setFormData(prev => ({ ...prev, title, slug: newSlug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate slug availability for new articles
      if (!article) {
        const isSlugAvailable = await checkSlugAvailability(formData.slug)
        if (!isSlugAvailable) {
          setError(`Slug "${formData.slug}" is already taken. Please choose a different one.`)
          setLoading(false)
          return
        }
      }

      const submitData = {
        ...formData,
        slug: slug || generateSlug(formData.title),
        // Set default content structure for compatibility
        contentType: 'template_based',
        content: { contentType: 'template_based', note: 'Content managed via variants and templates' },
        featuredImage: '', // Will be set via templates
        facebookPixel: '', // Will be managed globally
        customScripts: '', // Will be managed globally
        // Set default SEO values
        metaTitle: formData.title,
        metaDescription: `${formData.title} - Discover amazing deals and products`,
        keywords: []
      }

      const url = article?.id ? `/api/articles/${article.id}` : '/api/articles'
      const method = article?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save article')
      }

      // Show success and redirect to main screen
      setError(null)
      setLoading(false)
      
      // Redirect to articles list
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!article?.id) return
    if (!confirm('Are you sure you want to delete this article?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete article')
      }

      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="campaign-builder-header">
        <h1 className="campaign-builder-title">
          {article ? 'Edit Article' : 'Create New Article'}
        </h1>
      </div>

      {error && (
        <div className="card" style={{ background: 'var(--color-errorTranslucent)', color: 'var(--color-error)', marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-4)' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="form-section">
        <h2 className="form-section-title">📝 Article Settings</h2>
        <p className="text-tertiary" style={{ marginBottom: 'var(--spacing-4)' }}>
          Basic article information. All content (images, descriptions, etc.) will be managed through variants and templates.
        </p>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Article Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Amazing Product Landing Page"
              required
            />
            <small className="text-tertiary">
              Internal name for this article (not shown to visitors)
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug *</label>
            <input
              type="text"
              className="form-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="amazing-product"
              required
              readOnly={!!article}
            />
            <small className="text-tertiary">
              URL: https://daily.get.martideals.com/{slug}/index.html
            </small>
          </div>
        </div>

        <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-input"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="MartiCMS"
          />
          <small className="text-tertiary">
            👤 Author name shown in article metadata and search results
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Canonical URL</label>
          <input
            type="url"
            className="form-input"
            value={formData.canonicalUrl}
            onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
            placeholder="https://example.com/original-article"
          />
          <small className="text-tertiary">
            🔗 Optional: If this content was originally published elsewhere, add the original URL to avoid duplicate content penalties
          </small>
        </div>
      </div>

      </div>


      {/* Note about content management */}
      <div className="form-section">
        <div className="info-banner">
          <h3>📄 Content Management</h3>
          <p>
            All content (images, text, CTAs, etc.) is now managed through <strong>Templates</strong> and <strong>Variants</strong> below. 
            This allows for powerful A/B testing and dynamic content without editing the article directly.
          </p>
          <div className="info-actions">
            <a href="/templates" target="_blank" className="btn btn-outlined btn-small">
              📄 Manage Templates
            </a>
          </div>
        </div>
      </div>

      {/* Variant Management */}
      {article?.id && (
        <div className="form-section">
          <h2 className="form-section-title">🎯 AB Testing Variants</h2>
          <p className="text-tertiary" style={{ marginBottom: 'var(--spacing-4)' }}>
            Create different versions of this article to test what performs best. 
            <a href="/templates" target="_blank" style={{ color: 'var(--primary-color)', marginLeft: '8px' }}>
              Manage Templates →
            </a>
          </p>
          <VariantManager 
            articleId={article.id}
          />
        </div>
      )}

      {/* Actions */}
      <div className="form-section">
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
            <span className="form-label" style={{ marginBottom: 0 }}>
              Publish to Digital Ocean Spaces
            </span>
          </label>
          <small className="text-tertiary">
            {formData.published
              ? '✅ Article will be deployed to Digital Ocean Spaces'
              : '⚠️ Article will be saved as draft only'
            }
          </small>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
{loading ? 'Publishing...' : article ? 'Update & Publish' : 'Create Article'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push('/')}
            disabled={loading}
          >
            Cancel
          </button>

          {article && (
            <button
              type="button"
              className="btn btn-error"
              onClick={handleDelete}
              disabled={loading}
              style={{ marginLeft: 'auto' }}
            >
              Delete Article
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

// Add CSS for the info banner
const styles = `
.info-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
}

.info-banner h3 {
  margin: 0 0 12px 0;
  font-size: 1.3rem;
}

.info-banner p {
  margin: 0 0 20px 0;
  opacity: 0.9;
  line-height: 1.5;
}

.info-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.info-banner .btn {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
}

.info-banner .btn:hover {
  background: rgba(255,255,255,0.3);
}

`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

