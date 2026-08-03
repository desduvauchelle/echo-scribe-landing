import { describe, it, expect } from 'vitest'
import en from './dictionaries/en'
import fr from './dictionaries/fr'
import {
	composeMetaDescription,
	META_DESCRIPTION_MIN,
	META_DESCRIPTION_MAX,
} from '@/lib/seo'

/**
 * The author page's meta description is `bio + authors.detail.meta.description`
 * (see `src/app/[locale]/blog/authors/[slug]/page.tsx`). The bio comes from the
 * CMS and is frequently a single short line, so the blurb is what actually has
 * to carry the snippet — in EVERY locale. A translator writing a terse one
 * would silently reintroduce the `meta_description_length` warning, so the copy
 * itself is pinned here rather than only the helper that assembles it.
 */
describe('author detail meta description', () => {
	const dictionaries = { en, fr }
	// Whatever the CMS holds: absent, a terse line, or a full paragraph.
	const bios = [
		null,
		'',
		'Maker.',
		'Founder of Echo Scribe.',
		'Maker of small Mac tools and local AI things.',
		'Denis builds Echo Scribe, a private voice-to-text app for the Mac, and writes about local AI, dictation, and getting thoughts out of your head faster than you can type them.',
	]

	for (const [locale, dict] of Object.entries(dictionaries)) {
		it(`[${locale}] blurb alone fills a snippet without overrunning it`, () => {
			const blurb = dict['authors.detail.meta.description'].replace(
				'{name}',
				'Denis Duvauchelle',
			)
			expect(blurb.length).toBeGreaterThanOrEqual(META_DESCRIPTION_MIN)
			expect(blurb.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX)
		})

		it(`[${locale}] every CMS bio composes to a 50–160 character description`, () => {
			for (const bio of bios) {
				const description = composeMetaDescription(
					bio,
					dict['authors.detail.meta.description'].replace('{name}', 'Denis Duvauchelle'),
				)
				expect(description, `bio: ${JSON.stringify(bio)}`).toBeDefined()
				expect(description!.length).toBeGreaterThanOrEqual(META_DESCRIPTION_MIN)
				expect(description!.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX)
			}
		})

		it(`[${locale}] blurb interpolates the author name`, () => {
			expect(dict['authors.detail.meta.description']).toContain('{name}')
		})
	}
})
