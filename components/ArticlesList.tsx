'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Article {
  id: string
  slug: string
  title: string
  metaTitle?: string | null
  metaDescription?: string | null
  author: string
  featuredImage?: string | null
  contentType: string
  content: any
  facebookPixel?: string | null
  customScripts?: string | null
  keywords: string[]
  canonicalUrl?: string | null
  published: boolean
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

interface ArticlesListProps {
  initialArticles: Article[]
}

export default function ArticlesList({ initialArticles }: ArticlesListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  // Filter articles based on search term
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.metaDescription && article.metaDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
    article.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDelete = async (articleId: string, articleTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(articleId)
    
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete article')
      }

      // Remove the article from the local state
      setArticles(prev => prev.filter(article => article.id !== articleId))
    } catch (error: any) {
      alert(`Error deleting article: ${error.message}`)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <>
      {/* Header with Create Button and Search */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--spacing-6)',
        gap: 'var(--spacing-4)',
        flexWrap: 'wrap'
      }}>
        <Link href="/articles/new" className="btn btn-primary btn-large">
          + Create New Article
        </Link>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-4)',
          flex: '1',
          maxWidth: '400px'
        }}>
          <div style={{ position: 'relative', flex: '1' }}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-3) var(--spacing-4)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                fontSize: 'var(--font-size-base)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: 'var(--spacing-2)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: 'var(--spacing-1)',
                  borderRadius: 'var(--border-radius)',
                  fontSize: 'var(--font-size-lg)'
                }}
              >
                ×
              </button>
            )}
          </div>
          
          {searchTerm && (
            <span style={{ 
              color: 'var(--color-text-secondary)', 
              fontSize: 'var(--font-size-sm)',
              whiteSpace: 'nowrap'
            }}>
              {filteredArticles.length} of {articles.length}
            </span>
          )}
        </div>
      </div>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <div className="card" style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-8xl)', marginBottom: 'var(--spacing-4)' }}>
            {searchTerm ? '🔍' : '📝'}
          </div>
          <h2 className="text-2xl mb-3">
            {searchTerm ? 'No articles found' : 'No articles yet'}
          </h2>
          <p className="text-secondary mb-4">
            {searchTerm 
              ? `No articles match "${searchTerm}". Try a different search term.`
              : 'Get started by creating your first article'
            }
          </p>
          {searchTerm ? (
            <button 
              onClick={() => setSearchTerm('')}
              className="btn btn-outlined"
            >
              Clear Search
            </button>
          ) : (
            <Link href="/articles/new" className="btn btn-primary">
              Create Article
            </Link>
          )}
        </div>
      ) : (
        <div className="articles-list">
          {filteredArticles.map((article) => (
            <div key={article.id} className="article-row">
              <div className="article-content">
                <div className="article-main">
                  <div className="article-header">
                    <h3 className="article-title">{article.title}</h3>
                    {article.published && (
                      <span className="status-badge status-badge-success">Published</span>
                    )}
                  </div>
                  
                  <div className="article-meta">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>{article.contentType}</span>
                    <span>•</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>

                  {article.metaDescription && (
                    <p className="article-description">
                      {article.metaDescription.substring(0, 150)}
                      {article.metaDescription.length > 150 ? '...' : ''}
                    </p>
                  )}

                  {article.keywords.length > 0 && (
                    <div className="article-keywords">
                      {article.keywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                      {article.keywords.length > 3 && (
                        <span className="keyword-tag">
                          +{article.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="article-actions">
                <Link 
                  href={`/articles/${article.id}`} 
                  className="btn btn-primary btn-sm"
                >
                  Edit
                </Link>
                
                {article.published && article.slug && (
                  <a
                    href={`https://${process.env.NEXT_PUBLIC_ARTICLE_DOMAIN || 'daily.get.martideals.com'}/${article.slug}/index.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outlined btn-sm"
                  >
                    View →
                  </a>
                )}
                
                <button
                  onClick={() => handleDelete(article.id, article.title)}
                  disabled={isDeleting === article.id}
                  className="btn btn-danger btn-sm"
                  style={{ minWidth: '60px' }}
                >
                  {isDeleting === article.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .articles-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .article-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-4);
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
          transition: all 0.2s ease;
          gap: var(--spacing-4);
        }

        .article-row:hover {
          border-color: var(--color-primary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .article-content {
          flex: 1;
          min-width: 0;
        }

        .article-main {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .article-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          flex-wrap: wrap;
        }

        .article-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-text);
          margin: 0;
          line-height: 1.3;
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          flex-wrap: wrap;
        }

        .article-description {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          line-height: 1.4;
          margin: 0;
        }

        .article-keywords {
          display: flex;
          gap: var(--spacing-1);
          flex-wrap: wrap;
        }

        .keyword-tag {
          display: inline-block;
          padding: 2px 6px;
          background: var(--color-primary-light);
          color: var(--color-primary);
          border-radius: 3px;
          font-size: 11px;
          font-weight: 500;
        }

        .article-actions {
          display: flex;
          gap: var(--spacing-2);
          align-items: center;
          flex-shrink: 0;
        }

        .btn-sm {
          padding: var(--spacing-2) var(--spacing-3);
          font-size: var(--font-size-sm);
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
          border: 1px solid #dc3545;
        }

        .btn-danger:hover:not(:disabled) {
          background-color: #c82333;
          border-color: #bd2130;
        }

        .btn-danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .article-row {
            flex-direction: column;
            align-items: stretch;
            gap: var(--spacing-3);
          }

          .article-actions {
            justify-content: flex-end;
            border-top: 1px solid var(--color-border);
            padding-top: var(--spacing-3);
            margin-top: var(--spacing-1);
          }

          .article-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-2);
          }
        }
      `}</style>
    </>
  )
}
