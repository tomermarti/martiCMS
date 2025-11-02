'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ABTestCreateModal from './ABTestCreateModal'
import ABTestAnalytics from './ABTestAnalytics'

interface ABTest {
  id: string
  name: string
  description?: string
  status: string
  testType: string
  distributionMode: string
  optimizationGoal?: string
  minSampleSize: number
  confidenceLevel: number
  startDate?: Date
  endDate?: Date
  winningVariantId?: string
  variants: ABVariant[]
}

interface ABVariant {
  id: string
  name: string
  description?: string
  trafficPercent: number
  isControl: boolean
  changes: any
  views: number
  conversions: number
  conversionRate: number
  clicks: number
  clickThroughRate: number
  isSignificant: boolean
}

interface ABTestManagerProps {
  articleId: string
  articleTitle: string
}

export default function ABTestManager({ articleId, articleTitle }: ABTestManagerProps) {
  const [tests, setTests] = useState<ABTest[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchTests()
  }, [articleId])

  const fetchTests = async () => {
    try {
      const response = await fetch(`/api/ab-tests?articleId=${articleId}`)
      if (response.ok) {
        const data = await response.json()
        setTests(data)
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/ab-tests/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'running' }),
      })
      
      if (response.ok) {
        fetchTests()
      }
    } catch (error) {
      console.error('Error starting test:', error)
    }
  }

  const handlePauseTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/ab-tests/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' }),
      })
      
      if (response.ok) {
        fetchTests()
      }
    } catch (error) {
      console.error('Error pausing test:', error)
    }
  }

  const handleCompleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to complete this test? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/ab-tests/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })
      
      if (response.ok) {
        fetchTests()
      }
    } catch (error) {
      console.error('Error completing test:', error)
    }
  }

  const handleDeleteTest = async (testId: string, testName: string) => {
    if (!confirm(`Are you sure you want to delete "${testName}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      const response = await fetch(`/api/ab-tests/${testId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchTests()
      }
    } catch (error) {
      console.error('Error deleting test:', error)
    }
  }

  const handleOptimize = async (testId: string) => {
    try {
      const response = await fetch(`/api/ab-tests/${testId}/optimize`, {
        method: 'POST',
      })
      
      if (response.ok) {
        fetchTests()
      }
    } catch (error) {
      console.error('Error optimizing test:', error)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'running':
        return 'status-badge-success'
      case 'paused':
        return 'status-badge-warning'
      case 'completed':
        return 'status-badge-info'
      default:
        return 'status-badge-default'
    }
  }

  if (loading) {
    return <div className="loading">Loading A/B tests...</div>
  }

  return (
    <div className="ab-test-manager">
      <div className="ab-test-header">
        <div>
          <h2>A/B Tests for "{articleTitle}"</h2>
          <p className="text-secondary">
            Create and manage A/B tests to optimize your content performance
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          + Create A/B Test
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧪</div>
          <h3>No A/B tests yet</h3>
          <p>Create your first A/B test to start optimizing your content</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create A/B Test
          </button>
        </div>
      ) : (
        <div className="tests-list">
          {tests.map((test) => (
            <div key={test.id} className="test-card">
              <div className="test-header">
                <div>
                  <h3>{test.name}</h3>
                  {test.description && (
                    <p className="text-secondary">{test.description}</p>
                  )}
                </div>
                <span className={`status-badge ${getStatusBadgeClass(test.status)}`}>
                  {test.status}
                </span>
              </div>

              <div className="test-meta">
                <span><strong>Type:</strong> {test.testType}</span>
                <span><strong>Mode:</strong> {test.distributionMode}</span>
                {test.optimizationGoal && (
                  <span><strong>Goal:</strong> {test.optimizationGoal}</span>
                )}
              </div>

              <div className="variants-grid">
                {test.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`variant-card ${variant.isControl ? 'control-variant' : ''} ${
                      test.winningVariantId === variant.id ? 'winning-variant' : ''
                    }`}
                  >
                    <div className="variant-header">
                      <h4>
                        {variant.name}
                        {variant.isControl && <span className="control-badge">Control</span>}
                        {test.winningVariantId === variant.id && (
                          <span className="winner-badge">🏆 Winner</span>
                        )}
                      </h4>
                      <TrafficPercentEditor
                        testId={test.id}
                        variantId={variant.id}
                        currentPercent={variant.trafficPercent}
                        isDisabled={test.distributionMode === 'auto_pilot' || test.status !== 'running'}
                        onUpdate={fetchTests}
                      />
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
                        <span className="stat-label">Conv. Rate</span>
                        <span className="stat-value">{variant.conversionRate.toFixed(2)}%</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">CTR</span>
                        <span className="stat-value">{variant.clickThroughRate.toFixed(2)}%</span>
                      </div>
                    </div>

                    {variant.isSignificant && !variant.isControl && (
                      <div className="significance-badge">
                        ✓ Statistically Significant
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="test-actions">
                <button
                  onClick={() => setSelectedTestId(selectedTestId === test.id ? null : test.id)}
                  className="btn btn-outlined btn-sm"
                >
                  {selectedTestId === test.id ? 'Hide Analytics' : '📊 View Analytics'}
                </button>
                
                {test.status === 'draft' && (
                  <button
                    onClick={() => handleStartTest(test.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Start Test
                  </button>
                )}
                
                {test.status === 'running' && (
                  <>
                    <button
                      onClick={() => handlePauseTest(test.id)}
                      className="btn btn-outlined btn-sm"
                    >
                      Pause
                    </button>
                    {test.distributionMode === 'auto_pilot' && (
                      <button
                        onClick={() => handleOptimize(test.id)}
                        className="btn btn-outlined btn-sm"
                      >
                        Optimize Now
                      </button>
                    )}
                    <button
                      onClick={() => handleCompleteTest(test.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Complete Test
                    </button>
                  </>
                )}
                
                {test.status === 'paused' && (
                  <>
                    <button
                      onClick={() => handleStartTest(test.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => handleCompleteTest(test.id)}
                      className="btn btn-outlined btn-sm"
                    >
                      Complete
                    </button>
                  </>
                )}
                
                {test.status !== 'running' && (
                  <button
                    onClick={() => handleDeleteTest(test.id, test.name)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Analytics Section */}
              {selectedTestId === test.id && (
                <div className="analytics-section">
                  <ABTestAnalytics testId={test.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <ABTestCreateModal
          articleId={articleId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchTests()
          }}
        />
      )}

      <style jsx>{`
        .ab-test-manager {
          padding: var(--spacing-6);
        }

        .ab-test-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-6);
          gap: var(--spacing-4);
        }

        .ab-test-header h2 {
          margin: 0 0 var(--spacing-2) 0;
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-8);
          background: var(--color-background);
          border: 2px dashed var(--color-border);
          border-radius: var(--border-radius);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: var(--spacing-4);
        }

        .tests-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
        }

        .test-card {
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
          padding: var(--spacing-5);
        }

        .test-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-4);
        }

        .test-header h3 {
          margin: 0 0 var(--spacing-1) 0;
        }

        .test-meta {
          display: flex;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-4);
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          flex-wrap: wrap;
        }

        .variants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-4);
        }

        .variant-card {
          background: var(--color-systemFill);
          border: 2px solid var(--color-border);
          border-radius: var(--border-radius);
          padding: var(--spacing-4);
        }

        .control-variant {
          border-color: var(--color-primary);
          background: rgba(var(--color-primary-rgb), 0.05);
        }

        .winning-variant {
          border-color: #28a745;
          background: rgba(40, 167, 69, 0.05);
        }

        .variant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-3);
        }

        .variant-header h4 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          font-size: var(--font-size-base);
        }

        .control-badge,
        .winner-badge {
          font-size: var(--font-size-xs);
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 500;
        }

        .control-badge {
          background: var(--color-primary);
          color: white;
        }

        .winner-badge {
          background: #28a745;
          color: white;
        }

        .traffic-percent {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-primary);
        }

        .variant-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-2);
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
          margin-bottom: 2px;
        }

        .stat-value {
          font-size: var(--font-size-base);
          font-weight: 600;
        }

        .significance-badge {
          margin-top: var(--spacing-3);
          padding: var(--spacing-2);
          background: #28a745;
          color: white;
          border-radius: var(--border-radius);
          font-size: var(--font-size-xs);
          text-align: center;
          font-weight: 500;
        }

        .test-actions {
          display: flex;
          gap: var(--spacing-2);
          padding-top: var(--spacing-4);
          border-top: 1px solid var(--color-border);
        }

        .analytics-section {
          margin-top: var(--spacing-4);
          padding-top: var(--spacing-4);
          border-top: 2px solid var(--color-border);
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
          border: 1px solid #dc3545;
        }

        .btn-danger:hover {
          background-color: #c82333;
          border-color: #bd2130;
        }

        @media (max-width: 768px) {
          .ab-test-header {
            flex-direction: column;
          }

          .variants-grid {
            grid-template-columns: 1fr;
          }

          .test-actions {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  )
}

// Traffic Percent Editor Component for inline editing
interface TrafficPercentEditorProps {
  testId: string
  variantId: string
  currentPercent: number
  isDisabled: boolean
  onUpdate: () => void
}

function TrafficPercentEditor({ testId, variantId, currentPercent, isDisabled, onUpdate }: TrafficPercentEditorProps) {
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
      // Get current test data to update all variants
      const testResponse = await fetch(`/api/ab-tests/${testId}`)
      if (!testResponse.ok) throw new Error('Failed to fetch test data')
      
      const testData = await testResponse.json()
      
      // Update the specific variant's percentage
      const updatedVariants = testData.variants.map((v: any) => 
        v.id === variantId 
          ? { ...v, trafficPercent: newPercent }
          : v
      )
      
      // Update the test with new variant percentages
      const response = await fetch(`/api/ab-tests/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants: updatedVariants }),
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

  if (isDisabled) {
    return <span className="traffic-percent disabled">{currentPercent}%</span>
  }

  if (isEditing) {
    return (
      <div className="traffic-editor">
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
          .traffic-editor {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .traffic-input {
            width: 60px;
            padding: 2px 6px;
            border: 1px solid var(--color-primary);
            border-radius: 3px;
            font-size: var(--font-size-lg);
            font-weight: 600;
            text-align: right;
          }
          
          .traffic-controls {
            display: flex;
            gap: 2px;
          }
          
          .save-btn, .cancel-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 12px;
            padding: 2px;
            border-radius: 2px;
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
          padding: 2px 4px;
          border-radius: 3px;
          transition: background-color 0.2s;
        }
        
        .traffic-percent.editable:hover {
          background: rgba(var(--color-primary-rgb), 0.1);
        }
        
        .traffic-percent.disabled {
          opacity: 0.6;
        }
      `}</style>
    </span>
  )
}
