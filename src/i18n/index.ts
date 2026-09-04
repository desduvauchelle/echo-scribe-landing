import type { Dictionary, DictionaryKey } from './dictionaries/en'

export type { Dictionary, DictionaryKey }

const cache = new Map<string, Dictionary>()

/**
 * One dynamic import per translated locale. The import specifiers are literal
 * so the bundler can still statically resolve (and code-split) each dictionary
 * — do NOT collapse these into `import(\`./dictionaries/${locale}\`)`.
 *
 * To add a language: create `dictionaries/{code}.ts` typed as `Dictionary`, add
 * a line here, and set `ADDITIONAL_LANGUAGES={code}` (see the i18n section of
 * CLAUDE.md). Anything not listed falls back to English.
 */
const loaders: Record<string, () => Promise<{ default: Dictionary }>> = {
	en: () => import('./dictionaries/en'),
	fr: () => import('./dictionaries/fr'),
	es: () => import('./dictionaries/es'),
	de: () => import('./dictionaries/de'),
	pt: () => import('./dictionaries/pt'),
	it: () => import('./dictionaries/it'),
	nl: () => import('./dictionaries/nl'),
	pl: () => import('./dictionaries/pl'),
}

export async function getDictionary(locale: string): Promise<Dictionary> {
	const cached = cache.get(locale)
	if (cached) return cached

	let dict: Dictionary

	try {
		const load = loaders[locale] ?? loaders.en
		dict = (await load()).default
	} catch {
		const mod = await import('./dictionaries/en')
		dict = mod.default
	}

	cache.set(locale, dict)
	return dict
}

export function t(
	dict: Dictionary,
	key: DictionaryKey,
	vars?: Record<string, string>,
): string {
	let value: string = dict[key]

	if (vars) {
		for (const [k, v] of Object.entries(vars)) {
			value = value.replaceAll(`{${k}}`, v)
		}
	}

	return value
}
