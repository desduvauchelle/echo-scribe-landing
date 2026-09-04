import { defaultLocale, supportedLocales, isMultiLang } from '@/i18n/config'

// Canonical host for every absolute URL the site emits (canonical tags,
// sitemap, OG images). MUST be the single canonical host — pick www-or-apex
// once and configure the apex→www (or www→apex) 301 in your host/Vercel domain
// settings so there is exactly one indexable host. Trailing slash is stripped so
// `${SITE_URL}/blog` never doubles up.
export const SITE_URL = (
	process.env.SITE_URL ??
	(process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: 'http://localhost:3000')
).replace(/\/+$/, '')

export const BLOG_BATCH_SIZE = 1000

/**
 * Date each static page's CONTENT last meaningfully changed, as `YYYY-MM-DD`.
 *
 * Every blog and author URL carries a real `<lastmod>` from the CMS, but the
 * static pages had none at all — which threw away the one crawl-SCHEDULING
 * signal this site controls, for exactly the pages that sat longest in Search
 * Console's "Discovered – currently not indexed" (a page Google has queued but
 * never fetched). Google only honours `lastmod` while it stays verifiably
 * accurate, so this is a HAND-MAINTAINED map, not a build timestamp:
 *
 *   - Update a page's date when you change its copy, headings, or metadata —
 *     the things that alter what Google would index. Not for CSS or refactors.
 *   - A path absent from this map emits NO `<lastmod>`, which is correct and
 *     preferable to inventing one. Adding a page to STATIC_PAGES does not
 *     require adding it here.
 *   - Never wire this to `new Date()`. A sitemap whose `lastmod` is always
 *     "now" is the fastest way to get the field ignored site-wide.
 */
export const STATIC_PAGE_LASTMOD: Record<string, string> = {
	'': '2026-09-03',
	'/features': '2026-09-02',
	'/features/capture': '2026-09-02',
	'/features/organize': '2026-09-02',
	'/features/editor': '2026-09-02',
	'/features/platform': '2026-09-02',
	'/use-cases': '2026-09-02',
	'/use-cases/consultants': '2026-09-02',
	'/use-cases/sales-teams': '2026-09-02',
	'/use-cases/founders': '2026-09-02',
	'/use-cases/students': '2026-09-02',
	'/contact': '2026-09-02',
	'/blog/authors': '2026-08-30',
	'/loops': '2026-08-30',
}

export const STATIC_PAGES = [
	'',
	'/loops',
	'/features',
	'/features/capture',
	'/features/organize',
	'/features/editor',
	'/features/platform',
	'/use-cases',
	'/use-cases/consultants',
	'/use-cases/sales-teams',
	'/use-cases/founders',
	'/use-cases/students',
	'/blog',
	'/blog/authors',
	'/contact',
	'/privacy',
	'/legal',
	'/cookies',
]

export type ChangeFrequency =
	| 'always'
	| 'hourly'
	| 'daily'
	| 'weekly'
	| 'monthly'
	| 'yearly'
	| 'never'

export interface SitemapEntry {
	url: string
	lastModified?: Date
	changeFrequency?: ChangeFrequency
	priority?: number
	alternates?: Record<string, string>
}

interface BlogSitemapPost {
	slug: string
	language: string
	updatedAt: string | null
	parentPostId: string | null
}

interface AuthorSitemapEntry {
	slug: string
	updatedAt: string | null
}

/**
 * Absolute URL for a locale-agnostic path. THE single source of truth for every
 * absolute URL the site emits (canonical, OG, hreflang, sitemap, RSS).
 *
 * The site root is emitted SLASHLESS (`https://site.com`, not `.../`), and that
 * is not a free choice — Next's metadata resolver hard-codes it. In
 * `resolveAbsoluteUrlWithPathname` (next/dist/lib/metadata/resolvers/resolve-url.js)
 * it does:
 *
 *     resolvedUrl = result.pathname === '/' && result.searchParams.size === 0
 *       ? result.origin   // ← trailing slash dropped, unconditionally
 *       : result.href
 *
 * so a `${SITE_URL}/` handed to `alternates.canonical` comes back out of the
 * `<link rel="canonical">` as `${SITE_URL}` regardless. The only override is
 * `trailingSlash: true` in next.config, which would 308 every already-indexed
 * URL on the site (`/blog` → `/blog/`) — wildly disproportionate. So the sitemap
 * matches what the canonical tag can actually emit, rather than the reverse:
 * canonical, og:url, hreflang, sitemap and the RSS channel link are all the
 * identical string. Slashless also matches the rest of the site, where
 * `trailingSlash: false` 308-redirects `/blog/` → `/blog`.
 *
 * (`https://site.com` and `https://site.com/` are the same URL per RFC 3986 §6.2.3
 * and cannot be told apart server-side — both serialize to `GET / HTTP/1.1` — so
 * a redirect between them is impossible. Consistent canonicalization is the fix.)
 */
export function buildUrl(path: string, locale?: string): string {
	if (!locale || locale === defaultLocale) {
		return `${SITE_URL}${path}`
	}
	return `${SITE_URL}/${locale}${path}`
}

export function buildAlternates(path: string): Record<string, string> | undefined {
	if (!isMultiLang) return undefined
	const languages: Record<string, string> = {}
	for (const locale of supportedLocales) {
		languages[locale] = buildUrl(path, locale)
	}
	return languages
}

export async function fetchBlogCount(): Promise<number> {
	try {
		const res = await fetch(`${SITE_URL}/api/rs/content?type=blog&count=true`, {
			next: { revalidate: 3600 },
		})
		if (!res.ok) return 0
		const data = (await res.json()) as { count: number }
		return data.count
	} catch {
		return 0
	}
}

async function fetchBlogBatch(
	locale: string,
	limit: number,
	offset: number,
): Promise<BlogSitemapPost[]> {
	try {
		const res = await fetch(
			`${SITE_URL}/api/rs/content?type=blog&locale=${locale}&limit=${limit}&offset=${offset}&fields=slug,updatedAt,language,parentPostId`,
			{ next: { revalidate: 3600 } },
		)
		if (!res.ok) return []
		return (await res.json()) as BlogSitemapPost[]
	} catch {
		return []
	}
}

async function fetchAuthors(): Promise<AuthorSitemapEntry[]> {
	try {
		const res = await fetch(`${SITE_URL}/api/rs/content?type=blog-authors&fields=slug,updatedAt`, {
			next: { revalidate: 3600 } },
		)
		if (!res.ok) return []
		return (await res.json()) as AuthorSitemapEntry[]
	} catch {
		return []
	}
}

export function getBlogSitemapCount(total: number): number {
	return Math.max(1, Math.ceil(total / BLOG_BATCH_SIZE))
}

export function buildStaticEntries(): SitemapEntry[] {
	const entries: SitemapEntry[] = []
	for (const page of STATIC_PAGES) {
		const lastmod = STATIC_PAGE_LASTMOD[page]
		entries.push({
			url: buildUrl(page, defaultLocale),
			// `T00:00:00Z` so the date-only map value parses as UTC rather than
			// local time — otherwise a west-of-UTC build shifts every date back a day.
			...(lastmod ? { lastModified: new Date(`${lastmod}T00:00:00Z`) } : {}),
			changeFrequency: 'monthly',
			priority: page === '' ? 1.0 : 0.7,
			alternates: buildAlternates(page),
		})
	}
	return entries
}

export async function buildBlogEntries(batchId: number): Promise<SitemapEntry[]> {
	const offset = batchId * BLOG_BATCH_SIZE
	const fetches = supportedLocales.map((locale) =>
		fetchBlogBatch(locale, BLOG_BATCH_SIZE, offset),
	)
	const results = await Promise.all(fetches)

	const allPosts: BlogSitemapPost[] = []
	for (const batch of results) allPosts.push(...batch)

	const translationGroups = new Map<string, BlogSitemapPost[]>()
	const standalone: BlogSitemapPost[] = []
	for (const post of allPosts) {
		if (post.parentPostId) {
			const group = translationGroups.get(post.parentPostId) ?? []
			group.push(post)
			translationGroups.set(post.parentPostId, group)
		} else {
			standalone.push(post)
		}
	}

	const entries: SitemapEntry[] = []
	const processed = new Set<string>()

	for (const [, group] of translationGroups) {
		const alternates: Record<string, string> = {}
		for (const post of group) {
			alternates[post.language] = buildUrl(`/blog/${post.slug}`, post.language)
		}
		for (const post of group) {
			if (processed.has(post.slug)) continue
			processed.add(post.slug)
			entries.push({
				url: buildUrl(`/blog/${post.slug}`, post.language),
				lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
				changeFrequency: 'weekly',
				priority: 0.8,
				alternates: Object.keys(alternates).length > 1 ? alternates : undefined,
			})
		}
	}

	for (const post of standalone) {
		if (processed.has(post.slug)) continue
		processed.add(post.slug)
		const alternates = isMultiLang
			? { [post.language]: buildUrl(`/blog/${post.slug}`, post.language) }
			: undefined
		entries.push({
			url: buildUrl(`/blog/${post.slug}`, post.language),
			lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
			changeFrequency: 'weekly',
			priority: 0.8,
			alternates: alternates && Object.keys(alternates).length > 1 ? alternates : undefined,
		})
	}

	return entries
}

export async function buildAuthorEntries(): Promise<SitemapEntry[]> {
	const authors = await fetchAuthors()
	const entries: SitemapEntry[] = []
	for (const author of authors) {
		const path = `/blog/authors/${author.slug}`
		entries.push({
			url: buildUrl(path, defaultLocale),
			lastModified: author.updatedAt ? new Date(author.updatedAt) : undefined,
			changeFrequency: 'monthly',
			priority: 0.6,
			alternates: buildAlternates(path),
		})
	}
	return entries
}

export function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
	const lines: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
	]
	for (const entry of entries) {
		lines.push('  <url>')
		lines.push(`    <loc>${escapeXml(entry.url)}</loc>`)
		if (entry.lastModified) {
			lines.push(`    <lastmod>${entry.lastModified.toISOString()}</lastmod>`)
		}
		if (entry.changeFrequency) {
			lines.push(`    <changefreq>${entry.changeFrequency}</changefreq>`)
		}
		if (typeof entry.priority === 'number') {
			lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`)
		}
		if (entry.alternates) {
			for (const [lang, href] of Object.entries(entry.alternates)) {
				lines.push(
					`    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`,
				)
			}
		}
		lines.push('  </url>')
	}
	lines.push('</urlset>')
	return lines.join('\n')
}

export function renderSitemapIndex(urls: string[]): string {
	const lines: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
	]
	for (const url of urls) {
		lines.push('  <sitemap>')
		lines.push(`    <loc>${escapeXml(url)}</loc>`)
		lines.push('  </sitemap>')
	}
	lines.push('</sitemapindex>')
	return lines.join('\n')
}
