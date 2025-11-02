'use client'

import { useState, useEffect, useMemo } from 'react'

interface Template {
  id: string
  name: string
  description?: string
  htmlContent: string
  category: string
  placeholders: string[]
}

interface ArticleVariant {
  id: string
  name: string
  description?: string
  articleId: string
  templateId?: string
  template?: Template
  isControl: boolean
  trafficPercent: number
  data: any
  views: number
  conversions: number
  conversionRate: number
  isActive: boolean
  createdAt: string
}

interface VariantManagerProps {
  articleId: string
  onVariantsChange?: (variants: ArticleVariant[]) => void
}

export default function VariantManager({ articleId, onVariantsChange }: VariantManagerProps) {
  const [variants, setVariants] = useState<ArticleVariant[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ArticleVariant | null>(null)

  useEffect(() => {
    loadVariants()
    loadTemplates()
  }, [articleId])

  const loadVariants = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}/variants`)
      if (response.ok) {
        const data = await response.json()
        setVariants(data.variants || [])
        if (onVariantsChange) {
          onVariantsChange(data.variants || [])
        }
      }
    } catch (error) {
      console.error('Failed to load variants:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates?active=true')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const handleCreateVariant = () => {
    setEditingVariant(null)
    setShowCreateModal(true)
  }

  const handleEditVariant = (variant: ArticleVariant) => {
    setEditingVariant(variant)
    setShowCreateModal(true)
  }

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return

    try {
      const response = await fetch(`/api/articles/${articleId}/variants/${variantId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await loadVariants()
      }
    } catch (error) {
      console.error('Failed to delete variant:', error)
    }
  }

  const handleToggleVariant = async (variantId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/variants/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })
      if (response.ok) {
        await loadVariants()
      }
    } catch (error) {
      console.error('Failed to toggle variant:', error)
    }
  }

  const handleModalClose = () => {
    setShowCreateModal(false)
    setEditingVariant(null)
    loadVariants()
  }

  const totalTraffic = variants.reduce((sum, v) => sum + v.trafficPercent, 0)

  if (loading) {
    return (
      <div className="variant-manager loading">
        <div className="loading-spinner">Loading variants...</div>
      </div>
    )
  }

  return (
    <div className="variant-manager">
      <div className="variant-manager-header">
        <div>
          <h3>🎯 Article Variants</h3>
          <p className="traffic-summary">
            Total Traffic: <span className={totalTraffic === 100 ? 'valid' : 'invalid'}>
              {totalTraffic}%
            </span>
            {totalTraffic !== 100 && (
              <span className="traffic-warning">
                ⚠️ Should equal 100%
              </span>
            )}
          </p>
        </div>
        <button 
          type="button"
          onClick={handleCreateVariant}
          className="btn btn-primary btn-small"
        >
          + Add Variant
        </button>
      </div>

      <div className="variants-list">
        {variants.map((variant) => (
          <div key={variant.id} className={`variant-card ${!variant.isActive ? 'inactive' : ''}`}>
            <div className="variant-header">
              <div className="variant-info">
                <h4>
                  {variant.name}
                  {variant.isControl && <span className="control-badge">Control</span>}
                </h4>
                {variant.description && (
                  <p className="variant-description">{variant.description}</p>
                )}
              </div>
              <div className="variant-traffic">
                <VariantTrafficEditor
                  articleId={articleId}
                  variantId={variant.id}
                  currentPercent={variant.trafficPercent}
                  onUpdate={loadVariants}
                />
              </div>
            </div>

            {variant.template && (
              <div className="variant-template">
                <span className="template-badge">📄 {variant.template.name}</span>
              </div>
            )}

            <div className="variant-data">
              <h5>Content Data:</h5>
              <div className="data-preview">
                {Object.entries(variant.data || {}).map(([key, value]) => (
                  <div key={key} className="data-item">
                    <span className="data-key">{key}:</span>
                    <span className="data-value">
                      {typeof value === 'string' && value.length > 50 
                        ? `${value.substring(0, 50)}...` 
                        : String(value)
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="variant-stats">
              <div className="stat">
                <span className="stat-label">Views</span>
                <span className="stat-value">{variant.views.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Conversions</span>
                <span className="stat-value">{variant.conversions.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Rate</span>
                <span className="stat-value">{variant.conversionRate.toFixed(2)}%</span>
              </div>
            </div>

            <div className="variant-actions">
              <button 
                type="button"
                onClick={() => handleToggleVariant(variant.id, !variant.isActive)}
                className={`btn btn-small ${variant.isActive ? 'btn-outlined' : 'btn-primary'}`}
              >
                {variant.isActive ? 'Pause' : 'Activate'}
              </button>
              <button 
                type="button"
                onClick={() => handleEditVariant(variant)}
                className="btn btn-outlined btn-small"
              >
                Edit
              </button>
              <button 
                type="button"
                onClick={() => handleDeleteVariant(variant.id)}
                className="btn btn-danger btn-small"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {variants.length === 0 && (
          <div className="no-variants">
            <div className="no-variants-icon">🎯</div>
            <h4>No Variants Yet</h4>
            <p>Create variants to test different versions of your article!</p>
            <button 
              type="button"
              onClick={handleCreateVariant}
              className="btn btn-primary"
            >
              Create First Variant
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <VariantCreateModal
          articleId={articleId}
          variant={editingVariant}
          templates={templates}
          onClose={handleModalClose}
        />
      )}

      <style jsx>{`
        .variant-manager {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .variant-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .variant-manager-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .traffic-summary {
          margin: 0;
          font-size: 14px;
          color: #6c757d;
        }

        .traffic-summary .valid {
          color: #28a745;
          font-weight: 600;
        }

        .traffic-summary .invalid {
          color: #dc3545;
          font-weight: 600;
        }

        .traffic-warning {
          margin-left: 8px;
          color: #dc3545;
          font-size: 12px;
        }

        .variants-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .variant-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          border: 2px solid #e9ecef;
        }

        .variant-card.inactive {
          opacity: 0.6;
          border-color: #dee2e6;
        }

        .variant-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .variant-info h4 {
          margin: 0 0 5px 0;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-badge {
          background: #007bff;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .variant-description {
          margin: 0;
          font-size: 14px;
          color: #6c757d;
        }

        .variant-traffic {
          text-align: right;
        }

        .traffic-percent {
          font-size: 24px;
          font-weight: 600;
          color: #007bff;
        }

        .variant-template {
          margin-bottom: 15px;
        }

        .template-badge {
          background: #e9ecef;
          color: #495057;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .variant-data {
          margin-bottom: 15px;
        }

        .variant-data h5 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 14px;
        }

        .data-preview {
          background: #f8f9fa;
          border-radius: 4px;
          padding: 10px;
          max-height: 120px;
          overflow-y: auto;
        }

        .data-item {
          display: flex;
          margin-bottom: 4px;
          font-size: 12px;
        }

        .data-key {
          font-weight: 600;
          color: #495057;
          min-width: 80px;
        }

        .data-value {
          color: #6c757d;
          font-family: monospace;
        }

        .variant-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 11px;
          color: #6c757d;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .variant-actions {
          display: flex;
          gap: 8px;
        }

        .no-variants {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .no-variants-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-variants h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .no-variants p {
          margin: 0 0 20px 0;
        }

        .loading {
          text-align: center;
          padding: 40px;
        }

        .loading-spinner {
          color: #6c757d;
        }
      `}</style>
    </div>
  )
}

// Variant Create/Edit Modal Component
interface VariantCreateModalProps {
  articleId: string
  variant?: ArticleVariant | null
  templates: Template[]
  onClose: () => void
}

function VariantCreateModal({ articleId, variant, templates, onClose }: VariantCreateModalProps) {
  const [formData, setFormData] = useState({
    name: variant?.name || '',
    description: variant?.description || '',
    templateId: variant?.templateId || '',
    isControl: variant?.isControl || false,
    trafficPercent: variant?.trafficPercent || 50,
    data: JSON.stringify(variant?.data || {}, null, 2)
  })
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    variant?.template || null
  )
  const [saving, setSaving] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [placeholderData, setPlaceholderData] = useState<Record<string, string>>(
    variant?.data || {}
  )

  // Initialize placeholder data when variant or template changes
  useEffect(() => {
    if (variant?.template && variant?.data) {
      const initialData: Record<string, string> = {}
      variant.template.placeholders.forEach(placeholder => {
        initialData[placeholder] = variant.data?.[placeholder] || ''
      })
      setPlaceholderData(initialData)
      setFormData(prev => ({ ...prev, data: JSON.stringify(initialData, null, 2) }))
    }
  }, [variant?.id])

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template)
  }

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId) || null
    setSelectedTemplate(template)
    setFormData(prev => ({ ...prev, templateId }))

    // Initialize placeholder data if template is selected
    if (template) {
      const initialData: Record<string, string> = {}
      template.placeholders.forEach(placeholder => {
        // Preserve existing data if editing, otherwise use empty string
        initialData[placeholder] = variant?.data?.[placeholder] || ''
      })
      setPlaceholderData(initialData)
      setFormData(prev => ({ ...prev, data: JSON.stringify(initialData, null, 2) }))
    } else {
      setPlaceholderData({})
    }
  }

  // Update JSON data when placeholder values change
  const handlePlaceholderChange = (placeholder: string, value: string) => {
    const newData = { ...placeholderData, [placeholder]: value }
    setPlaceholderData(newData)
    setFormData(prev => ({ ...prev, data: JSON.stringify(newData, null, 2) }))
  }

  // Determine input type based on placeholder name
  const getInputType = (placeholder: string): string => {
    const lower = placeholder.toLowerCase()
    if (lower.includes('image') || lower.includes('url') || lower.includes('link') || lower === 'ctaurl') {
      return 'url'
    }
    if (lower.includes('price') || lower.includes('rating') || lower.includes('discount') || lower.includes('count')) {
      return 'text' // Keep as text to allow decimals and formatting
    }
    if (lower.includes('description') || lower.includes('content') || lower.includes('text')) {
      return 'textarea'
    }
    return 'text'
  }

  // Get placeholder label (capitalize and format)
  const getPlaceholderLabel = (placeholder: string): string => {
    return placeholder
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation() // Prevent event from bubbling to parent form
    }

    // Validate required fields
    if (!formData.name.trim()) {
      alert('Variant name is required')
      return
    }

    const trafficPercent = Number(formData.trafficPercent)
    if (isNaN(trafficPercent) || trafficPercent < 0 || trafficPercent > 100) {
      alert('Traffic percentage must be between 0 and 100')
      return
    }

    // Validate JSON data if no template is selected
    if (!selectedTemplate) {
      try {
        JSON.parse(formData.data)
      } catch (error) {
        alert('Please provide valid JSON data or select a template')
        return
      }
    }

    setSaving(true)

    try {
      // Use placeholderData if template is selected, otherwise parse JSON
      const payloadData = selectedTemplate 
        ? placeholderData 
        : (() => {
            try {
              return JSON.parse(formData.data)
            } catch (error) {
              return {}
            }
          })()

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        templateId: formData.templateId || null,
        isControl: formData.isControl,
        trafficPercent: trafficPercent,
        data: payloadData
      }

      const url = variant 
        ? `/api/articles/${articleId}/variants/${variant.id}` 
        : `/api/articles/${articleId}/variants`
      const method = variant ? 'PUT' : 'POST'

      console.log('Sending payload:', payload)
      console.log('URL:', url, 'Method:', method)
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (response.ok) {
        const result = await response.json()
        console.log('Success response:', result)
        onClose()
      } else {
        console.log('Error response status:', response.status)
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.log('Error data:', errorData)
        alert(`Failed to save variant: ${errorData.error || errorData.message || 'Unknown error occurred'}`)
      }
    } catch (error) {
      console.error('Failed to save variant:', error)
      alert('Failed to save variant')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{variant ? 'Edit Variant' : 'Create New Variant'}</h3>
          <button type="button" onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="variant-form" onClick={(e) => e.stopPropagation()}>
          <div className="form-row">
            <div className="form-group">
              <label>Variant Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Urgent Sale Version"
                required
              />
            </div>

            <div className="form-group">
              <label>Traffic Percentage *</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.trafficPercent}
                onChange={(e) => handleChange('trafficPercent', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what makes this variant different..."
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Template (Optional)</label>
            <select
              value={formData.templateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              <option value="">No Template (Use Article Content)</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.category})
                </option>
              ))}
            </select>
            {templates.length > 0 && (
              <div className="template-preview-grid">
                {templates.map(template => (
                  <div 
                    key={template.id} 
                    className={`template-preview-card ${formData.templateId === template.id ? 'selected' : ''}`}
                    onClick={() => handleTemplateChange(template.id)}
                  >
                    <div className="template-preview-header">
                      <h5>{template.name}</h5>
                      <span className="template-category">{template.category}</span>
                    </div>
                    <div className="template-preview-content">
                      <div className="template-placeholders">
                        {template.placeholders.slice(0, 4).map(placeholder => (
                          <span key={placeholder} className="placeholder-tag">
                            {`{{${placeholder}}}`}
                          </span>
                        ))}
                        {template.placeholders.length > 4 && (
                          <span className="placeholder-more">+{template.placeholders.length - 4}</span>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreviewTemplate(template)
                        }}
                        className="btn btn-outlined btn-small"
                      >
                        👁️ Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isControl}
                onChange={(e) => handleChange('isControl', e.target.checked)}
              />
              This is the control variant (original)
            </label>
          </div>

          {selectedTemplate && (
            <>
              <div className="template-info">
                <h4>📄 Template: {selectedTemplate.name}</h4>
                <p>Fill in the values below for all template placeholders:</p>
              </div>

              <div className="placeholders-section">
                <h4 className="placeholders-title">Template Macros / Placeholders</h4>
                <div className="placeholders-grid">
                  {selectedTemplate.placeholders.map((placeholder) => {
                    const inputType = getInputType(placeholder)
                    const label = getPlaceholderLabel(placeholder)
                    const value = placeholderData[placeholder] || ''

                    return (
                      <div key={placeholder} className="placeholder-field">
                        <label>
                          {label} <span className="placeholder-name">({`{{${placeholder}}}`})</span>
                        </label>
                        {inputType === 'textarea' ? (
                          <textarea
                            value={value}
                            onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}...`}
                            rows={3}
                          />
                        ) : (
                          <input
                            type={inputType}
                            value={value}
                            onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}...`}
                          />
                        )}
                        <small className="placeholder-hint">
                          {inputType === 'url' && '🔗 Enter a full URL (e.g., https://example.com/image.jpg)'}
                          {inputType === 'text' && placeholder.toLowerCase().includes('price') && '💰 Enter price (e.g., 29.99 or $29.99)'}
                          {inputType === 'text' && placeholder.toLowerCase().includes('rating') && '⭐ Enter rating (e.g., 4.8)'}
                          {inputType === 'text' && !placeholder.toLowerCase().includes('price') && !placeholder.toLowerCase().includes('rating') && '📝 Enter text value'}
                        </small>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {!selectedTemplate && (
            <div className="form-group">
              <label>Content Data (JSON) *</label>
              <textarea
                value={formData.data}
                onChange={(e) => handleChange('data', e.target.value)}
                placeholder='{\n  "title": "Your title here",\n  "image": "image-url",\n  "cta": "Button text"\n}'
                rows={12}
                required
              />
              <small>
                JSON data to override article content. Select a template above to use the visual form instead.
              </small>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-outlined">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : (variant ? 'Update Variant' : 'Create Variant')}
            </button>
          </div>
        </div>

        <style jsx>{`
          .modal-content.large {
            width: 95%;
            max-width: 800px;
          }

          .variant-form {
            padding: 20px;
          }

          .form-row {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 15px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
          }

          .form-group input[type="checkbox"] {
            width: auto;
            margin-right: 8px;
          }

          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }

          .form-group textarea {
            resize: vertical;
            font-family: monospace;
          }

          .form-group small {
            display: block;
            margin-top: 5px;
            color: #6c757d;
            font-size: 12px;
          }

          .template-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
          }

          .template-info h4 {
            margin: 0 0 5px 0;
            color: #333;
          }

          .template-info p {
            margin: 0;
            color: #6c757d;
            font-size: 14px;
          }

          .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
          }

          .placeholders-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #e9ecef;
          }

          .placeholders-title {
            margin: 0 0 20px 0;
            color: #333;
            font-size: 16px;
            font-weight: 600;
          }

          .placeholders-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }

          .placeholder-field {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #dee2e6;
          }

          .placeholder-field label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 14px;
          }

          .placeholder-name {
            font-family: monospace;
            font-size: 12px;
            color: #007bff;
            font-weight: normal;
          }

          .placeholder-field input,
          .placeholder-field textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
          }

          .placeholder-field textarea {
            resize: vertical;
            min-height: 60px;
          }

          .placeholder-hint {
            display: block;
            margin-top: 5px;
            font-size: 11px;
            color: #6c757d;
          }

          .template-preview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
          }

          .template-preview-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .template-preview-card:hover {
            border-color: #007bff;
            box-shadow: 0 2px 8px rgba(0,123,255,0.1);
          }

          .template-preview-card.selected {
            border-color: #007bff;
            background: #f0f7ff;
          }

          .template-preview-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
          }

          .template-preview-header h5 {
            margin: 0;
            font-size: 14px;
            color: #333;
          }

          .template-category {
            background: #e9ecef;
            color: #495057;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          }

          .template-preview-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .template-placeholders {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .placeholder-tag {
            background: #e7f3ff;
            color: #0066cc;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-family: monospace;
            font-weight: 600;
          }

          .placeholder-more {
            background: #f8f9fa;
            color: #6c757d;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
          }
        `}</style>
      </div>

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          placeholderData={placeholderData}
          onPlaceholderChange={handlePlaceholderChange}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  )
}

// Template Preview Modal Component
interface TemplatePreviewModalProps {
  template: Template
  placeholderData: Record<string, string>
  onPlaceholderChange: (placeholder: string, value: string) => void
  onClose: () => void
}

function TemplatePreviewModal({ template, placeholderData, onPlaceholderChange, onClose }: TemplatePreviewModalProps) {
  // Generate default/sample data for empty placeholders
  const generateDefaultData = (placeholders: string[], currentData: Record<string, string>) => {
    const defaultData: Record<string, string> = {}
    
    placeholders.forEach(placeholder => {
      // Use existing data if available, otherwise use sample
      if (currentData[placeholder]) {
        defaultData[placeholder] = currentData[placeholder]
      } else {
        switch (placeholder.toLowerCase()) {
          case 'title':
            defaultData[placeholder] = '🔥 Amazing Product - Limited Time Offer!'
            break
          case 'image':
          case 'featuredimage':
            defaultData[placeholder] = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=400&fit=crop'
            break
          case 'price':
            defaultData[placeholder] = '99.99'
            break
          case 'originalprice':
            defaultData[placeholder] = '199.99'
            break
          case 'saleprice':
            defaultData[placeholder] = '59.99'
            break
          case 'discount':
            defaultData[placeholder] = '70'
            break
          case 'cta':
          case 'ctatext':
            defaultData[placeholder] = 'Buy Now - Limited Time!'
            break
          case 'description':
            defaultData[placeholder] = 'This amazing product will change your life! High quality, affordable price, and incredible results guaranteed.'
            break
          case 'rating':
            defaultData[placeholder] = '4.8'
            break
          case 'reviewcount':
            defaultData[placeholder] = '1,247'
            break
          case 'urgencytext':
            defaultData[placeholder] = 'HURRY! Only 24 Hours Left'
            break
          case 'timeleft':
            defaultData[placeholder] = '23:45:32'
            break
          case 'customercount':
            defaultData[placeholder] = '15,000'
            break
          case 'testimonial1':
            defaultData[placeholder] = 'This product exceeded my expectations! Amazing quality and fast shipping.'
            break
          case 'testimonial2':
            defaultData[placeholder] = 'Best purchase I\'ve made this year. Highly recommend to everyone!'
            break
          case 'testimonial3':
            defaultData[placeholder] = 'Outstanding customer service and incredible value for money.'
            break
          default:
            defaultData[placeholder] = `Sample ${placeholder}`
        }
      }
    })
    
    return defaultData
  }

  // State for real-time preview
  const [localData, setLocalData] = useState<Record<string, string>>(() => 
    generateDefaultData(template.placeholders, placeholderData)
  )

  // Update local data when placeholderData changes
  useEffect(() => {
    const merged = generateDefaultData(template.placeholders, placeholderData)
    setLocalData(merged)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholderData])

  // Handle input change and update preview in real-time
  const handleInputChange = (placeholder: string, value: string) => {
    const newData = { ...localData, [placeholder]: value }
    setLocalData(newData)
    // Also update parent component
    onPlaceholderChange(placeholder, value)
  }

  // Render template with data - memoized for performance
  const renderedHtml = useMemo(() => {
    let rendered = template.htmlContent
    Object.keys(localData).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'gi')
      const value = localData[key] || ''
      rendered = rendered.replace(placeholder, value)
    })
    return rendered
  }, [template.htmlContent, localData])

  // Determine input type based on placeholder name
  const getInputType = (placeholder: string): string => {
    const lower = placeholder.toLowerCase()
    if (lower.includes('image') || lower.includes('url') || lower.includes('link')) {
      return 'url'
    }
    if (lower.includes('price') || lower.includes('rating') || lower.includes('discount') || lower.includes('count')) {
      return 'text'
    }
    if (lower.includes('description') || lower.includes('content') || lower.includes('text')) {
      return 'textarea'
    }
    return 'text'
  }

  // Get placeholder label
  const getPlaceholderLabel = (placeholder: string): string => {
    return placeholder
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📄 Template Preview: {template.name}</h3>
          <button type="button" onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="preview-container">
          <div className="preview-info">
            <div className="info-section">
              <h4>Template Info</h4>
              <p><strong>Category:</strong> {template.category}</p>
              <p><strong>Placeholders:</strong> {template.placeholders.length}</p>
              {template.description && <p><strong>Description:</strong> {template.description}</p>}
            </div>

            <div className="info-section">
              <h4>📝 Edit Macros (Real-time Preview)</h4>
              <div className="editable-macros">
                {template.placeholders.map((placeholder) => {
                  const inputType = getInputType(placeholder)
                  const label = getPlaceholderLabel(placeholder)
                  const value = localData[placeholder] || ''

                  return (
                    <div key={placeholder} className="macro-field">
                      <label>
                        {label} <span className="macro-name">({`{{${placeholder}}}`})</span>
                      </label>
                      {inputType === 'textarea' ? (
                        <textarea
                          value={value}
                          onChange={(e) => handleInputChange(placeholder, e.target.value)}
                          placeholder={`Enter ${label.toLowerCase()}...`}
                          rows={2}
                          className="macro-input"
                        />
                      ) : (
                        <input
                          type={inputType}
                          value={value}
                          onChange={(e) => handleInputChange(placeholder, e.target.value)}
                          placeholder={`Enter ${label.toLowerCase()}...`}
                          className="macro-input"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="preview-render">
            <h4>👁️ Live Preview</h4>
            <div className="preview-frame">
              <div 
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
                className="rendered-content"
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          .preview-modal-content {
            background: white;
            border-radius: 8px;
            width: 95%;
            max-width: 1200px;
            max-height: 90vh;
            overflow-y: auto;
          }

          .preview-container {
            display: grid;
            grid-template-columns: 350px 1fr;
            min-height: 600px;
            max-height: 85vh;
          }

          .preview-info {
            padding: 20px;
            background: #f8f9fa;
            border-right: 1px solid #e9ecef;
          }

          .info-section {
            margin-bottom: 25px;
          }

          .info-section h4 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 14px;
            text-transform: uppercase;
            font-weight: 600;
          }

          .info-section p {
            margin: 5px 0;
            font-size: 13px;
            color: #6c757d;
          }

          .editable-macros {
            max-height: 60vh;
            overflow-y: auto;
            padding-right: 5px;
          }

          .macro-field {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e9ecef;
          }

          .macro-field:last-child {
            border-bottom: none;
          }

          .macro-field label {
            display: block;
            margin-bottom: 6px;
            font-weight: 600;
            color: #333;
            font-size: 13px;
          }

          .macro-name {
            font-family: monospace;
            font-size: 11px;
            color: #007bff;
            font-weight: normal;
          }

          .macro-input {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            font-family: inherit;
            transition: border-color 0.2s;
          }

          .macro-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.1);
          }

          textarea.macro-input {
            resize: vertical;
            min-height: 50px;
          }

          .preview-render {
            padding: 20px;
          }

          .preview-render h4 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 14px;
            text-transform: uppercase;
            font-weight: 600;
          }

          .preview-frame {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            background: white;
            min-height: 400px;
            overflow: auto;
          }

          .rendered-content {
            padding: 20px;
          }

          @media (max-width: 768px) {
            .preview-container {
              grid-template-columns: 1fr;
            }
            
            .preview-info {
              border-right: none;
              border-bottom: 1px solid #e9ecef;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

// Variant Traffic Editor Component for inline editing
interface VariantTrafficEditorProps {
  articleId: string
  variantId: string
  currentPercent: number
  onUpdate: () => void
}

function VariantTrafficEditor({ articleId, variantId, currentPercent, onUpdate }: VariantTrafficEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(currentPercent.toString())
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const newPercent = parseFloat(value)
    
    if (isNaN(newPercent) || newPercent < 0 || newPercent > 100) {
      alert('Please enter a valid percentage between 0 and 100')
      setValue(currentPercent.toString())
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/articles/${articleId}/variants/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trafficPercent: newPercent }),
      })
      
      if (response.ok) {
        setIsEditing(false)
        onUpdate()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
        setValue(currentPercent.toString())
      }
    } catch (error) {
      console.error('Error updating traffic percentage:', error)
      alert('Failed to update traffic percentage')
      setValue(currentPercent.toString())
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setValue(currentPercent.toString())
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="variant-traffic-editor">
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          autoFocus
          disabled={saving}
          className="traffic-input"
        />
        <span className="traffic-controls">
          <button onClick={handleSave} disabled={saving} className="save-btn">
            {saving ? '⏳' : '✓'}
          </button>
          <button onClick={handleCancel} disabled={saving} className="cancel-btn">
            ✕
          </button>
        </span>
        <style jsx>{`
          .variant-traffic-editor {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .traffic-input {
            width: 60px;
            padding: 4px 8px;
            border: 2px solid #007bff;
            border-radius: 4px;
            font-size: 20px;
            font-weight: 600;
            text-align: right;
            color: #007bff;
          }
          
          .traffic-controls {
            display: flex;
            gap: 2px;
          }
          
          .save-btn, .cancel-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            padding: 4px;
            border-radius: 3px;
          }
          
          .save-btn {
            color: #28a745;
          }
          
          .save-btn:hover {
            background: rgba(40, 167, 69, 0.1);
          }
          
          .cancel-btn {
            color: #dc3545;
          }
          
          .cancel-btn:hover {
            background: rgba(220, 53, 69, 0.1);
          }
          
          .save-btn:disabled, .cancel-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    )
  }

  return (
    <span 
      className="traffic-percent editable" 
      onClick={() => setIsEditing(true)}
      title="Click to edit traffic percentage"
    >
      {currentPercent}% ✏️
      <style jsx>{`
        .traffic-percent.editable {
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
          font-size: 24px;
          font-weight: 600;
          color: #007bff;
        }
        
        .traffic-percent.editable:hover {
          background: rgba(0, 123, 255, 0.1);
        }
      `}</style>
    </span>
  )
}
