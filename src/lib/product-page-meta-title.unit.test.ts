import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import en from '@/i18n/dictionaries/en'

/**
 * Regression gate for slogan `<title>` tags.
 *
 * Every `/features/*` and `/use-cases/*` page is a `ProductPage`, and a
 * ProductPage's `*.title` dictionary key is its on-page H1 — deliberately a
 * marketing slogan ("It all starts with your voice.", "Built for the way you
 * actually work."). Those read well at 48px and are worthless in a search
 * result: they name no product, no platform, and no query the page could
 * answer.
 *
 * Five of these pages had a `*.meta.title` key written for exactly this reason
 * and five did not, so half the section shipped its H1 into `<title>` — five
 * pages telling Google nothing about what they were, on a site where 36 of 48
 * URLs were "Crawled – currently not indexed". The split was invisible because
 * both keys type-check identically.
 *
 * So: a ProductPage's metadata title must come from a `*.meta.title` key that
 * actually exists in the dictionary. Prose-noun keys elsewhere (`blog.heading`,
 * `page.privacy.policy`) are fine and out of scope — the hazard is specific to
 * pages whose `*.title` is a headline.
 */
const __dirname = dirname(fileURLToPath(import.meta.url))
const APP = join(__dirname, '..', 'app', '[locale]')

const PRODUCT_DIRS = [join(APP, 'features'), join(APP, 'use-cases')]

function pages(dir: string): string[] {
	const out: string[] = []
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry)
		if (statSync(full).isDirectory()) out.push(...pages(full))
		else if (entry === 'page.tsx') out.push(full)
	}
	return out
}

const dict = en as unknown as Record<string, string>

describe('ProductPage metadata titles', () => {
	const files = PRODUCT_DIRS.flatMap(pages)

	it('finds every feature and use-case page', () => {
		// Guards the test itself: a silently-empty scan would pass everything.
		expect(files.length).toBeGreaterThanOrEqual(10)
	})

	it('never uses an H1 slogan key as the <title>', () => {
		const offenders: string[] = []
		for (const file of files) {
			const src = readFileSync(file, 'utf8')
			const match = src.match(/title:\s*dict\['([^']+)'\]/)
			const key = match?.[1]
			if (!key || !key.endsWith('.meta.title')) {
				offenders.push(`${file.slice(APP.length + 1)} → ${key ?? 'NO title: dict[…]'}`)
			}
		}
		expect(
			offenders,
			`These pages put their H1 slogan in <title>. Add a descriptive '*.meta.title' key and use it: ${offenders.join(', ')}`,
		).toEqual([])
	})

	it('points at a meta.title key that exists in the dictionary', () => {
		const missing: string[] = []
		for (const file of files) {
			const key = readFileSync(file, 'utf8').match(/title:\s*dict\['([^']+)'\]/)?.[1]
			if (key && !(key in dict)) missing.push(`${file.slice(APP.length + 1)} → ${key}`)
		}
		expect(missing).toEqual([])
	})

	it('keeps meta titles inside the ~60 char search-result budget', () => {
		// Google truncates around 60 chars, and `buildPageMetadata` appends
		// " | Tucky" (14) to each of these, so the key itself gets ~46.
		const tooLong: string[] = []
		for (const file of files) {
			const key = readFileSync(file, 'utf8').match(/title:\s*dict\['([^']+)'\]/)?.[1]
			const value = key ? dict[key] : undefined
			if (value && value.length > 52) tooLong.push(`${key} (${value.length} chars)`)
		}
		expect(tooLong).toEqual([])
	})
})
