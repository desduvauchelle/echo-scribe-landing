import { describe, it, expect } from 'vitest'
import en from './dictionaries/en'
import fr from './dictionaries/fr'
import es from './dictionaries/es'
import de from './dictionaries/de'
import ptDict from './dictionaries/pt'
import itDict from './dictionaries/it'
import nl from './dictionaries/nl'
import pl from './dictionaries/pl'

/**
 * Key PARITY is already enforced at compile time — every dictionary is typed as
 * `Dictionary`, so a missing or extra key fails `pnpm typecheck`. What the type
 * system cannot see is the *inside* of a string, which is where the two silent
 * translation regressions live:
 *
 *  1. A dropped interpolation token. `'blog.load.error'` renders through
 *     `.replace('{error}', msg)`; a translation that loses `{error}` swallows
 *     the message and no test or type ever notices.
 *  2. Mojibake. These files are full of accented characters and typographic
 *     quotes; a bad round-trip through a non-UTF-8 tool turns « into Â« and the
 *     page renders garbage that still type-checks.
 *
 * `pt`/`it` are aliased because bare `it` would shadow vitest's `it`.
 */
const dicts: Record<string, Record<string, string>> = {
	fr,
	es,
	de,
	pt: ptDict,
	it: itDict,
	nl,
	pl,
}

const enDict = en as unknown as Record<string, string>
const enKeys = Object.keys(enDict)

/** The `{varName}` tokens in a string, sorted so order changes don't matter. */
function placeholders(value: string): string {
	return (value.match(/\{[a-zA-Z]+\}/g) ?? []).sort().join(',')
}

describe('translation dictionaries', () => {
	it('ships a dictionary for every locale the switcher offers', () => {
		expect(Object.keys(dicts).sort()).toEqual(['de', 'es', 'fr', 'it', 'nl', 'pl', 'pt'])
	})

	it('keeps the same interpolation placeholders as English', () => {
		for (const [locale, dict] of Object.entries(dicts)) {
			for (const key of enKeys) {
				// Compared as a labelled string so a failure names the exact locale/key.
				expect(`${locale} ${key}: ${placeholders(dict[key])}`).toBe(
					`${locale} ${key}: ${placeholders(enDict[key])}`,
				)
			}
		}
	})

	it('has no blank values', () => {
		for (const [locale, dict] of Object.entries(dicts)) {
			for (const key of enKeys) {
				expect(`${locale} ${key}: ${dict[key].trim() ? 'filled' : 'BLANK'}`).toBe(
					`${locale} ${key}: filled`,
				)
			}
		}
	})

	it('has no mojibake from a bad encoding round-trip', () => {
		// U+FFFD, plus the two signatures of UTF-8 read as Latin-1 / cp1252.
		const corrupted = /�|Ã[-¿]|â€/
		for (const [locale, dict] of Object.entries(dicts)) {
			for (const key of enKeys) {
				expect(`${locale} ${key}: ${corrupted.test(dict[key]) ? 'MOJIBAKE' : 'clean'}`).toBe(
					`${locale} ${key}: clean`,
				)
			}
		}
	})

	it('uses Tucky throughout visible product copy', () => {
		for (const [locale, dict] of Object.entries({ en: enDict, ...dicts })) {
			for (const [key, value] of Object.entries(dict)) {
				expect(`${locale} ${key}: ${/Echo[ -]?Scribe|EchoScribe/i.test(value) ? 'OLD BRAND' : 'Tucky'}`).toBe(
					`${locale} ${key}: Tucky`,
				)
			}
		}
	})
})
