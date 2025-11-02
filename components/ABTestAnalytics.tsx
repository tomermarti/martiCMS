'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
  testId: string
  testName: string
  status: string
  variants: VariantAnalytics[]
  totalViews: number
  totalConversions: number
  startDate?: Date
  endDate?: Date
}

interface VariantAnalytics {
  id: string
  name: string
  isControl: boolean
  trafficPercent: number
  views: number
  conversions: number
  conversionRate: number
  clicks: number
  clickThroughRate: number
  avgTimeOnPage: number
  bounceRate: number
  isSignificant: boolean
  pValue?: number
}

interface ABTestAnalyticsProps {
  testId: string
}

export default function ABTestAnalytics({ testId }: ABTestAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchAnalytics()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    setRefreshInterval(interval)
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [testId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/ab-tests/${testId}`)
      if (response.ok) {
        const test = await response.json()
        
        const totalViews = test.variants.reduce((sum: number, v: any) => sum + v.views, 0)
        const totalConversions = test.variants.reduce((sum: number, v: any) => sum + v.conversions, 0)
        
        setData({
          testId: test.id,
          testName: test.name,
          status: test.status,
          variants: test.variants,
          totalViews,
          totalConversions,
          startDate: test.startDate,
          endDate: test.endDate,
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWinner = () => {
    if (!data) return null
    
    const control = data.variants.find(v => v.isControl)
    if (!control) return null
    
    let winner = control
    let bestImprovement = 0
    
    for (const variant of data.variants) {
      if (variant.isControl || !variant.isSignificant) continue
      
      const improvement = ((variant.conversionRate - control.conversionRate) / control.conversionRate) * 100
      if (improvement > bestImprovement) {
        bestImprovement = improvement
        winner = variant
      }
    }
    
    return winner.id !== control.id ? { variant: winner, improvement: bestImprovement } : null
  }

  const getConfidenceLevel = (pValue?: number) => {
    if (!pValue) return 'N/A'
    const confidence = (1 - pValue) * 100
    return `${confidence.toFixed(1)}%`
  }

  if (loading) {
    return <div className="loading">Loading analytics...</div>
  }

  if (!data) {
    return <div className="error">Failed to load analytics</div>
  }

  const winner = getWinner()
  const control = data.variants.find(v => v.isControl)

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div>
          <h3>{data.testName}</h3>
          <p className="text-secondary">
            {data.status === 'running' ? 'Test is currently running' : `Test ${data.status}`}
          </p>
        </div>
        <button onClick={fetchAnalytics} className="btn btn-sm btn-outlined">
          🔄 Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-label">Total Views</div>
            <div className="stat-value">{data.totalViews.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Total Conversions</div>
            <div className="stat-value">{data.totalConversions.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Overall Conv. Rate</div>
            <div className="stat-value">
              {data.totalViews > 0 ? ((data.totalConversions / data.totalViews) * 100).toFixed(2) : '0.00'}%
            </div>
          </div>
        </div>
        
        {winner && (
          <div className="stat-card winner-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-label">Best Performer</div>
              <div className="stat-value">{winner.variant.name}</div>
              <div className="stat-improvement">+{winner.improvement.toFixed(1)}% vs control</div>
            </div>
          </div>
        )}
      </div>

      {/* Variants Comparison */}
      <div className="variants-comparison">
        <h4>Variant Performance</h4>
        
        <div className="comparison-table">
          <div className="table-header">
            <div className="col-variant">Variant</div>
            <div className="col-traffic">Traffic</div>
            <div className="col-views">Views</div>
            <div className="col-conversions">Conversions</div>
            <div className="col-rate">Conv. Rate</div>
            <div className="col-ctr">CTR</div>
            <div className="col-significance">Significance</div>
          </div>
          
          {data.variants.map((variant) => {
            const improvement = control && !variant.isControl
              ? ((variant.conversionRate - control.conversionRate) / control.conversionRate) * 100
              : 0
            
            return (
              <div
                key={variant.id}
                className={`table-row ${variant.isControl ? 'control-row' : ''} ${
                  winner && winner.variant.id === variant.id ? 'winner-row' : ''
                }`}
              >
                <div className="col-variant">
                  <strong>{variant.name}</strong>
                  {variant.isControl && <span className="badge">Control</span>}
                  {winner && winner.variant.id === variant.id && (
                    <span className="badge winner">Winner</span>
                  )}
                </div>
                
                <div className="col-traffic">
                  <div className="traffic-bar-container">
                    <div
                      className="traffic-bar"
                      style={{ width: `${variant.trafficPercent}%` }}
                    />
                    <span className="traffic-label">{variant.trafficPercent.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="col-views">{variant.views.toLocaleString()}</div>
                
                <div className="col-conversions">{variant.conversions.toLocaleString()}</div>
                
                <div className="col-rate">
                  <div className="rate-with-improvement">
                    <strong>{variant.conversionRate.toFixed(2)}%</strong>
                    {!variant.isControl && improvement !== 0 && (
                      <span className={`improvement ${improvement > 0 ? 'positive' : 'negative'}`}>
                        {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="col-ctr">{variant.clickThroughRate.toFixed(2)}%</div>
                
                <div className="col-significance">
                  {variant.isControl ? (
                    <span className="text-secondary">—</span>
                  ) : variant.isSignificant ? (
                    <span className="significant-badge">
                      ✓ {getConfidenceLevel(variant.pValue)}
                    </span>
                  ) : (
                    <span className="not-significant">Not yet</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Visual Chart */}
      <div className="visual-chart">
        <h4>Conversion Rate Comparison</h4>
        <div className="chart-bars">
          {data.variants.map((variant) => {
            const maxRate = Math.max(...data.variants.map(v => v.conversionRate))
            const barHeight = maxRate > 0 ? (variant.conversionRate / maxRate) * 100 : 0
            
            return (
              <div key={variant.id} className="chart-bar-container">
                <div className="chart-bar-wrapper">
                  <div
                    className={`chart-bar ${variant.isControl ? 'control-bar' : ''} ${
                      winner && winner.variant.id === variant.id ? 'winner-bar' : ''
                    }`}
                    style={{ height: `${barHeight}%` }}
                  >
                    <span className="bar-value">{variant.conversionRate.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="chart-label">
                  {variant.name}
                  {variant.isSignificant && !variant.isControl && <span className="sig-marker">✓</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .analytics-dashboard {
          padding: var(--spacing-5);
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-5);
        }

        .analytics-header h3 {
          margin: 0 0 var(--spacing-1) 0;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-6);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          padding: var(--spacing-4);
          background: var(--color-systemFill);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
        }

        .winner-card {
          border-color: #28a745;
          background: rgba(40, 167, 69, 0.1);
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin-bottom: 2px;
        }

        .stat-value {
          font-size: var(--font-size-xl);
          font-weight: 700;
        }

        .stat-improvement {
          font-size: var(--font-size-sm);
          color: #28a745;
          font-weight: 600;
        }

        .variants-comparison {
          margin-bottom: var(--spacing-6);
        }

        .variants-comparison h4 {
          margin: 0 0 var(--spacing-4) 0;
        }

        .comparison-table {
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1fr 1.2fr;
          gap: var(--spacing-2);
          padding: var(--spacing-3);
          align-items: center;
        }

        .table-header {
          background: var(--color-systemFill);
          font-weight: 600;
          font-size: var(--font-size-sm);
          border-bottom: 1px solid var(--color-border);
        }

        .table-row {
          border-bottom: 1px solid var(--color-border);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .control-row {
          background: rgba(var(--color-primary-rgb), 0.05);
        }

        .winner-row {
          background: rgba(40, 167, 69, 0.05);
        }

        .col-variant {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          flex-wrap: wrap;
        }

        .badge {
          font-size: var(--font-size-xs);
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 500;
        }

        .badge {
          background: var(--color-primary);
          color: white;
        }

        .badge.winner {
          background: #28a745;
        }

        .traffic-bar-container {
          position: relative;
          height: 24px;
          background: var(--color-border);
          border-radius: 4px;
          overflow: hidden;
        }

        .traffic-bar {
          height: 100%;
          background: var(--color-primary);
          transition: width 0.3s ease;
        }

        .traffic-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: var(--font-size-xs);
          font-weight: 600;
          color: var(--color-text);
        }

        .rate-with-improvement {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .improvement {
          font-size: var(--font-size-xs);
          font-weight: 600;
        }

        .improvement.positive {
          color: #28a745;
        }

        .improvement.negative {
          color: #dc3545;
        }

        .significant-badge {
          color: #28a745;
          font-weight: 600;
          font-size: var(--font-size-sm);
        }

        .not-significant {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }

        .visual-chart {
          margin-top: var(--spacing-6);
        }

        .visual-chart h4 {
          margin: 0 0 var(--spacing-4) 0;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          gap: var(--spacing-4);
          height: 300px;
          padding: var(--spacing-4);
          background: var(--color-systemFill);
          border-radius: var(--border-radius);
        }

        .chart-bar-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .chart-bar-wrapper {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .chart-bar {
          width: 80%;
          background: var(--color-primary);
          border-radius: 4px 4px 0 0;
          position: relative;
          transition: height 0.3s ease;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: var(--spacing-2);
        }

        .control-bar {
          background: #6c757d;
        }

        .winner-bar {
          background: #28a745;
        }

        .bar-value {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: white;
        }

        .chart-label {
          margin-top: var(--spacing-2);
          font-size: var(--font-size-sm);
          text-align: center;
          font-weight: 500;
        }

        .sig-marker {
          color: #28a745;
          margin-left: 4px;
        }

        @media (max-width: 1024px) {
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: var(--spacing-1);
          }

          .table-header {
            display: none;
          }

          .table-row > div::before {
            content: attr(data-label);
            font-weight: 600;
            margin-right: var(--spacing-2);
          }
        }

        @media (max-width: 768px) {
          .summary-stats {
            grid-template-columns: 1fr;
          }

          .chart-bars {
            height: 200px;
          }
        }
      `}</style>
    </div>
  )
}

