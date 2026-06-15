'use client'

import { useState, useEffect } from 'react'

export default function LayoutManager() {
  const [headerContent, setHeaderContent] = useState('')
  const [footerContent, setFooterContent] = useState('')
  const [cssContent, setCssContent] = useState('')
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState('')
  const [termsOfServiceContent, setTermsOfServiceContent] = useState('')
  const [doNotSellContent, setDoNotSellContent] = useState('')
  const [ccpaPrivacyRightsContent, setCcpaPrivacyRightsContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'css' | 'privacy-policy' | 'terms-of-service' | 'do-not-sell' | 'ccpa-privacy-rights'>('header')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setIsLoading(true)
      const [headerRes, footerRes, cssRes, privacyRes, termsRes, doNotSellRes, ccpaRes] = await Promise.all([
        fetch('/api/layout/header'),
        fetch('/api/layout/footer'),
        fetch('/api/layout/css'),
        fetch('/api/layout/privacy-policy'),
        fetch('/api/layout/terms-of-service'),
        fetch('/api/layout/do-not-sell'),
        fetch('/api/layout/ccpa-privacy-rights')
      ])
      
      const headerData = await headerRes.json()
      const footerData = await footerRes.json()
      const cssData = await cssRes.json()
      const privacyData = await privacyRes.json()
      const termsData = await termsRes.json()
      const doNotSellData = await doNotSellRes.json()
      const ccpaData = await ccpaRes.json()
      
      setHeaderContent(headerData.content || '')
      setFooterContent(footerData.content || '')
      setCssContent(cssData.content || '')
      setPrivacyPolicyContent(privacyData.content || '')
      setTermsOfServiceContent(termsData.content || '')
      setDoNotSellContent(doNotSellData.content || '')
      setCcpaPrivacyRightsContent(ccpaData.content || '')
    } catch (error) {
      console.error('Failed to load content:', error)
      alert('Failed to load layout content')
    } finally {
      setIsLoading(false)
    }
  }

  const saveContent = async (type: 'header' | 'footer' | 'css' | 'privacy-policy' | 'terms-of-service' | 'do-not-sell' | 'ccpa-privacy-rights') => {
    try {
      setIsSaving(true)
      const content = type === 'header' ? headerContent : 
                    type === 'footer' ? footerContent : 
                    type === 'css' ? cssContent :
                    type === 'privacy-policy' ? privacyPolicyContent :
                    type === 'terms-of-service' ? termsOfServiceContent :
                    type === 'do-not-sell' ? doNotSellContent :
                    ccpaPrivacyRightsContent
      
      const response = await fetch(`/api/layout/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save ${type}`)
      }

      const data = await response.json()
      const displayName = type === 'css' ? 'CSS' : 
                         type === 'privacy-policy' ? 'Privacy Policy' :
                         type === 'terms-of-service' ? 'Terms of Service' :
                         type === 'do-not-sell' ? 'Do Not Sell Page' :
                         type === 'ccpa-privacy-rights' ? 'CCPA Privacy Rights' :
                         type.charAt(0).toUpperCase() + type.slice(1)
      alert(`${displayName} saved successfully!`)
    } catch (error) {
      console.error(`Failed to save ${type}:`, error)
      const displayName = type === 'css' ? 'CSS' : 
                         type === 'privacy-policy' ? 'Privacy Policy' :
                         type === 'terms-of-service' ? 'Terms of Service' :
                         type === 'do-not-sell' ? 'Do Not Sell Page' :
                         type === 'ccpa-privacy-rights' ? 'CCPA Privacy Rights' :
                         type
      alert(`Failed to save ${displayName}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="container" style={{ maxWidth: '1400px' }}>
          <div className="loading-state">
            <p>Loading layout manager...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div className="campaign-builder-header">
          <div className="header-with-logo">
            <img 
              src="/marti_logo.png" 
              alt="Marti Logo" 
              className="header-logo"
            />
            <h1 className="campaign-builder-title">Layout Manager</h1>
          </div>
          <p className="subtitle">Manage dynamic headers, footers, and CSS for all articles</p>
        </div>

        <div className="layout-manager">
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'header' ? 'active' : ''}`}
              onClick={() => setActiveTab('header')}
            >
              Header
            </button>
            <button 
              className={`tab-button ${activeTab === 'footer' ? 'active' : ''}`}
              onClick={() => setActiveTab('footer')}
            >
              Footer
            </button>
            <button 
              className={`tab-button ${activeTab === 'css' ? 'active' : ''}`}
              onClick={() => setActiveTab('css')}
            >
              CSS
            </button>
            <button 
              className={`tab-button ${activeTab === 'privacy-policy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy-policy')}
            >
              Privacy Policy
            </button>
            <button 
              className={`tab-button ${activeTab === 'terms-of-service' ? 'active' : ''}`}
              onClick={() => setActiveTab('terms-of-service')}
            >
              Terms of Service
            </button>
            <button 
              className={`tab-button ${activeTab === 'do-not-sell' ? 'active' : ''}`}
              onClick={() => setActiveTab('do-not-sell')}
            >
              Do Not Sell
            </button>
            <button 
              className={`tab-button ${activeTab === 'ccpa-privacy-rights' ? 'active' : ''}`}
              onClick={() => setActiveTab('ccpa-privacy-rights')}
            >
              CCPA Notice
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'header' && (
              <div className="editor-section">
                <div className="editor-header">
                  <h3>Header HTML</h3>
                  <p>This header will be dynamically loaded on all articles</p>
                </div>
                <textarea
                  value={headerContent}
                  onChange={(e) => setHeaderContent(e.target.value)}
                  className="code-editor"
                  rows={20}
                  placeholder="Enter header HTML..."
                />
                <div className="editor-actions">
                  <button 
                    onClick={() => saveContent('header')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? 'Saving...' : 'Save Header'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'footer' && (
              <div className="editor-section">
                <div className="editor-header">
                  <h3>Footer HTML</h3>
                  <p>This footer will be dynamically loaded on all articles</p>
                </div>
                <textarea
                  value={footerContent}
                  onChange={(e) => setFooterContent(e.target.value)}
                  className="code-editor"
                  rows={20}
                  placeholder="Enter footer HTML..."
                />
                <div className="editor-actions">
                  <button 
                    onClick={() => saveContent('footer')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? 'Saving...' : 'Save Footer'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'css' && (
              <div className="editor-section">
                <div className="editor-header">
                  <h3>CSS Styles</h3>
                  <p>This CSS will be uploaded to CDN and used by all articles</p>
                </div>
                <textarea
                  value={cssContent}
                  onChange={(e) => setCssContent(e.target.value)}
                  className="code-editor css-editor"
                  rows={25}
                  placeholder="Enter CSS styles..."
                />
                <div className="editor-actions">
                  <button 
                    onClick={() => saveContent('css')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? 'Saving...' : 'Save CSS'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy-policy' && (
              <div className="editor-section">
                <div className="editor-header">
                  <h3>Privacy Policy</h3>
                  <p>This privacy policy will be uploaded to CDN and accessible via footer links</p>
                </div>
                <textarea
                  value={privacyPolicyContent}
                  onChange={(e) => setPrivacyPolicyContent(e.target.value)}
                  className="code-editor"
                  rows={25}
                  placeholder="Enter privacy policy HTML..."
                />
                <div className="editor-actions">
                  <button 
                    onClick={() => saveContent('privacy-policy')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? 'Saving...' : 'Save Privacy Policy'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'terms-of-service' && (
              <div className="editor-section">
                <div className="editor-header">
                  <h3>Terms of Service</h3>
                  <p>This terms of service will be uploaded to CDN and accessible via footer links</p>
                </div>
                <textarea
                  value={termsOfServiceContent}
                  onChange={(e) => setTermsOfServiceContent(e.target.value)}
                  className="code-editor"
                  rows={25}
                  placeholder="Enter terms of service HTML..."
                />
                <div className="editor-actions">
                  <button 
                    onClick={() => saveContent('terms-of-service')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? 'Saving...' : 'Save Terms of Service'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'do-not-sell' && (
              <div className="editor-section">
                <div className="editor-header">
                  <h3>Do Not Sell My Personal Information</h3>
                  <p>This CCPA opt-out page will be uploaded to CDN and accessible via footer links</p>
                </div>
                <textarea
                  value={doNotSellContent}
                  onChange={(e) => setDoNotSellContent(e.target.value)}
                  className="code-editor"
                  rows={25}
                  placeholder="Enter do not sell page HTML..."
                />
                <div className="editor-actions">
                  <button 
                    onClick={() => saveContent('do-not-sell')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? 'Saving...' : 'Save Do Not Sell Page'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'ccpa-privacy-rights' && (
              <div className="editor-section">
                <div className="editor-header">
                  <h3>CCPA Privacy Rights</h3>
                  <p>This CCPA notice will be uploaded to CDN and accessible via footer links</p>
                </div>
                <textarea
                  value={ccpaPrivacyRightsContent}
                  onChange={(e) => setCcpaPrivacyRightsContent(e.target.value)}
                  className="code-editor"
                  rows={25}
                  placeholder="Enter CCPA privacy rights HTML..."
                />
                <div className="editor-actions">
                  <button 
                    onClick={() => saveContent('ccpa-privacy-rights')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? 'Saving...' : 'Save CCPA Privacy Rights'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="info-section">
            <h4>How it works:</h4>
            <ul>
              <li>✅ Headers, footers, CSS, and privacy pages are stored on your CDN</li>
              <li>✅ All articles dynamically fetch the latest version</li>
              <li>✅ Changes apply to all existing and new articles automatically</li>
              <li>✅ Privacy files are automatically uploaded to CDN when saved</li>
              <li>✅ Footer links point directly to CDN URLs for privacy pages</li>
              <li>✅ Fallback content is provided if CDN is unavailable</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .layout-manager {
          background: var(--color-systemBackground);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-6);
          margin-top: var(--spacing-6);
        }

        .tab-navigation {
          display: flex;
          gap: var(--spacing-2);
          margin-bottom: var(--spacing-6);
          border-bottom: 1px solid var(--color-separator);
        }

        .tab-button {
          padding: var(--spacing-3) var(--spacing-4);
          border: none;
          background: transparent;
          color: var(--color-secondaryLabel);
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          color: var(--color-label);
        }

        .tab-button.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .editor-section {
          margin-bottom: var(--spacing-6);
        }

        .editor-header {
          margin-bottom: var(--spacing-4);
        }

        .editor-header h3 {
          margin: 0 0 var(--spacing-2) 0;
          color: var(--color-label);
        }

        .editor-header p {
          margin: 0;
          color: var(--color-secondaryLabel);
          font-size: var(--font-size-sm);
        }

        .code-editor {
          width: 100%;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
          padding: var(--spacing-4);
          border: 1px solid var(--color-separator);
          border-radius: var(--border-radius);
          background: var(--color-systemGroupedBackground);
          color: var(--color-label);
          resize: vertical;
          min-height: 400px;
        }

        .code-editor:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primaryTranslucent);
        }

        .css-editor {
          min-height: 500px;
          font-size: 13px;
          tab-size: 2;
        }

        .editor-actions {
          margin-top: var(--spacing-4);
          display: flex;
          gap: var(--spacing-3);
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
          border: none;
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--border-radius);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--color-primaryHover);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .info-section {
          background: var(--color-systemGroupedBackground);
          padding: var(--spacing-4);
          border-radius: var(--border-radius);
          margin-top: var(--spacing-6);
        }

        .info-section h4 {
          margin: 0 0 var(--spacing-3) 0;
          color: var(--color-label);
        }

        .info-section ul {
          margin: 0;
          padding-left: var(--spacing-4);
          color: var(--color-secondaryLabel);
        }

        .info-section li {
          margin-bottom: var(--spacing-2);
        }

        .loading-state {
          text-align: center;
          padding: var(--spacing-8);
          color: var(--color-secondaryLabel);
        }

        .subtitle {
          color: var(--color-secondaryLabel);
          margin: var(--spacing-2) 0 0 0;
          font-size: var(--font-size-lg);
        }
      `}</style>
    </div>
  )
}
