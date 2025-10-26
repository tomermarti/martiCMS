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

  // Convert null values to undefined for compatibility with ArticleForm
  const articleForForm = {
    ...article,
    metaTitle: article.metaTitle ?? undefined,
    metaDescription: article.metaDescription ?? undefined,
    featuredImage: article.featuredImage ?? undefined,
    facebookPixel: article.facebookPixel ?? undefined,
    customScripts: article.customScripts ?? undefined,
    canonicalUrl: article.canonicalUrl ?? undefined,
  }

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '1200px' }}>
        <ArticleForm article={articleForForm} />
      </div>
    </div>
  )
}

