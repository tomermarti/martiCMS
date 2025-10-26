'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

interface Article {
  id?: string
  slug: string
  title: string
  metaTitle?: string
  metaDescription?: string
  author: string
  featuredImage?: string
  contentType: string
  content: any
  facebookPixel?: string
  customScripts?: string
  keywords?: string[]
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
    metaTitle: article?.metaTitle || '',
    metaDescription: article?.metaDescription || '',
    author: article?.author || '',
    featuredImage: article?.featuredImage || '',
    contentType: article?.contentType || (article?.content as any)?.contentType || 'single_product',
    content: article?.content || { contentType: 'single_product', product: {} },
    facebookPixel: article?.facebookPixel || '',
    customScripts: article?.customScripts || '',
    keywords: article?.keywords || [],
    canonicalUrl: article?.canonicalUrl || '',
    published: article?.published || false,
  })
  
  const [keywordInput, setKeywordInput] = useState('')
  const [contentFields, setContentFields] = useState(formData.content)

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

  const handleContentTypeChange = (contentType: string) => {
    let newContent: any = { contentType }
    
    if (contentType === 'single_product') {
      newContent.product = {}
    } else if (contentType === 'multiple_products') {
      newContent.products = []
      newContent.intro = ''
    } else {
      newContent.body = ''
    }
    
    setContentFields(newContent)
    setFormData({ ...formData, contentType, content: newContent })
  }

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const newKeywords = [...(formData.keywords || []), keywordInput.trim()]
      setFormData({ ...formData, keywords: newKeywords })
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (index: number) => {
    const newKeywords = formData.keywords?.filter((_, i) => i !== index)
    setFormData({ ...formData, keywords: newKeywords })
  }

  const handleProductAdd = () => {
    const products = contentFields.products || []
    setContentFields({
      ...contentFields,
      products: [...products, { title: '', description: '', productLink: '', image: '' }]
    })
  }

  const handleProductRemove = (index: number) => {
    const products = contentFields.products.filter((_: any, i: number) => i !== index)
    setContentFields({ ...contentFields, products })
  }

  const handleProductChange = (index: number, field: string, value: string) => {
    const products = [...contentFields.products]
    products[index] = { ...products[index], [field]: value }
    setContentFields({ ...contentFields, products })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = {
        ...formData,
        slug: slug || generateSlug(formData.title),
        content: contentFields,
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
        <h2 className="form-section-title">Basic Information</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug *</label>
            <input
              type="text"
              className="form-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              readOnly={!!article}
            />
            <small className="text-tertiary">
              URL path: /{slug}/index.html
            </small>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Author *</label>
            <input
              type="text"
              className="form-input"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content Type *</label>
            <select
              className="form-select"
              value={formData.contentType}
              onChange={(e) => handleContentTypeChange(e.target.value)}
            >
              <option value="single_product">Single Product</option>
              <option value="multiple_products">Multiple Products</option>
              <option value="blog">Blog Article</option>
            </select>
          </div>
        </div>
      </div>

      {/* SEO & Meta */}
      <div className="form-section">
        <h2 className="form-section-title">SEO & Meta Information</h2>
        
        <div className="form-group">
          <label className="form-label">Meta Title</label>
          <input
            type="text"
            className="form-input"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            placeholder="Leave empty to use article title"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Meta Description</label>
          <textarea
            className="form-input"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            rows={3}
            placeholder="Brief description for search engines"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Canonical URL</label>
          <input
            type="url"
            className="form-input"
            value={formData.canonicalUrl}
            onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
            placeholder="https://example.com/article"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Keywords</label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <input
              type="text"
              className="form-input"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
              placeholder="Add keyword and press Enter"
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddKeyword}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
            {formData.keywords?.map((keyword, index) => (
              <span
                key={index}
                className="status-badge status-badge-info"
                style={{ cursor: 'pointer' }}
                onClick={() => handleRemoveKeyword(index)}
              >
                {keyword} ×
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="form-section">
        <h2 className="form-section-title">Featured Image</h2>
        <ImageUpload
          slug={slug || 'temp'}
          value={formData.featuredImage || ''}
          onChange={(url) => setFormData({ ...formData, featuredImage: url })}
        />
      </div>

      {/* Content */}
      <div className="form-section">
        <h2 className="form-section-title">Content</h2>
        
        {formData.contentType === 'single_product' && (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Product Description</label>
              <textarea
                className="form-input"
                value={contentFields.product?.description || ''}
                onChange={(e) => setContentFields({
                  ...contentFields,
                  product: { ...contentFields.product, description: e.target.value }
                })}
                rows={6}
                placeholder="Describe the product..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Product Link</label>
              <input
                type="url"
                className="form-input"
                value={contentFields.product?.productLink || ''}
                onChange={(e) => setContentFields({
                  ...contentFields,
                  product: { ...contentFields.product, productLink: e.target.value }
                })}
                placeholder="https://amazon.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">CTA Button Text</label>
              <input
                type="text"
                className="form-input"
                value={contentFields.product?.ctaText || ''}
                onChange={(e) => setContentFields({
                  ...contentFields,
                  product: { ...contentFields.product, ctaText: e.target.value }
                })}
                placeholder="View Product"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                className="form-input"
                value={contentFields.product?.rating || ''}
                onChange={(e) => setContentFields({
                  ...contentFields,
                  product: { ...contentFields.product, rating: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>
        )}

        {formData.contentType === 'multiple_products' && (
          <>
            <div className="form-group">
              <label className="form-label">Introduction</label>
              <textarea
                className="form-input"
                value={contentFields.intro || ''}
                onChange={(e) => setContentFields({ ...contentFields, intro: e.target.value })}
                rows={4}
                placeholder="Introduction text..."
              />
            </div>

            <div style={{ marginTop: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                <h3>Products</h3>
                <button type="button" className="btn btn-secondary" onClick={handleProductAdd}>
                  + Add Product
                </button>
              </div>

              {(contentFields.products || []).map((product: any, index: number) => (
                <div key={index} className="card" style={{ marginBottom: 'var(--spacing-4)', padding: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                    <h4>Product {index + 1}</h4>
                    <button
                      type="button"
                      className="btn btn-error btn-small"
                      onClick={() => handleProductRemove(index)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={product.title || ''}
                        onChange={(e) => handleProductChange(index, 'title', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Product Link</label>
                      <input
                        type="url"
                        className="form-input"
                        value={product.productLink || ''}
                        onChange={(e) => handleProductChange(index, 'productLink', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      value={product.description || ''}
                      onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <ImageUpload
                      slug={slug || 'temp'}
                      value={product.image || ''}
                      onChange={(url) => handleProductChange(index, 'image', url)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {formData.contentType === 'blog' && (
          <div className="form-group">
            <label className="form-label">Article Body</label>
            <textarea
              className="form-input"
              value={contentFields.body || ''}
              onChange={(e) => setContentFields({ ...contentFields, body: e.target.value })}
              rows={15}
              placeholder="Write your article content here..."
            />
          </div>
        )}
      </div>

      {/* Scripts & Tracking */}
      <div className="form-section">
        <h2 className="form-section-title">Scripts & Tracking</h2>
        
        <div className="form-group">
          <label className="form-label">Facebook Pixel ID</label>
          <input
            type="text"
            className="form-input"
            value={formData.facebookPixel}
            onChange={(e) => setFormData({ ...formData, facebookPixel: e.target.value })}
            placeholder="1234567890"
          />
          <small className="text-tertiary">
            Enter your Facebook Pixel ID (numbers only)
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Custom Scripts</label>
          <textarea
            className="form-input"
            value={formData.customScripts}
            onChange={(e) => setFormData({ ...formData, customScripts: e.target.value })}
            rows={8}
            placeholder="<script>...</script>"
            style={{ fontFamily: 'monospace' }}
          />
          <small className="text-tertiary">
            Add custom JavaScript or tracking codes (Google Analytics, Mixpanel, etc.)
          </small>
        </div>
      </div>

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
            {loading ? 'Saving...' : article ? 'Update Article' : 'Create Article'}
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

