import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ArticleForm from '@/components/ArticleForm'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) {
    redirect('/')
  }

  // Convert to simplified article format for the new form
  const articleForForm = {
    id: article.id,
    slug: article.slug,
    title: article.title,
    author: article.author ?? 'MartiCMS',
    canonicalUrl: article.canonicalUrl ?? undefined,
    published: article.published,
  }

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '1200px' }}>
        <ArticleForm article={articleForForm} />
      </div>
    </div>
  )
}

