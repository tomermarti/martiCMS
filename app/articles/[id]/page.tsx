import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ArticleForm from '@/components/ArticleForm'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  })

  if (!article) {
    redirect('/')
  }

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '1200px' }}>
        <ArticleForm article={article} />
      </div>
    </div>
  )
}

