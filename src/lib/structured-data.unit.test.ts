import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { Dictionary } from '@/i18n'

/**
 * Structured-data URLs must match the canonical/sitemap URL form exactly:
 * bare paths for the default locale (no `/en/`), `/fr`-prefixed for secondary
 * locales. A JSON-LD node pointing at a URL form nothing else links to would
 * re-open the split-signal indexing bug the rest of the SEO setup guards
 * against.
 */
describe('structured-data — URL alignment with canonical/sitemap', () => {
	const originalEnv = { ...process.env }

	beforeEach(() => {
		vi.resetModules()
	})

	afterEach(() => {
		process.env = { ...originalEnv }
	})

	async function load() {
		vi.resetModules()
		process.env.SITE_URL = 'https://example.com'
		delete process.env.DEFAULT_LANGUAGE
		process.env.ADDITIONAL_LANGUAGES = 'fr'
		return import('./structured-data')
	}

	const dict = { 'hero.meta.description': 'Test description.' } as unknown as Dictionary

	it('breadcrumb items are BARE for the default locale (no /en/ segment)', async () => {
		const { breadcrumbLd } = await load()
		const ld = breadcrumbLd(
			[
				{ name: 'Home', path: '' },
				{ name: 'Use cases', path: '/use-cases' },
				{ name: 'For Consultants', path: '/use-cases/consultants' },
			],
			'en',
		)
		expect(ld.itemListElement.map((e) => e.item)).toEqual([
			'https://example.com',
			'https://example.com/use-cases',
			'https://example.com/use-cases/consultants',
		])
	})

	it('breadcrumb items are locale-prefixed for secondary locales', async () => {
		const { breadcrumbLd } = await load()
		const ld = breadcrumbLd(
			[
				{ name: 'Accueil', path: '' },
				{ name: 'Blog', path: '/blog' },
			],
			'fr',
		)
		expect(ld.itemListElement.map((e) => e.item)).toEqual([
			'https://example.com/fr',
			'https://example.com/fr/blog',
		])
	})

	it('breadcrumb positions are sequential from 1', async () => {
		const { breadcrumbLd } = await load()
		const ld = breadcrumbLd(
			[
				{ name: 'Home', path: '' },
				{ name: 'Blog', path: '/blog' },
				{ name: 'Authors', path: '/blog/authors' },
			],
			'en',
		)
		expect(ld.itemListElement.map((e) => e.position)).toEqual([1, 2, 3])
	})

	// The three nodes have different literal shapes; widen for property access.
	function nodesOf(ld: { '@graph': unknown[] }) {
		return ld['@graph'] as Record<string, unknown>[]
	}

	it('home graph links WebSite and SoftwareApplication to the Organization @id', async () => {
		const { homeJsonLd } = await load()
		const graph = nodesOf(homeJsonLd('en', dict))
		const org = graph.find((n) => n['@type'] === 'Organization')
		const site = graph.find((n) => n['@type'] === 'WebSite')
		const app = graph.find((n) => n['@type'] === 'SoftwareApplication')
		expect(org?.['@id']).toBe('https://example.com/#organization')
		expect(site?.publisher).toEqual({ '@id': 'https://example.com/#organization' })
		expect(app?.publisher).toEqual({ '@id': 'https://example.com/#organization' })
	})

	it('home graph URLs stay on the canonical host and default locale is bare', async () => {
		const { homeJsonLd } = await load()
		const graph = nodesOf(homeJsonLd('en', dict))
		const app = graph.find((n) => n['@type'] === 'SoftwareApplication')
		expect(app?.url).toBe('https://example.com')
		expect(app?.downloadUrl).toBe('https://example.com/contact')
		// The product is free; the offer must always say so.
		expect(app?.offers).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'USD' })
	})
})
