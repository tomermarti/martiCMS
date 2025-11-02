'use client'

import { useState } from 'react'

interface Variant {
  name: string
  description: string
  trafficPercent: number
  isControl: boolean
  changes: any
}

interface ABTestCreateModalProps {
  articleId: string
  onClose: () => void
  onSuccess: () => void
}

export default function ABTestCreateModal({
  articleId,
  onClose,
  onSuccess,
}: ABTestCreateModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Test configuration
  const [testName, setTestName] = useState('')
  const [testDescription, setTestDescription] = useState('')
  const [testType, setTestType] = useState('headline')
  const [distributionMode, setDistributionMode] = useState('manual')
  const [optimizationGoal, setOptimizationGoal] = useState('conversions')
  const [minSampleSize, setMinSampleSize] = useState(100)
  
  // Variants
  const [variants, setVariants] = useState<Variant[]>([
    {
      name: 'Control (Original)',
      description: 'Original version',
      trafficPercent: 50,
      isControl: true,
      changes: {},
    },
    {
      name: 'Variant A',
      description: '',
      trafficPercent: 50,
      isControl: false,
      changes: {},
    },
  ])

  const addVariant = () => {
    const newVariant: Variant = {
      name: `Variant ${String.fromCharCode(65 + variants.length - 1)}`,
      description: '',
      trafficPercent: 0,
      isControl: false,
      changes: {},
    }
    
    // Redistribute traffic equally
    const newTraffic = 100 / (variants.length + 1)
    const updatedVariants = variants.map(v => ({
      ...v,
      trafficPercent: newTraffic,
    }))
    
    setVariants([...updatedVariants, { ...newVariant, trafficPercent: newTraffic }])
  }

  const removeVariant = (index: number) => {
    if (variants[index].isControl) {
      alert('Cannot remove control variant')
      return
    }
    
    const newVariants = variants.filter((_, i) => i !== index)
    
    // Redistribute traffic equally
    const newTraffic = 100 / newVariants.length
    const updatedVariants = newVariants.map(v => ({
      ...v,
      trafficPercent: newTraffic,
    }))
    
    setVariants(updatedVariants)
  }

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const updateVariantChange = (index: number, changeKey: string, changeValue: any) => {
    const updated = [...variants]
    updated[index].changes = {
      ...updated[index].changes,
      [changeKey]: changeValue,
    }
    setVariants(updated)
  }

  const redistributeTraffic = () => {
    const equalTraffic = 100 / variants.length
    const updated = variants.map(v => ({
      ...v,
      trafficPercent: equalTraffic,
    }))
    setVariants(updated)
  }

  const handleSubmit = async () => {
    // Validation
    if (!testName.trim()) {
      alert('Please enter a test name')
      return
    }
    
    if (variants.length < 2) {
      alert('At least 2 variants are required')
      return
    }
    
    const totalTraffic = variants.reduce((sum, v) => sum + v.trafficPercent, 0)
    if (Math.abs(totalTraffic - 100) > 0.01) {
      alert('Traffic percentages must sum to 100%')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testName,
          description: testDescription,
          articleId,
          testType,
          distributionMode,
          optimizationGoal: distributionMode === 'auto_pilot' ? optimizationGoal : null,
          minSampleSize,
          variants,
        }),
      })
      
      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating test:', error)
      alert('Failed to create test')
    } finally {
      setLoading(false)
    }
  }

  const renderTestTypeFields = (variantIndex: number) => {
    const variant = variants[variantIndex]
    
    switch (testType) {
      case 'headline':
        return (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                value={variant.changes.title || ''}
                onChange={(e) => updateVariantChange(variantIndex, 'title', e.target.value)}
                placeholder="Enter new title"
                disabled={variant.isControl}
              />
            </div>
            <div className="form-group">
              <label>Meta Title</label>
              <input
                type="text"
                className="form-input"
                value={variant.changes.metaTitle || ''}
                onChange={(e) => updateVariantChange(variantIndex, 'metaTitle', e.target.value)}
                placeholder="Enter new meta title"
                disabled={variant.isControl}
              />
            </div>
          </>
        )
      
      case 'cta':
        return (
          <>
            <div className="form-group">
              <label>CTA Text</label>
              <input
                type="text"
                className="form-input"
                value={variant.changes.ctaText || ''}
                onChange={(e) => updateVariantChange(variantIndex, 'ctaText', e.target.value)}
                placeholder="e.g., Buy Now, Learn More"
                disabled={variant.isControl}
              />
            </div>
            <div className="form-group">
              <label>CTA Color</label>
              <input
                type="color"
                className="form-input"
                value={variant.changes.ctaColor || '#007bff'}
                onChange={(e) => updateVariantChange(variantIndex, 'ctaColor', e.target.value)}
                disabled={variant.isControl}
              />
            </div>
            <div className="form-group">
              <label>CTA Position</label>
              <select
                className="form-input"
                value={variant.changes.ctaPosition || 'bottom'}
                onChange={(e) => updateVariantChange(variantIndex, 'ctaPosition', e.target.value)}
                disabled={variant.isControl}
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </>
        )
      
      case 'image':
        return (
          <div className="form-group">
            <label>Featured Image URL</label>
            <input
              type="url"
              className="form-input"
              value={variant.changes.featuredImage || ''}
              onChange={(e) => updateVariantChange(variantIndex, 'featuredImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={variant.isControl}
            />
          </div>
        )
      
      case 'layout':
        return (
          <div className="form-group">
            <label>Layout Style</label>
            <select
              className="form-input"
              value={variant.changes.layout || 'default'}
              onChange={(e) => updateVariantChange(variantIndex, 'layout', e.target.value)}
              disabled={variant.isControl}
            >
              <option value="default">Default</option>
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="masonry">Masonry</option>
              <option value="full-width">Full Width</option>
            </select>
          </div>
        )
      
      default:
        return (
          <div className="form-group">
            <label>Custom Changes (JSON)</label>
            <textarea
              className="form-input"
              rows={4}
              value={JSON.stringify(variant.changes, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  updateVariant(variantIndex, 'changes', parsed)
                } catch (err) {
                  // Invalid JSON, ignore
                }
              }}
              disabled={variant.isControl}
            />
          </div>
        )
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create A/B Test</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Configuration</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Variants</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Traffic</div>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <div className="step-content">
              <div className="form-group">
                <label>Test Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g., Headline Test - Q4 2025"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="What are you testing and why?"
                />
              </div>

              <div className="form-group">
                <label>Test Type *</label>
                <select
                  className="form-input"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                >
                  <option value="headline">Headline / Title</option>
                  <option value="cta">Call-to-Action (CTA)</option>
                  <option value="image">Featured Image</option>
                  <option value="layout">Page Layout</option>
                  <option value="full_page">Full Page Content</option>
                </select>
              </div>

              <div className="form-group">
                <label>Distribution Mode *</label>
                <select
                  className="form-input"
                  value={distributionMode}
                  onChange={(e) => setDistributionMode(e.target.value)}
                >
                  <option value="manual">Manual - Set traffic % manually</option>
                  <option value="auto_pilot">Auto-Pilot - Optimize automatically</option>
                </select>
              </div>

              {distributionMode === 'auto_pilot' && (
                <>
                  <div className="form-group">
                    <label>Optimization Goal</label>
                    <select
                      className="form-input"
                      value={optimizationGoal}
                      onChange={(e) => setOptimizationGoal(e.target.value)}
                    >
                      <option value="conversions">Conversions</option>
                      <option value="engagement">Engagement</option>
                      <option value="click_through">Click-Through Rate</option>
                      <option value="time_on_page">Time on Page</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Minimum Sample Size</label>
                    <input
                      type="number"
                      className="form-input"
                      value={minSampleSize}
                      onChange={(e) => setMinSampleSize(parseInt(e.target.value))}
                      min="50"
                      step="50"
                    />
                    <small className="form-help">
                      Minimum views before auto-optimization kicks in
                    </small>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div className="variants-section">
                {variants.map((variant, index) => (
                  <div key={index} className={`variant-editor ${variant.isControl ? 'control' : ''}`}>
                    <div className="variant-editor-header">
                      <h3>
                        {variant.name}
                        {variant.isControl && <span className="badge">Control</span>}
                      </h3>
                      {!variant.isControl && variants.length > 2 && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeVariant(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Variant Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        className="form-input"
                        value={variant.description}
                        onChange={(e) => updateVariant(index, 'description', e.target.value)}
                        placeholder="What's different in this variant?"
                      />
                    </div>

                    {!variant.isControl && renderTestTypeFields(index)}
                  </div>
                ))}
              </div>

              <button className="btn btn-outlined" onClick={addVariant}>
                + Add Another Variant
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <div className="traffic-section">
                <div className="traffic-header">
                  <h3>Traffic Distribution</h3>
                  <button className="btn btn-sm btn-outlined" onClick={redistributeTraffic}>
                    Distribute Equally
                  </button>
                </div>

                {variants.map((variant, index) => (
                  <div key={index} className="traffic-control">
                    <div className="traffic-info">
                      <strong>{variant.name}</strong>
                      {variant.isControl && <span className="badge">Control</span>}
                    </div>
                    <div className="traffic-input-group">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={variant.trafficPercent}
                        onChange={(e) =>
                          updateVariant(index, 'trafficPercent', parseFloat(e.target.value))
                        }
                        disabled={distributionMode === 'auto_pilot'}
                      />
                      <input
                        type="number"
                        className="traffic-number"
                        value={variant.trafficPercent}
                        onChange={(e) =>
                          updateVariant(index, 'trafficPercent', parseFloat(e.target.value))
                        }
                        min="0"
                        max="100"
                        step="0.1"
                        disabled={distributionMode === 'auto_pilot'}
                      />
                      <span>%</span>
                    </div>
                  </div>
                ))}

                <div className="traffic-total">
                  <strong>Total:</strong>
                  <span className={variants.reduce((sum, v) => sum + v.trafficPercent, 0) === 100 ? 'valid' : 'invalid'}>
                    {variants.reduce((sum, v) => sum + v.trafficPercent, 0).toFixed(1)}%
                  </span>
                </div>

                {distributionMode === 'auto_pilot' && (
                  <div className="info-box">
                    <strong>🤖 Auto-Pilot Mode</strong>
                    <p>
                      Traffic will start distributed equally. After reaching the minimum sample size,
                      the system will automatically optimize traffic distribution to favor the
                      best-performing variant based on your optimization goal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button className="btn btn-outlined" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          
          <div style={{ flex: 1 }} />
          
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              Next
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Test'}
            </button>
          )}
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: var(--spacing-4);
          }

          .modal-content {
            background: var(--color-background);
            border-radius: var(--border-radius);
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-5);
            border-bottom: 1px solid var(--color-border);
          }

          .modal-header h2 {
            margin: 0;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 32px;
            cursor: pointer;
            color: var(--color-text-secondary);
            line-height: 1;
            padding: 0;
            width: 32px;
            height: 32px;
          }

          .close-btn:hover {
            color: var(--color-text);
          }

          .steps-indicator {
            display: flex;
            justify-content: space-around;
            padding: var(--spacing-4);
            border-bottom: 1px solid var(--color-border);
            background: var(--color-systemFill);
          }

          .step {
            padding: var(--spacing-2) var(--spacing-3);
            border-radius: var(--border-radius);
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
          }

          .step.active {
            background: var(--color-primary);
            color: white;
            font-weight: 600;
          }

          .modal-body {
            flex: 1;
            overflow-y: auto;
            padding: var(--spacing-5);
          }

          .step-content {
            max-width: 600px;
            margin: 0 auto;
          }

          .form-group {
            margin-bottom: var(--spacing-4);
          }

          .form-group label {
            display: block;
            margin-bottom: var(--spacing-2);
            font-weight: 500;
          }

          .form-input {
            width: 100%;
            padding: var(--spacing-3);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            font-size: var(--font-size-base);
            background: var(--color-background);
            color: var(--color-text);
          }

          .form-input:focus {
            outline: none;
            border-color: var(--color-primary);
          }

          .form-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .form-help {
            display: block;
            margin-top: var(--spacing-1);
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
          }

          .variants-section {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-4);
            margin-bottom: var(--spacing-4);
          }

          .variant-editor {
            border: 2px solid var(--color-border);
            border-radius: var(--border-radius);
            padding: var(--spacing-4);
          }

          .variant-editor.control {
            border-color: var(--color-primary);
            background: rgba(var(--color-primary-rgb), 0.05);
          }

          .variant-editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-3);
          }

          .variant-editor-header h3 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: var(--spacing-2);
          }

          .badge {
            font-size: var(--font-size-xs);
            padding: 2px 8px;
            background: var(--color-primary);
            color: white;
            border-radius: 3px;
            font-weight: 500;
          }

          .traffic-section {
            max-width: 600px;
            margin: 0 auto;
          }

          .traffic-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-4);
          }

          .traffic-header h3 {
            margin: 0;
          }

          .traffic-control {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-3);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            margin-bottom: var(--spacing-3);
          }

          .traffic-info {
            display: flex;
            align-items: center;
            gap: var(--spacing-2);
          }

          .traffic-input-group {
            display: flex;
            align-items: center;
            gap: var(--spacing-2);
          }

          .traffic-input-group input[type="range"] {
            width: 150px;
          }

          .traffic-number {
            width: 70px;
            padding: var(--spacing-1) var(--spacing-2);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            text-align: right;
          }

          .traffic-total {
            display: flex;
            justify-content: space-between;
            padding: var(--spacing-3);
            background: var(--color-systemFill);
            border-radius: var(--border-radius);
            font-size: var(--font-size-lg);
            margin-bottom: var(--spacing-4);
          }

          .traffic-total .valid {
            color: #28a745;
            font-weight: 600;
          }

          .traffic-total .invalid {
            color: #dc3545;
            font-weight: 600;
          }

          .info-box {
            padding: var(--spacing-4);
            background: rgba(var(--color-primary-rgb), 0.1);
            border: 1px solid var(--color-primary);
            border-radius: var(--border-radius);
          }

          .info-box strong {
            display: block;
            margin-bottom: var(--spacing-2);
          }

          .info-box p {
            margin: 0;
            font-size: var(--font-size-sm);
            line-height: 1.5;
          }

          .modal-footer {
            display: flex;
            gap: var(--spacing-2);
            padding: var(--spacing-5);
            border-top: 1px solid var(--color-border);
          }

          @media (max-width: 768px) {
            .modal-content {
              max-width: 100%;
              max-height: 100vh;
              border-radius: 0;
            }

            .steps-indicator {
              flex-direction: column;
              gap: var(--spacing-2);
            }

            .traffic-control {
              flex-direction: column;
              align-items: stretch;
              gap: var(--spacing-2);
            }

            .traffic-input-group input[type="range"] {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

