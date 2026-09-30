import { describe, expect, it, vi } from 'vitest'
import { createElement } from 'react'
import { HomeBlogCard } from '@/components/blog/HomeBlogCard'
import config from '../../../../next.config'
import { renderToStaticMarkup } from 'react-dom/server'
import HomePage from '@/app/[locale]/page'

vi.mock('@/lib/db', () => ({
  getDb: () => ({}),
  safeQuery: (_fallback: unknown, query: () => unknown) => query(),
}))
vi.mock('@growth-engine/sdk-server', () => ({
  getBlogPosts: () => Promise.resolve([{
    id: 'fixture', slug: 'performance-fixture', title: 'Fixture article',
    content: '<p>Article preview</p>', seoDesc: 'Fixture description',
    heroImageUrl: 'https://storage.googleapis.com/rs-bucket-prod/tenants/echo-scribe-ai-juicing/public/blog-assets/fixture/hero.png',
    createdAt: '2026-09-29T00:00:00Z',
  }]),
}))

describe('homepage image delivery', () => {
  it('keeps below-fold CMS images out of the eager full-size download path', async () => {
    const html = renderToStaticMarkup(await HomePage({ params: Promise.resolve({ locale: 'en' }) }))
    const articleImage = html.match(/<img\b[^>]*alt="Fixture article"[^>]*>/)?.[0]
    expect(articleImage).toBeDefined()
    expect(articleImage).toContain('loading="lazy"')
    expect(articleImage).toContain('/_next/image?')
    expect(articleImage).toContain('srcSet=')
    expect(html).toContain('href="/blog/performance-fixture"')
    expect(html).toContain('Fixture description')
  })
})

const card = {
  slug: 'fixture', title: 'Fixture', content: '<p>Fallback preview</p>',
  seoDesc: null, createdAt: '2026-09-29T00:00:00Z', locale: 'fr',
}

describe('homepage card compatibility', () => {
  it('preserves localized links, preview, date and cards without images', () => {
    const html = renderToStaticMarkup(createElement(HomeBlogCard, { ...card, heroImageUrl: null }))
    expect(html).toContain('href="/fr/blog/fixture"')
    expect(html).toContain('Fallback preview...')
    expect(html).toContain('dateTime="2026-09-29T00:00:00.000Z"')
    expect(html).not.toContain('<img')
  })

  it('keeps non-CMS image URLs usable and lazy without proxying them', () => {
    const html = renderToStaticMarkup(createElement(HomeBlogCard, { ...card, heroImageUrl: 'https://example.com/editorial.jpg' }))
    expect(html).toContain('src="https://example.com/editorial.jpg"')
    expect(html).toContain('loading="lazy"')
    expect(html).not.toContain('/_next/image?')
  })

  it('allows the public tenant image path in the production optimizer', () => {
    expect(config.images?.remotePatterns).toContainEqual({
      protocol: 'https', hostname: 'storage.googleapis.com',
      pathname: '/rs-bucket-prod/tenants/echo-scribe-ai-juicing/public/**',
    })
  })
})
