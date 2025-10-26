import { prisma } from '@/lib/prisma'
import ArticlesList from '@/components/ArticlesList'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  })

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
            <h1 className="campaign-builder-title">Martimart CMS</h1>
          </div>
        </div>

        <ArticlesList initialArticles={articles} />
      </div>
    </div>
  )
}