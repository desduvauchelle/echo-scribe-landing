import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('seo', () => {
	const originalEnv = process.env

	beforeEach(() => {
		vi.resetModules()
		process.env = { ...originalEnv }
		process.env.SITE_URL = 'https://example.com'
	})

	afterEach(() => {
		process.env = originalEnv
	})

	async function load(config?: {
		defaultLocale?: string
		supportedLocales?: string[]
		isMultiLang?: boolean
	}) {
		vi.doMock('@/i18n/config', () => ({
			defaultLocale: config?.defaultLocale ?? 'en',
			supportedLocales: config?.supportedLocales ?? ['en'],
			isMultiLang: config?.isMultiLang ?? false,
			additionalLocales: (config?.supportedLocales ?? ['en']).slice(1),
		}))
		return {
			...(await import('./seo')),
			...(await import('./sitemap-shared')),
		}
	}

	// ─── homepage URL agreement ──────────────────────────────────────────
	//
	// The duplicate-homepage bug: the crawler sees `https://site.com` and
	// `https://site.com/` as two URLs serving one title/description. They are the
	// same URL (RFC 3986 §6.2.3) and cannot be told apart server-side, so no
	// redirect can collapse them — the only fix is that every signal the site
	// emits names the SAME string. These tests pin that agreement.

	describe('homepage canonicalization', () => {
		it('canonical, og:url and the sitemap entry are the identical string', async () => {
			const { buildPageMetadata, buildUrl } = await load()
			const meta = buildPageMetadata({ path: '', locale: 'en', title: 'Home' })

			expect(meta.alternates?.canonical).toBe('https://example.com')
			expect(meta.openGraph?.url).toBe('https://example.com')
			expect(meta.alternates?.canonical).toBe(buildUrl('', 'en'))
			expect(meta.openGraph?.url).toBe(buildUrl('', 'en'))
		})

		it('canonical carries no trailing slash', async () => {
			// Next's metadata resolver drops a root trailing slash before writing the
			// tag (see the `buildUrl` docblock), so emitting `${SITE_URL}/` upstream
			// would leave the sitemap disagreeing with the rendered canonical.
			const { buildPageMetadata } = await load()
			const meta = buildPageMetadata({ path: '', locale: 'en', title: 'Home' })
			expect(meta.alternates?.canonical).not.toMatch(/\/$/)
		})

		it('hreflang alternates and x-default use the same root form', async () => {
			const { buildPageMetadata } = await load({
				defaultLocale: 'en',
				supportedLocales: ['en', 'fr'],
				isMultiLang: true,
			})
			const meta = buildPageMetadata({ path: '', locale: 'en', title: 'Home' })
			const languages = meta.alternates?.languages as Record<string, string>

			expect(languages.en).toBe('https://example.com')
			expect(languages['x-default']).toBe('https://example.com')
			expect(languages.fr).toBe('https://example.com/fr')
		})
	})

	// ─── self-referencing canonical ──────────────────────────────────────

	describe('buildPageMetadata', () => {
		it('canonical points at the page itself, matching the sitemap', async () => {
			const { buildPageMetadata, buildUrl } = await load()
			for (const path of ['', '/blog', '/blog/my-post', '/contact']) {
				const meta = buildPageMetadata({ path, locale: 'en', title: 'T' })
				expect(meta.alternates?.canonical).toBe(buildUrl(path, 'en'))
			}
		})

		it('brands the title by default and honours brand: false', async () => {
			const { buildPageMetadata, SITE_NAME } = await load()
			const branded = buildPageMetadata({ path: '/blog', locale: 'en', title: 'Blog' })
			expect(branded.title).toEqual({ absolute: `Blog | ${SITE_NAME}` })

			const bare = buildPageMetadata({
				path: '',
				locale: 'en',
				title: 'Echo Scribe — Voice to Text',
				brand: false,
			})
			expect(bare.title).toEqual({ absolute: 'Echo Scribe — Voice to Text' })
		})

		it('omits hreflang alternates in single-lang mode', async () => {
			const { buildPageMetadata } = await load({ isMultiLang: false })
			const meta = buildPageMetadata({ path: '', locale: 'en', title: 'Home' })
			expect(meta.alternates?.languages).toBeUndefined()
		})
	})

	// ─── description length ──────────────────────────────────────────────
	//
	// A description under ~50 characters wastes the search snippet (the
	// `meta_description_length` crawl warning); over ~160 gets truncated
	// mid-word by Google. CMS-authored fields — an author bio, a post excerpt —
	// are written for the page, not the SERP, so they hit both ends.

	describe('composeMetaDescription', () => {
		const BIO = 'Founder of Echo Scribe.'
		const BLURB =
			'Posts and guides by Denis Duvauchelle on private transcription, offline dictation, and local AI — from the Echo Scribe blog.'

		it('tops a too-short bio up past the minimum, keeping the bio first', async () => {
			const { composeMetaDescription, META_DESCRIPTION_MIN } = await load()
			const description = composeMetaDescription(BIO, BLURB)!

			expect(BIO.length).toBeLessThan(META_DESCRIPTION_MIN)
			expect(description.length).toBeGreaterThanOrEqual(META_DESCRIPTION_MIN)
			expect(description.startsWith(BIO)).toBe(true)
		})

		it('keeps every composition within the snippet bounds', async () => {
			const { composeMetaDescription, META_DESCRIPTION_MIN, META_DESCRIPTION_MAX } =
				await load()
			const bios = ['', 'Maker.', BIO, 'A'.repeat(140), 'word '.repeat(80)]

			for (const bio of bios) {
				const description = composeMetaDescription(bio, BLURB)!
				expect(description.length).toBeGreaterThanOrEqual(META_DESCRIPTION_MIN)
				expect(description.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX)
			}
		})

		it('uses a bio that already fills the snippet verbatim', async () => {
			const { composeMetaDescription } = await load()
			const bio =
				'Denis builds Echo Scribe, a private voice-to-text app for the Mac, and writes about local AI.'
			expect(composeMetaDescription(bio, BLURB)).toBe(bio)
		})

		it('collapses the whitespace a CMS field carries over', async () => {
			const { composeMetaDescription } = await load()
			const description = composeMetaDescription(`  Maker.\n\tShipper.  `, BLURB)

			expect(description).toBe(`Maker. Shipper. ${BLURB}`)
		})

		it('truncates on a word boundary rather than mid-word', async () => {
			const { composeMetaDescription, META_DESCRIPTION_MAX } = await load()
			// Under the minimum on its own, but long enough that bio + blurb overruns.
			const bio = 'Maker of small Mac tools and local AI things.'
			const description = composeMetaDescription(bio, BLURB)!

			expect(bio.length + 1 + BLURB.length).toBeGreaterThan(META_DESCRIPTION_MAX)
			expect(description.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX)
			expect(description).toMatch(/\S…$/)
			// The cut lands between words: the last kept word is intact.
			const lastWord = description.replace(/…$/, '').split(' ').pop()!
			expect(BLURB).toContain(lastWord)
		})

		it('returns undefined when there is nothing to say', async () => {
			const { composeMetaDescription } = await load()
			expect(composeMetaDescription(null, undefined, '   ')).toBeUndefined()
		})
	})
})
