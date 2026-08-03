import type { Metadata } from 'next'
import { defaultLocale } from '@/i18n/config'
import { SITE_URL, buildUrl, buildAlternates } from './sitemap-shared'

export const SITE_NAME = 'Echo Scribe'

/**
 * Search-snippet bounds. Google renders roughly 160 characters of a
 * description; much under 50 leaves most of the snippet unused (and trips the
 * `meta_description_length` crawl warning), so a thin CMS field must be topped
 * up rather than shipped as-is.
 */
export const META_DESCRIPTION_MIN = 50
export const META_DESCRIPTION_MAX = 160

/** Trim to `max` on a word boundary, ellipsing only when text is actually cut. */
function clamp(text: string, max: number): string {
	if (text.length <= max) return text
	const clipped = text.slice(0, max - 1)
	const lastSpace = clipped.lastIndexOf(' ')
	const cut = lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped
	return `${cut.replace(/[\s,;:.—–-]+$/, '')}…`
}

/**
 * Build a description that fills a search snippet: `parts` are appended in
 * order until the result clears `META_DESCRIPTION_MIN`, then the whole thing is
 * clamped to `META_DESCRIPTION_MAX`.
 *
 * Pass the most specific text first (a CMS bio or excerpt) and generic page
 * context after it, so a well-written CMS field is used verbatim and only a
 * thin one gets padded:
 *
 *   composeMetaDescription(author.bio, dict['authors.detail.meta.description'])
 *
 * Returns `undefined` when every part is empty, so callers can leave the
 * description off entirely instead of emitting a blank tag.
 */
export function composeMetaDescription(
	...parts: (string | null | undefined)[]
): string | undefined {
	let out = ''
	for (const part of parts) {
		const text = part?.replace(/\s+/g, ' ').trim()
		if (!text) continue
		out = out ? `${out} ${text}` : text
		if (out.length >= META_DESCRIPTION_MIN) break
	}
	return out ? clamp(out, META_DESCRIPTION_MAX) : undefined
}

interface PageMetadataInput {
	/** Path WITHOUT locale prefix, e.g. '' (home), '/blog', '/blog/my-post'. */
	path: string
	locale: string
	/** Human title for this page. Branded as `${title} | ${SITE_NAME}` unless `brand: false`. */
	title: string
	description?: string | null
	/** Absolute or root-relative OG image (resolved against metadataBase). */
	image?: string | null
	type?: 'website' | 'article'
	/** Set false to use `title` verbatim (e.g. the homepage already is the brand). */
	brand?: boolean
}

/**
 * Build a page's metadata with a SELF-REFERENCING canonical, hreflang
 * alternates, and OpenGraph/Twitter tags — all on the single canonical host.
 *
 * The canonical always points at THIS page's own URL (never a different page,
 * never a stripped/added locale), which is the whole fix for the indexing bug.
 * Use this in every `generateMetadata`.
 */
export function buildPageMetadata({
	path,
	locale,
	title,
	description,
	image,
	type = 'website',
	brand = true,
}: PageMetadataInput): Metadata {
	const canonical = buildUrl(path, locale)
	const languages = buildAlternates(path)
	const fullTitle = brand ? `${title} | ${SITE_NAME}` : title

	// Default share card is the generated `next/og` image at the app root
	// (`src/app/opengraph-image.tsx`). Referenced explicitly — rather than relying
	// on the file-convention cascade, which doesn't reach pages through the dynamic
	// `[locale]` segment — and resolved against `metadataBase` so it stays on the
	// single canonical host. A page may still pass its own `image` to override.
	const ogImage = image ?? '/opengraph-image'

	const languagesWithDefault = languages
		? { ...languages, 'x-default': buildUrl(path, defaultLocale) }
		: undefined

	return {
		// `absolute` opts out of the root layout's title template so the brand
		// suffix isn't applied twice.
		title: { absolute: fullTitle },
		...(description ? { description } : {}),
		alternates: {
			canonical,
			// Site-wide RSS feed discovery (`<link rel="alternate" type="…rss+xml">`),
			// resolved against `metadataBase`. The feed itself is served `noindex`.
			types: {
				'application/rss+xml': [{ url: '/rss.xml', title: `${SITE_NAME} RSS Feed` }],
			},
			...(languagesWithDefault ? { languages: languagesWithDefault } : {}),
		},
		openGraph: {
			title: fullTitle,
			...(description ? { description } : {}),
			url: canonical,
			siteName: SITE_NAME,
			type,
			images: [{ url: ogImage }],
		},
		twitter: {
			// Every page carries a large share image, so always use the large card.
			card: 'summary_large_image',
			title: fullTitle,
			...(description ? { description } : {}),
			images: [ogImage],
		},
	}
}

export { SITE_URL }
