import { describe, it, expect } from 'vitest'
import en from '@/i18n/dictionaries/en'
import { FEATURE_GROUP, USECASE_GROUP, type NavGroup } from '@/components/layout/nav.config'
import { buildFeaturesHub } from './features.config'
import { buildUseCasesHub } from './usecases.config'
import type { ProductPageProps } from './ProductPage'

/**
 * Regression gate for dead-end hub pages.
 *
 * `/features` and `/use-cases` exist to introduce — and pass authority to — the
 * eight pages under them. They shipped doing neither: `Slab` had no href field,
 * so the only body link on either hub was the `#install` anchor and the
 * subpages' sole internal link came from the header dropdown. A hub that links
 * nowhere is just another thin page competing with the children it should be
 * feeding, which is the shape of "Crawled – currently not indexed".
 *
 * Also gated here: the anchor text. Reusing one generic "Learn more" on all four
 * slabs wastes the keyword signal an internal link carries, so the label must
 * name its destination (via `product.slab.explore`).
 */
const CASES: { name: string; hub: ProductPageProps; group: NavGroup }[] = [
	{ name: '/features', hub: buildFeaturesHub(en, 'en'), group: FEATURE_GROUP },
	{ name: '/use-cases', hub: buildUseCasesHub(en, 'en'), group: USECASE_GROUP },
]

describe('hub pages link to their subpages', () => {
	for (const { name, hub, group } of CASES) {
		it(`${name} links every subpage the nav offers`, () => {
			const linked = hub.slabs.map((s) => s.href).sort()
			// Default locale is bare — `localizedPath` adds no prefix for 'en'.
			expect(linked).toEqual(group.itemKeys.map((i) => i.path).sort())
		})

		it(`${name} gives every slab descriptive anchor text`, () => {
			for (const slab of hub.slabs) {
				expect(`${name} ${slab.title}: ${slab.linkLabel ?? 'MISSING'}`).not.toContain('MISSING')
			}
			// The real hazard is one generic label repeated across every slab
			// ("Learn more" ×4), which tells a crawler nothing about any of the
			// four destinations. Distinct labels are the observable form of that.
			const labels = hub.slabs.map((s) => s.linkLabel)
			expect(new Set(labels).size).toBe(labels.length)
		})

		it(`${name} slab copy is not a duplicate of the subpage's own subtitle`, () => {
			// The hub used to reuse each subpage's `subtitle` verbatim as its slab
			// `desc`, so the hub's only unique prose was its intro. `.hubdesc` keys
			// keep the two surfaces distinct.
			const subtitles = new Set(
				Object.entries(en as Record<string, string>)
					.filter(([k]) => k.endsWith('.subtitle'))
					.map(([, v]) => v),
			)
			for (const slab of hub.slabs) expect(subtitles.has(slab.desc)).toBe(false)
		})
	}

	it('every hub carries its own intro prose and FAQs', () => {
		for (const { name, hub } of CASES) {
			expect(`${name} intro: ${hub.intro?.length ?? 0}`).not.toContain(': 0')
			expect(`${name} faqs: ${hub.faqs?.length ?? 0}`).not.toContain(': 0')
		}
	})
})
