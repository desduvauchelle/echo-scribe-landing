import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import en from '@/i18n/dictionaries/en'
import fr from '@/i18n/dictionaries/fr'
import es from '@/i18n/dictionaries/es'
import de from '@/i18n/dictionaries/de'
import ptDict from '@/i18n/dictionaries/pt'
import itDict from '@/i18n/dictionaries/it'
import nl from '@/i18n/dictionaries/nl'
import pl from '@/i18n/dictionaries/pl'
import { SITE_NAME, META_DESCRIPTION_MIN, META_DESCRIPTION_MAX } from './seo'

/**
 * Regression gate for the homepage's `<title>` and `<meta description>`.
 *
 * The homepage is the site's highest-impression URL, and it shipped a title
 * that ran 59–72 characters in all eight locales — past the ~60 Google renders
 * — because each translation baked the brand into its own string under
 * `brand: false` instead of using the shared `… | ${SITE_NAME}` suffix every
 * other page gets. A truncated, brand-first title on a page sitting at
 * position ~5.6 with zero clicks is the cheapest CTR loss on the site.
 *
 * `pt`/`it` are aliased because bare `it` would shadow vitest's `it`.
 */
const __dirname = dirname(fileURLToPath(import.meta.url))
const HOME_PAGE = join(__dirname, '..', 'app', '[locale]', 'page.tsx')

/** What Google renders. Anything past this is replaced with an ellipsis. */
const TITLE_MAX = 60
const SUFFIX = ` | ${SITE_NAME}`

const dicts: Record<string, Record<string, string>> = {
	en: en as unknown as Record<string, string>,
	fr,
	es,
	de,
	pt: ptDict,
	it: itDict,
	nl,
	pl,
}

describe('homepage metadata', () => {
	it('takes its title and description from the home.meta.* keys', () => {
		const src = readFileSync(HOME_PAGE, 'utf8')
		expect(src).toMatch(/title:\s*dict\['home\.meta\.title'\]/)
		expect(src).toMatch(/description:\s*dict\['home\.meta\.description'\]/)
	})

	it('lets buildPageMetadata append the brand instead of hand-writing it', () => {
		// `brand: false` is what let each locale invent its own branding and blow
		// the title budget. The suffix belongs to `buildPageMetadata`.
		// Comments are stripped first — the docblock above `generateMetadata`
		// names `brand: false` while explaining why it was removed.
		const code = readFileSync(HOME_PAGE, 'utf8').replace(/^\s*\/\/.*$/gm, '')
		expect(code).not.toMatch(/brand:\s*false/)
	})

	it('emits a self-referencing canonical for the site root', () => {
		// `buildPageMetadata` derives the canonical from `path`; the homepage's
		// locale-agnostic path is the empty string, never a hard-coded URL.
		expect(readFileSync(HOME_PAGE, 'utf8')).toMatch(/buildPageMetadata\(\{\s*\n\s*path: '',/)
	})

	it('keeps the rendered title inside the ~60 char budget in every locale', () => {
		const tooLong: string[] = []
		for (const [locale, dict] of Object.entries(dicts)) {
			const rendered = `${dict['home.meta.title']}${SUFFIX}`
			if (rendered.length > TITLE_MAX) {
				tooLong.push(`${locale} (${rendered.length} chars): ${rendered}`)
			}
		}
		expect(tooLong).toEqual([])
	})

	it('does not repeat the brand inside the title value', () => {
		const doubled: string[] = []
		for (const [locale, dict] of Object.entries(dicts)) {
			if (dict['home.meta.title'].includes(SITE_NAME)) doubled.push(locale)
		}
		expect(
			doubled,
			`buildPageMetadata already appends "${SUFFIX}" — remove the brand from these values: ${doubled.join(', ')}`,
		).toEqual([])
	})

	it('fills the search snippet without overflowing it in every locale', () => {
		const bad: string[] = []
		for (const [locale, dict] of Object.entries(dicts)) {
			const len = dict['home.meta.description'].length
			if (len < META_DESCRIPTION_MIN || len > META_DESCRIPTION_MAX) {
				bad.push(`${locale} (${len} chars)`)
			}
		}
		expect(
			bad,
			`Homepage descriptions must be ${META_DESCRIPTION_MIN}–${META_DESCRIPTION_MAX} chars: ${bad.join(', ')}`,
		).toEqual([])
	})
})
