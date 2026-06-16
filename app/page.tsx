import { prisma } from '@/lib/prisma'
import HomePageContent, { ArticleCard } from './HomePageContent'

const ACCENTS = ['aqua', 'blue', 'charcoal', 'sand', 'aqua', 'blue'] as const

const HOMEPAGE_SLUGS = [
  'pool-cleaner',
  'air-purifiers',
  'smart-home',
  'lawn-garden',
  'pressure-washers',
  'water-filtering',
] as const

const CATEGORY_BY_SLUG: Record<(typeof HOMEPAGE_SLUGS)[number], string> = {
  'pool-cleaner': 'Pools',
  'air-purifiers': 'Air Purifiers',
  'smart-home': 'Smart Home',
  'lawn-garden': 'Lawn & Garden',
  'pressure-washers': 'Pressure Washers',
  'water-filtering': 'Water Filtering',
}

async function getHomepageArticles(): Promise<ArticleCard[]> {
  try {
    const rows = await prisma.article.findMany({
      where: {
        published: true,
        slug: { in: [...HOMEPAGE_SLUGS] },
      },
      select: {
        slug: true,
        title: true,
        metaDescription: true,
        featuredImage: true,
      },
    })

    const bySlug = new Map(rows.map((row) => [row.slug, row]))

    return HOMEPAGE_SLUGS.flatMap((slug, index) => {
      const article = bySlug.get(slug)
      if (!article) return []

      const category = CATEGORY_BY_SLUG[slug]

      return [{
        slug: article.slug,
        category,
        accent: ACCENTS[index % ACCENTS.length],
        imageLabel: category,
        title: article.title,
        summary: article.metaDescription ?? '',
        readTime: '',
        isReal: true,
        featuredImage: article.featuredImage ?? undefined,
      }]
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const articles = await getHomepageArticles()
  return <HomePageContent articles={articles} />
}
