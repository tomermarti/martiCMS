import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PublicArticleRenderer from '@/components/PublicArticleRenderer'

export const dynamic = 'force-dynamic'

interface PublicArticlePageProps {
  params: Promise<{ slug: string }>
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderTemplate(htmlContent: string, data: Record<string, unknown>) {
  return Object.entries(data).reduce((html, [key, value]) => {
    const placeholder = new RegExp(`{{${escapeRegExp(key)}}}`, 'g')
    return html.replace(placeholder, value == null ? '' : String(value))
  }, htmlContent)
}

async function getPublishedArticle(slug: string) {
  return prisma.article.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      variants: {
        where: { isActive: true },
        include: {
          template: true,
        },
        orderBy: [
          { isControl: 'desc' },
          { createdAt: 'asc' },
        ],
      },
    },
  })
}

export async function generateMetadata({ params }: PublicArticlePageProps) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)

  if (!article) {
    return {}
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || undefined,
    alternates: article.canonicalUrl ? { canonical: article.canonicalUrl } : undefined,
    openGraph: {
      type: 'article',
      title: article.metaTitle || article.title,
      description: article.metaDescription || undefined,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title,
      description: article.metaDescription || undefined,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
  }
}

export default async function PublicArticlePage({ params }: PublicArticlePageProps) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)

  if (!article) {
    notFound()
  }

  const variant = article.variants[0]
  const template = variant?.template
  const html = template
    ? renderTemplate(template.htmlContent, (variant.data || {}) as Record<string, unknown>)
    : `<article class="public-article-fallback"><h1>${article.title}</h1></article>`

  return (
    <Suspense fallback={null}>
      <PublicArticleRenderer
        html={html}
        article={{
          id: article.id,
          slug: article.slug,
          title: article.title,
          author: article.author,
          facebookPixel: article.facebookPixel,
        }}
      />
    </Suspense>
  )
}
