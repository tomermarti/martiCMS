#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TEMPLATE_NAME = 'MartiDeals Category Review Guide'
const POOL_CLEANER_SLUG = 'pool-cleaner'
const POOL_CLEANER_HERO =
  'https://deals.nyc3.cdn.digitaloceanspaces.com/pool-cleaner/images/pool-cleaner-hero-before-after-20260616.jpg'

const HOMEPAGE_ARTICLES = [
  {
    slug: 'air-purifiers',
    category: 'Air Purifiers',
    title: 'Best Air Purifiers for Allergies, Pets, and Smaller Rooms',
    metaDescription:
      'Compare HEPA air purifiers by room size, filter cost, noise level, and pet-hair performance before you buy.',
    keywords: ['air purifier', 'HEPA filter', 'allergies', 'pet dander', 'indoor air quality'],
    heroImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=82',
    heroAlt: 'Clean modern living room with bright natural light',
    intro:
      'A good air purifier can make bedrooms, nurseries, home offices, and pet areas feel cleaner without adding another complicated appliance to the room. The key is matching the purifier to the space, the filter type, and the ongoing replacement cost.',
    quickTake:
      'Choose a true HEPA purifier for allergy and pet dander control, then size it for the room where you spend the most time.',
    sections: [
      {
        title: 'Start With Room Size, Not Brand Name',
        body:
          'The most common mistake is buying a purifier that is too small for the room. Look for CADR ratings and recommended square footage, then leave some headroom if the space has pets, smoke, cooking odors, or high pollen exposure.',
        image:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=82',
        alt: 'Clean living room with natural light',
      },
      {
        title: 'Filter Cost Matters Over Time',
        body:
          'Replacement filters can turn a cheap purifier into an expensive one. Before buying, check how often filters need replacement, whether pre-filters are washable, and how easy it is to find genuine replacements.',
        image:
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&auto=format&fit=crop&q=82',
        alt: 'Clean home products arranged on a shelf',
      },
      {
        title: 'Noise Level Decides Daily Use',
        body:
          'A purifier only helps if you actually run it. For bedrooms and offices, compare decibel ratings on low and sleep modes, not only the maximum fan setting.',
        image:
          'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&auto=format&fit=crop&q=82',
        alt: 'Quiet bedroom interior',
      },
    ],
    comparison: [
      ['Best for allergies', 'True HEPA, sealed body, strong CADR'],
      ['Best for pets', 'Washable pre-filter, odor carbon layer, easy cleaning'],
      ['Best for bedrooms', 'Quiet sleep mode, dim lights, compact size'],
    ],
    checklist: ['True HEPA filtration', 'Room-size CADR match', 'Replacement filter cost', 'Noise level on low mode'],
    finalTake:
      'For most homes, the best air purifier is not the biggest one. It is the model you can run daily in the room that needs it most, with filter costs you are comfortable replacing on schedule.',
  },
  {
    slug: 'smart-home',
    category: 'Smart Home',
    title: 'Smart Home Devices Worth Adding in 2026',
    metaDescription:
      'A practical guide to smart speakers, lighting, thermostats, and security gear that actually simplify daily routines.',
    keywords: ['smart home', 'home automation', 'smart thermostat', 'smart lighting', 'smart plugs'],
    heroImage:
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=1400&auto=format&fit=crop&q=82',
    heroAlt: 'Smart home devices on a kitchen counter',
    intro:
      'Smart home gear is best when it removes friction from daily routines. The right setup can automate lighting, reduce energy waste, improve security, and make common tasks easier without forcing every family member to learn a new app.',
    quickTake:
      'Start with one ecosystem, solve one daily problem, and expand only when devices work reliably together.',
    sections: [
      {
        title: 'Pick an Ecosystem First',
        body:
          'Smart devices get frustrating when they live in separate apps. Choose the ecosystem your household already uses, then confirm compatibility before adding cameras, bulbs, locks, sensors, and thermostats.',
        image:
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1000&auto=format&fit=crop&q=82',
        alt: 'Modern connected home interface concept',
      },
      {
        title: 'Automations Should Be Simple',
        body:
          'Good automations are easy to explain: lights turn on at sunset, the thermostat lowers when nobody is home, and doors lock at night. Avoid setups that require constant manual fixing.',
        image:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&auto=format&fit=crop&q=82',
        alt: 'Modern smart home controls',
      },
      {
        title: 'Privacy Settings Are Part of the Purchase',
        body:
          'Cameras, microphones, and location-based routines need clear privacy controls. Review local storage, cloud subscriptions, household access, and notification settings before installing devices.',
        image:
          'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1000&auto=format&fit=crop&q=82',
        alt: 'Security and privacy technology workspace',
      },
    ],
    comparison: [
      ['Best first device', 'Smart speaker or hub for central control'],
      ['Best energy saver', 'Smart thermostat with scheduling and occupancy sensing'],
      ['Best simple upgrade', 'Smart plugs for lamps, fans, and small appliances'],
    ],
    checklist: ['Ecosystem compatibility', 'Matter or hub support', 'Privacy controls', 'Household sharing'],
    finalTake:
      'The best smart home setup is the one your household keeps using. Build from dependable basics, then add devices that solve a clear problem.',
  },
  {
    slug: 'lawn-garden',
    category: 'Lawn & Garden',
    title: 'Lawn and Garden Tools That Save Time Every Season',
    metaDescription:
      'From mowers to trimmers and sprinklers, compare lawn and garden gear by yard size, maintenance, and seasonal workload.',
    keywords: ['lawn mower', 'garden tools', 'yard care', 'outdoor power equipment', 'sprinkler'],
    heroImage:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&auto=format&fit=crop&q=82',
    heroAlt: 'Garden tools and plants in a backyard',
    intro:
      'Lawn and garden tools should match the size of your yard and the way you actually maintain it. A compact townhouse patio needs different gear than a half-acre lawn with trees, beds, leaves, and seasonal cleanup.',
    quickTake:
      'Buy for your yard size first: runtime, storage, weight, and maintenance are more important than raw power alone.',
    sections: [
      {
        title: 'Cordless Tools Are Now Practical for Most Homes',
        body:
          'Battery mowers, trimmers, and blowers are quieter and easier to maintain than gas tools. Check battery platform compatibility so one charger can support several tools.',
        image:
          'https://images.unsplash.com/photo-1599685315640-7e5f8ff87f90?w=1000&auto=format&fit=crop&q=82',
        alt: 'Green lawn with garden care tools',
      },
      {
        title: 'Storage Space Should Guide What You Buy',
        body:
          'Foldable handles, wall mounts, and compact battery storage matter if your garage or shed is tight. A tool that is hard to store often becomes a tool you avoid using.',
        image:
          'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=1000&auto=format&fit=crop&q=82',
        alt: 'Garden plants and outdoor tools',
      },
      {
        title: 'Watering Systems Can Save More Than Time',
        body:
          'Smart timers and drip irrigation help prevent overwatering and dry patches. They are especially useful for garden beds, raised planters, and hot-weather schedules.',
        image:
          'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1000&auto=format&fit=crop&q=82',
        alt: 'Garden watering and plants',
      },
    ],
    comparison: [
      ['Small yards', 'Cordless mower, string trimmer, compact blower'],
      ['Garden beds', 'Drip irrigation, hand tools, kneeling pad'],
      ['Seasonal cleanup', 'Leaf blower, pruning saw, storage bins'],
    ],
    checklist: ['Yard size', 'Battery runtime', 'Tool weight', 'Storage requirements'],
    finalTake:
      'The right lawn setup is not the most powerful collection. It is the set of tools that makes weekly maintenance quick enough to stay consistent.',
  },
  {
    slug: 'pressure-washers',
    category: 'Pressure Washers',
    title: 'Best Pressure Washers for Driveways, Decks, and Siding',
    metaDescription:
      'Electric vs gas pressure washers explained by PSI, GPM, portability, and the surfaces you plan to clean.',
    keywords: ['pressure washer', 'power washer', 'driveway cleaning', 'deck cleaning', 'siding cleaning'],
    heroImage:
      'https://images.unsplash.com/photo-1640653488366-f7771cd7292d?w=1400&auto=format&fit=crop&q=82',
    heroAlt: 'Person using a pressure washer on a patio',
    intro:
      'Pressure washers can make old surfaces look new, but the wrong machine can waste time or damage wood, paint, and siding. Match the washer to the surfaces you clean most often.',
    quickTake:
      'Electric models are easier for light home jobs; gas models make sense for large concrete, long sessions, and frequent heavy cleaning.',
    sections: [
      {
        title: 'PSI Is Only Half the Story',
        body:
          'PSI tells you pressure, but GPM tells you water flow. Together they determine cleaning speed. A balanced machine cleans better than one with a big PSI number and weak flow.',
        image:
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&auto=format&fit=crop&q=82',
        alt: 'Clean driveway and home exterior',
      },
      {
        title: 'Nozzle Choice Protects Surfaces',
        body:
          'Wide-angle nozzles are safer for siding and cars, while tighter nozzles handle stubborn concrete stains. Turbo nozzles can help, but they require care on softer materials.',
        image:
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&auto=format&fit=crop&q=82',
        alt: 'Home cleaning tools and exterior maintenance',
      },
      {
        title: 'Portability Matters More Than It Seems',
        body:
          'Hose length, wheel quality, cord storage, and weight decide whether the washer is easy to use around a whole property. For multi-surface jobs, setup time matters.',
        image:
          'https://images.unsplash.com/photo-1596651254769-712e695d687a?w=1000&auto=format&fit=crop&q=82',
        alt: 'Outdoor home maintenance equipment',
      },
    ],
    comparison: [
      ['Cars and patio furniture', 'Electric washer, lower PSI, wide nozzle'],
      ['Decks and siding', 'Moderate PSI, detergent tank, careful nozzle use'],
      ['Concrete and driveways', 'Higher GPM, surface cleaner attachment'],
    ],
    checklist: ['PSI and GPM', 'Nozzle set', 'Hose length', 'Weight and wheel quality'],
    finalTake:
      'For most homeowners, the best pressure washer is easy to move, easy to store, and powerful enough for the surfaces cleaned most often.',
  },
  {
    slug: 'water-filtering',
    category: 'Water Filtering',
    title: 'Water Filter Buying Guide for Better Drinking Water',
    metaDescription:
      'Compare pitcher filters, under-sink systems, and whole-home options by filtration type, replacement cost, and installation.',
    keywords: ['water filter', 'drinking water', 'reverse osmosis', 'under sink filter', 'whole home filter'],
    heroImage:
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1400&auto=format&fit=crop&q=82',
    heroAlt: 'Clear drinking water poured into a glass',
    intro:
      'Water filters are not one-size-fits-all. Taste, chlorine, sediment, lead, hard minerals, and broader contaminant concerns each point to a different filtration approach.',
    quickTake:
      'Start with what you want removed, then compare filter certification, flow rate, replacement schedule, and installation difficulty.',
    sections: [
      {
        title: 'Pitcher Filters Are Simple, but Limited',
        body:
          'Pitchers are affordable and easy to use for improving taste and odor. They are best for renters or small households, but they have slower flow and frequent cartridge changes.',
        image:
          'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1000&auto=format&fit=crop&q=82',
        alt: 'Glass of water on a table',
      },
      {
        title: 'Under-Sink Systems Offer Daily Convenience',
        body:
          'Under-sink filters keep counters clear and deliver filtered water at the tap. They cost more upfront but are easier to live with for families that drink filtered water daily.',
        image:
          'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1000&auto=format&fit=crop&q=82',
        alt: 'Modern kitchen sink and faucet',
      },
      {
        title: 'Whole-Home Filters Solve Broader Problems',
        body:
          'Whole-home systems can help with sediment, chlorine, and plumbing-wide water concerns. They require more planning but protect showers, appliances, and every tap.',
        image:
          'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1000&auto=format&fit=crop&q=82',
        alt: 'Clean modern home interior with kitchen',
      },
    ],
    comparison: [
      ['Best for taste', 'Pitcher or faucet filter'],
      ['Best for daily drinking', 'Under-sink carbon or RO system'],
      ['Best for entire home', 'Whole-home sediment and carbon filtration'],
    ],
    checklist: ['Certified contaminant reduction', 'Filter replacement cost', 'Flow rate', 'Install complexity'],
    finalTake:
      'The best water filter starts with your actual water concern. Test first when possible, then choose the simplest system that handles that concern reliably.',
  },
]

const ARTICLE_TEMPLATE = `
<article class="md-guide">
  <style>
    .md-guide{--navy:#1A2644;--orange:#E8470A;--cream:#FFF8F0;--muted:rgba(26,38,68,.66);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:var(--navy);background:linear-gradient(180deg,#fff8f0 0,#fff 42%);min-height:100vh}
    .md-guide *{box-sizing:border-box}.md-guide a{color:inherit}.md-wrap{max-width:1120px;margin:0 auto;padding:0 24px}.md-hero{padding:54px 0 32px}.md-kicker{color:var(--orange);font-size:12px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;margin:0 0 12px}.md-title{font-size:clamp(2.5rem,6vw,5rem);line-height:.96;letter-spacing:-.06em;margin:0 0 18px;font-weight:900;max-width:900px}.md-intro{font-size:clamp(1.05rem,2vw,1.28rem);line-height:1.65;color:var(--muted);max-width:760px;margin:0 0 26px}.md-hero-img{width:100%;height:min(56vw,520px);object-fit:cover;border-radius:30px;box-shadow:0 24px 70px rgba(26,38,68,.14);display:block}.md-meta{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0 0}.md-pill{border:1px solid rgba(26,38,68,.12);background:#fff;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:800;color:var(--navy)}
    .md-quick{margin:34px 0;background:var(--navy);border-radius:28px;padding:34px;color:#fff;display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:start}.md-quick b{color:#fff;font-size:13px;letter-spacing:.14em;text-transform:uppercase}.md-quick p{margin:0;font-size:22px;line-height:1.35;font-weight:850;letter-spacing:-.02em}
    .md-section{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,42%);gap:34px;align-items:center;padding:38px 0;border-bottom:1px solid rgba(26,38,68,.09)}.md-section:nth-child(even){grid-template-columns:minmax(280px,42%) minmax(0,1fr)}.md-section:nth-child(even) .md-section-copy{order:2}.md-section:nth-child(even) .md-section-img{order:1}.md-section h2{font-size:clamp(1.8rem,3vw,2.6rem);letter-spacing:-.045em;line-height:1.03;margin:0 0 14px;font-weight:900}.md-section p{margin:0;color:var(--muted);font-size:17px;line-height:1.72}.md-section-img{width:100%;height:300px;object-fit:cover;border-radius:24px;box-shadow:0 18px 45px rgba(26,38,68,.1)}
    .md-compare{padding:46px 0}.md-heading{font-size:clamp(2rem,4vw,3rem);line-height:1;letter-spacing:-.05em;font-weight:900;margin:0 0 22px}.md-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.md-card{background:#fff;border:1px solid rgba(26,38,68,.1);border-radius:22px;padding:24px;box-shadow:0 14px 36px rgba(26,38,68,.07)}.md-card strong{display:block;color:var(--orange);font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px}.md-card p{margin:0;color:var(--muted);line-height:1.55}
    .md-check{background:#fff;border:1px solid rgba(26,38,68,.1);border-radius:28px;padding:32px;margin:0 0 44px;box-shadow:0 16px 42px rgba(26,38,68,.08)}.md-check ul{list-style:none;margin:18px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.md-check li{background:#fff8f0;border:1px solid rgba(232,71,10,.12);border-radius:16px;padding:14px 16px;font-weight:800}.md-final{background:radial-gradient(circle at 92% 16%,rgba(232,71,10,.32),transparent 16rem),var(--navy);color:#fff;border-radius:30px;padding:38px;margin:0 0 56px}.md-final h2{margin:0 0 12px;font-size:clamp(1.8rem,3vw,2.6rem);letter-spacing:-.04em;line-height:1}.md-final p{margin:0;color:rgba(255,255,255,.78);font-size:18px;line-height:1.65}
    @media(max-width:760px){.md-wrap{padding:0 16px}.md-hero{padding-top:38px}.md-quick{grid-template-columns:1fr;padding:26px}.md-section,.md-section:nth-child(even){grid-template-columns:1fr}.md-section:nth-child(even) .md-section-copy,.md-section:nth-child(even) .md-section-img{order:initial}.md-grid,.md-check ul{grid-template-columns:1fr}.md-section-img{height:240px}}
  </style>
  <div class="md-wrap">
    <header class="md-hero">
      <p class="md-kicker">{{category}}</p>
      <h1 class="md-title">{{headline}}</h1>
      <p class="md-intro">{{intro}}</p>
      <img class="md-hero-img" src="{{heroImage}}" alt="{{heroAlt}}" />
      <div class="md-meta"><span class="md-pill">Updated {{lastUpdated}}</span><span class="md-pill">MartiDeals Review Guide</span></div>
    </header>
    <section class="md-quick"><b>Quick Take</b><p>{{quickTake}}</p></section>
    {{sectionsHtml}}
    <section class="md-compare"><h2 class="md-heading">What to Compare Before Buying</h2><div class="md-grid">{{comparisonHtml}}</div></section>
    <section class="md-check"><h2 class="md-heading">Buyer Checklist</h2><ul>{{checklistHtml}}</ul></section>
    <section class="md-final"><h2>Bottom Line</h2><p>{{finalTake}}</p></section>
  </div>
</article>`

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildSectionsHtml(sections) {
  return sections
    .map(
      (section) => `
        <section class="md-section">
          <div class="md-section-copy">
            <h2>${escapeHtml(section.title)}</h2>
            <p>${escapeHtml(section.body)}</p>
          </div>
          <img class="md-section-img" src="${escapeHtml(section.image)}" alt="${escapeHtml(section.alt)}" />
        </section>`,
    )
    .join('')
}

function buildComparisonHtml(items) {
  return items
    .map(
      ([label, text]) => `
        <article class="md-card">
          <strong>${escapeHtml(label)}</strong>
          <p>${escapeHtml(text)}</p>
        </article>`,
    )
    .join('')
}

function buildChecklistHtml(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
}

function buildVariantData(article) {
  return {
    category: article.category,
    headline: article.title,
    intro: article.intro,
    heroImage: article.heroImage,
    heroAlt: article.heroAlt,
    lastUpdated: 'Jun 16, 2026',
    quickTake: article.quickTake,
    sectionsHtml: buildSectionsHtml(article.sections),
    comparisonHtml: buildComparisonHtml(article.comparison),
    checklistHtml: buildChecklistHtml(article.checklist),
    finalTake: article.finalTake,
  }
}

async function upsertTemplate() {
  return prisma.template.upsert({
    where: { id: (await prisma.template.findFirst({ where: { name: TEMPLATE_NAME } }))?.id ?? 'missing-template-id' },
    update: {
      description: 'Editorial MartiDeals review guide with hero image, buying sections, comparison cards, and checklist.',
      category: 'blog',
      placeholders: [
        'category',
        'headline',
        'intro',
        'heroImage',
        'heroAlt',
        'lastUpdated',
        'quickTake',
        'sectionsHtml',
        'comparisonHtml',
        'checklistHtml',
        'finalTake',
      ],
      htmlContent: ARTICLE_TEMPLATE,
      isActive: true,
    },
    create: {
      name: TEMPLATE_NAME,
      description: 'Editorial MartiDeals review guide with hero image, buying sections, comparison cards, and checklist.',
      category: 'blog',
      placeholders: [
        'category',
        'headline',
        'intro',
        'heroImage',
        'heroAlt',
        'lastUpdated',
        'quickTake',
        'sectionsHtml',
        'comparisonHtml',
        'checklistHtml',
        'finalTake',
      ],
      htmlContent: ARTICLE_TEMPLATE,
      isActive: true,
    },
  })
}

async function seedHomepageArticles() {
  const template = await upsertTemplate()
  const keepSlugs = [POOL_CLEANER_SLUG, ...HOMEPAGE_ARTICLES.map((article) => article.slug)]

  const unpublished = await prisma.article.updateMany({
    where: {
      published: true,
      slug: { notIn: keepSlugs },
    },
    data: { published: false },
  })

  console.log(`Unpublished ${unpublished.count} test/old articles`)

  await prisma.article.update({
    where: { slug: POOL_CLEANER_SLUG },
    data: {
      published: true,
      publishedAt: new Date(),
      featuredImage: POOL_CLEANER_HERO,
    },
  })
  console.log(`Kept ${POOL_CLEANER_SLUG} as the main hero article`)

  for (const article of HOMEPAGE_ARTICLES) {
    const existing = await prisma.article.findUnique({
      where: { slug: article.slug },
      include: { variants: true },
    })

    const articleData = {
      title: article.title,
      metaTitle: `${article.title} | MartiDeals`,
      metaDescription: article.metaDescription,
      author: 'MartiDeals',
      featuredImage: article.heroImage,
      contentType: 'template_based',
      content: { contentType: 'template_based', note: 'Content managed via variants and templates' },
      keywords: article.keywords,
      published: true,
      publishedAt: new Date(),
    }

    const saved = existing
      ? await prisma.article.update({ where: { id: existing.id }, data: articleData })
      : await prisma.article.create({ data: { slug: article.slug, ...articleData } })

    const variantData = buildVariantData(article)
    const controlVariant = existing?.variants.find((variant) => variant.isControl) ?? existing?.variants[0]

    if (controlVariant) {
      await prisma.articleVariant.update({
        where: { id: controlVariant.id },
        data: {
          name: `${article.category} Editorial Guide`,
          description: `Full MartiDeals ${article.category.toLowerCase()} buying guide`,
          templateId: template.id,
          isControl: true,
          trafficPercent: 100,
          isActive: true,
          data: variantData,
        },
      })
      console.log(`Updated article: ${article.slug}`)
    } else {
      await prisma.articleVariant.create({
        data: {
          articleId: saved.id,
          name: `${article.category} Editorial Guide`,
          description: `Full MartiDeals ${article.category.toLowerCase()} buying guide`,
          templateId: template.id,
          isControl: true,
          trafficPercent: 100,
          isActive: true,
          data: variantData,
        },
      })
      console.log(`Created article: ${article.slug}`)
    }
  }

  console.log('Homepage articles seeded successfully')
}

seedHomepageArticles()
  .catch((error) => {
    console.error('Failed to seed homepage articles:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
