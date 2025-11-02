'use client'

import { useState, useEffect } from 'react'

interface Template {
  id: string
  name: string
  description?: string
  htmlContent: string
  category: string
  placeholders: string[]
  previewImage?: string
  isActive: boolean
  usageCount: number
  createdAt: string
  updatedAt: string
}

interface TemplateManagerProps {
  onTemplateSelect?: (template: Template) => void
  selectedTemplateId?: string
}

export default function TemplateManager({ onTemplateSelect, selectedTemplateId }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  // Load templates
  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateClick = (template: Template) => {
    if (onTemplateSelect) {
      onTemplateSelect(template)
    }
  }

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setShowCreateModal(true)
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setShowCreateModal(true)
  }

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template)
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await loadTemplates()
      }
    } catch (error) {
      console.error('Failed to delete template:', error)
    }
  }

  const handleModalClose = () => {
    setShowCreateModal(false)
    setEditingTemplate(null)
    loadTemplates()
  }

  if (loading) {
    return (
      <div className="template-manager loading">
        <div className="loading-spinner">Loading templates...</div>
      </div>
    )
  }

  return (
    <div className="template-manager">
      <div className="template-manager-header">
        <h3>📄 Template Manager</h3>
        <button 
          onClick={handleCreateTemplate}
          className="btn btn-primary btn-small"
        >
          + Create Template
        </button>
      </div>

      <div className="template-grid">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`template-card ${selectedTemplateId === template.id ? 'selected' : ''}`}
            onClick={() => handleTemplateClick(template)}
          >
            <div className="template-preview">
              {template.previewImage ? (
                <img src={template.previewImage} alt={template.name} />
              ) : (
                <div className="template-preview-placeholder">
                  <div className="template-icon">📄</div>
                  <div className="template-category">{template.category}</div>
                </div>
              )}
            </div>

            <div className="template-info">
              <h4>{template.name}</h4>
              {template.description && (
                <p className="template-description">{template.description}</p>
              )}
              
              <div className="template-meta">
                <span className="template-placeholders">
                  {template.placeholders.length} placeholders
                </span>
                <span className="template-usage">
                  Used {template.usageCount} times
                </span>
              </div>

              <div className="template-placeholders-list">
                {template.placeholders.map((placeholder) => (
                  <span key={placeholder} className="placeholder-tag">
                    {`{{${placeholder}}}`}
                  </span>
                ))}
              </div>
            </div>

            <div className="template-actions">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreviewTemplate(template)
                }}
                className="btn btn-primary btn-small"
              >
                Preview
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditTemplate(template)
                }}
                className="btn btn-outlined btn-small"
              >
                Edit
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteTemplate(template.id)
                }}
                className="btn btn-danger btn-small"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="no-templates">
            <div className="no-templates-icon">📄</div>
            <h4>No Templates Yet</h4>
            <p>Create your first template to get started with advanced AB testing!</p>
            <button 
              onClick={handleCreateTemplate}
              className="btn btn-primary"
            >
              Create First Template
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <TemplateCreateModal
          template={editingTemplate}
          onClose={handleModalClose}
        />
      )}

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}

      <style jsx>{`
        .template-manager {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .template-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .template-manager-header h3 {
          margin: 0;
          color: #333;
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .template-card {
          background: white;
          border-radius: 8px;
          padding: 15px;
          border: 2px solid #e9ecef;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .template-card:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0,123,255,0.15);
        }

        .template-card.selected {
          border-color: #007bff;
          background: #f8f9ff;
        }

        .template-preview {
          height: 120px;
          background: #f8f9fa;
          border-radius: 4px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .template-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .template-preview-placeholder {
          text-align: center;
          color: #6c757d;
        }

        .template-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .template-category {
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .template-info h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .template-description {
          font-size: 14px;
          color: #6c757d;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .template-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 12px;
        }

        .template-placeholders-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 15px;
        }

        .placeholder-tag {
          background: #e9ecef;
          color: #495057;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-family: monospace;
        }

        .template-actions {
          display: flex;
          gap: 8px;
        }

        .no-templates {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .no-templates-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-templates h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .no-templates p {
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

// Template Create/Edit Modal Component
interface TemplateCreateModalProps {
  template?: Template | null
  onClose: () => void
}

function TemplateCreateModal({ template, onClose }: TemplateCreateModalProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || 'custom',
    htmlContent: template?.htmlContent || '',
    placeholders: template?.placeholders?.join(', ') || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const placeholdersArray = formData.placeholders
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0)

      const payload = {
        ...formData,
        placeholders: placeholdersArray
      }

      const url = template ? `/api/templates/${template.id}` : '/api/templates'
      const method = template ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onClose()
      } else {
        const error = await response.json()
        alert(`Failed to save template: ${error.message}`)
      }
    } catch (error) {
      console.error('Failed to save template:', error)
      alert('Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{template ? 'Edit Template' : 'Create New Template'}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="template-form">
          <div className="form-group">
            <label>Template Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Urgent Sale Layout"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what this template is for..."
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="single_product">Single Product</option>
              <option value="multiple_products">Multiple Products</option>
              <option value="blog">Blog</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="form-group">
            <label>Placeholders (comma-separated)</label>
            <input
              type="text"
              value={formData.placeholders}
              onChange={(e) => handleChange('placeholders', e.target.value)}
              placeholder="title, image, cta, ctaUrl, price, description"
            />
            <small>These will be available as {`{{placeholder}}`} in your HTML</small>
          </div>

          <div className="form-group">
            <label>HTML Template *</label>
            <textarea
              value={formData.htmlContent}
              onChange={(e) => handleChange('htmlContent', e.target.value)}
              placeholder={`<div class="product-card">
  <h1>{{title}}</h1>
  <img src="{{image}}" alt="{{title}}" />
  <p>{{description}}</p>
  <a href="{{ctaUrl}}" class="btn btn-primary" style="background: {{ctaColor}}">{{cta}}</a>
</div>`}
              rows={12}
              required
            />
            <small>Use {`{{placeholder}}`} syntax for dynamic content</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-outlined">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : (template ? 'Update Template' : 'Create Template')}
            </button>
          </div>
        </form>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
          }

          .modal-header h3 {
            margin: 0;
          }

          .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6c757d;
          }

          .template-form {
            padding: 20px;
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

          .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
          }
        `}</style>
      </div>
    </div>
  )
}

// Template Preview Modal Component
interface TemplatePreviewModalProps {
  template: Template
  onClose: () => void
}

function TemplatePreviewModal({ template, onClose }: TemplatePreviewModalProps) {
  // Generate sample data for all placeholders
  const generateSampleData = (placeholders: string[]) => {
    const sampleData: Record<string, string> = {}
    
    placeholders.forEach(placeholder => {
      switch (placeholder.toLowerCase()) {
        case 'title':
          sampleData[placeholder] = '🔥 Amazing Product - Limited Time Offer!'
          break
        case 'image':
          sampleData[placeholder] = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=400&fit=crop'
          break
        case 'price':
          sampleData[placeholder] = '99.99'
          break
        case 'originalprice':
          sampleData[placeholder] = '199.99'
          break
        case 'saleprice':
          sampleData[placeholder] = '59.99'
          break
        case 'discount':
          sampleData[placeholder] = '70'
          break
        case 'cta':
          sampleData[placeholder] = 'Buy Now - Limited Time!'
          break
        case 'description':
          sampleData[placeholder] = 'This amazing product will change your life! High quality, affordable price, and incredible results guaranteed.'
          break
        case 'rating':
          sampleData[placeholder] = '4.8'
          break
        case 'reviewcount':
          sampleData[placeholder] = '1,247'
          break
        case 'urgencytext':
          sampleData[placeholder] = 'HURRY! Only 24 Hours Left'
          break
        case 'timeleft':
          sampleData[placeholder] = '23:45:32'
          break
        case 'customercount':
          sampleData[placeholder] = '15,000'
          break
        case 'testimonial1':
          sampleData[placeholder] = 'This product exceeded my expectations! Amazing quality and fast shipping.'
          break
        case 'testimonial2':
          sampleData[placeholder] = 'Best purchase I\'ve made this year. Highly recommend to everyone!'
          break
        case 'testimonial3':
          sampleData[placeholder] = 'Outstanding customer service and incredible value for money.'
          break
        default:
          sampleData[placeholder] = `Sample ${placeholder}`
      }
    })
    
    return sampleData
  }

  const sampleData = generateSampleData(template.placeholders)
  
  // Render template with sample data
  const renderTemplate = (htmlContent: string, data: Record<string, string>) => {
    let rendered = htmlContent
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'gi')
      rendered = rendered.replace(placeholder, data[key])
    })
    return rendered
  }

  const renderedHtml = renderTemplate(template.htmlContent, sampleData)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📄 Template Preview: {template.name}</h3>
          <button onClick={onClose} className="modal-close">×</button>
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
              <h4>Sample Data Used</h4>
              <div className="sample-data">
                {Object.entries(sampleData).map(([key, value]) => (
                  <div key={key} className="data-item">
                    <span className="data-key">{`{{${key}}}:`}</span>
                    <span className="data-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="preview-render">
            <h4>Live Preview</h4>
            <div className="preview-frame">
              <div 
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
                className="rendered-content"
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .preview-modal-content {
            background: white;
            border-radius: 8px;
            width: 95%;
            max-width: 1200px;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
          }

          .modal-header h3 {
            margin: 0;
            color: #333;
          }

          .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6c757d;
          }

          .preview-container {
            display: grid;
            grid-template-columns: 300px 1fr;
            min-height: 500px;
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

          .sample-data {
            max-height: 200px;
            overflow-y: auto;
          }

          .data-item {
            display: flex;
            flex-direction: column;
            margin-bottom: 8px;
            padding: 8px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e9ecef;
          }

          .data-key {
            font-family: monospace;
            font-size: 11px;
            color: #007bff;
            font-weight: 600;
          }

          .data-value {
            font-size: 12px;
            color: #333;
            margin-top: 2px;
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
