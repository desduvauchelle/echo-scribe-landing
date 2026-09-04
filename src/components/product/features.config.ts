import type { Dictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'
import type { Faq, ProductPageProps, Slab } from './ProductPage'
import type { Shot } from './ScreenshotFrame'

const S = '/screenshots'

const RECORDED_SIZES: Record<string, readonly [number, number]> = {
	'recorded/meeting-library': [868, 552],
	'recorded/chat-answer': [660, 552],
	'recorded/chat-workspace': [1100, 600],
	'recorded/meeting-summary': [480, 470],
	'recorded/coaching-feedback': [460, 376],
	'recorded/recording-preview': [560, 428],
}

export function shotFor(src: string, alt: string): Shot {
	const size = RECORDED_SIZES[src]
	return { src: `${S}/${src}.png`, alt, ...(size ? { width: size[0], height: size[1] } : {}) }
}

// Pull N `${base}.intro{n}` paragraphs into the ProductPage intro prose block.
export function introFor(dict: Dictionary, base: string, count: number): string[] {
	return Array.from({ length: count }, (_, i) => dict[`${base}.intro${i + 1}` as keyof Dictionary])
}

// Pull N `${base}.faq{n}.q` / `.a` pairs into the ProductPage FAQ block (also FAQPage JSON-LD).
export function faqsFor(dict: Dictionary, base: string, count: number): Faq[] {
	return Array.from({ length: count }, (_, i) => ({
		q: dict[`${base}.faq${i + 1}.q` as keyof Dictionary],
		a: dict[`${base}.faq${i + 1}.a` as keyof Dictionary],
	}))
}

/**
 * A hub slab's link: locale-correct href plus DESCRIPTIVE anchor text.
 *
 * The label is built from `product.slab.explore` ('Explore {name}') so
 * translations control word order, and `{name}` is the destination's own nav
 * label — which keeps the anchor keyword-bearing ("Explore Capture & Record")
 * instead of a repeated, equity-wasting "Learn more".
 */
export function hubLink(
	dict: Dictionary,
	path: string,
	locale: string,
	nameKey: keyof Dictionary,
	opts: { verbatim?: boolean } = {},
): { href: string; linkLabel: string } {
	return {
		href: localizedPath(path, locale),
		// `verbatim` takes the key as the whole label. The use-case nav labels are
		// already prepositional ('For Consultants'), so templating them yields
		// "Explore For Consultants" — those pages supply a full sentence instead.
		linkLabel: opts.verbatim
			? dict[nameKey]
			: dict['product.slab.explore'].replace('{name}', dict[nameKey]),
	}
}

export function slab(
	dict: Dictionary,
	base: string,
	shotSrc: string,
	shotAltKey: keyof Dictionary,
	opts: { reverse?: boolean; tinted?: boolean } = {},
): Slab {
	return {
		eyebrow: dict[`${base}.eyebrow` as keyof Dictionary],
		title: dict[`${base}.title` as keyof Dictionary],
		desc: dict[`${base}.desc` as keyof Dictionary],
		steps: [1, 2, 3].map((n) => ({
			title: dict[`${base}.step${n}.title` as keyof Dictionary],
			desc: dict[`${base}.step${n}.desc` as keyof Dictionary],
		})),
		shot: shotFor(shotSrc, dict[shotAltKey]),
		reverse: opts.reverse,
		tinted: opts.tinted,
	}
}

export function buildCapturePage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['features.capture.eyebrow'],
		title: dict['features.capture.title'],
		subtitle: dict['features.capture.subtitle'],
		hero: shotFor('dictation', dict['shot.dictation.alt']),
		slabs: [
			slab(dict, 'features.capture.slab3', 'dictation', 'shot.dictation.alt'),
			slab(dict, 'features.capture.slab1', 'recorded/meeting-summary', 'shot.recorded.summary.alt', { reverse: true, tinted: true }),
			slab(dict, 'features.capture.slab2', 'screen-recorder', 'shot.screen-recorder.alt'),
		],
		intro: introFor(dict, 'features.capture', 2),
		faqs: faqsFor(dict, 'features.capture', 3),
		dict,
		locale,
	}
}

export function buildOrganizePage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['features.organize.eyebrow'],
		title: dict['features.organize.title'],
		subtitle: dict['features.organize.subtitle'],
		hero: shotFor('recorded/meeting-library', dict['shot.recorded.library.alt']),
		slabs: [
			slab(dict, 'features.organize.slab1', 'recorded/chat-answer', 'shot.recorded.answer.alt'),
			slab(dict, 'features.organize.slab2', 'daily-summary', 'shot.daily-summary.alt', { reverse: true, tinted: true }),
			slab(dict, 'features.organize.slab3', 'projects', 'shot.projects.alt'),
		],
		intro: introFor(dict, 'features.organize', 2),
		faqs: faqsFor(dict, 'features.organize', 3),
		dict,
		locale,
	}
}

export function buildEditorPage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['features.editor.eyebrow'],
		title: dict['features.editor.title'],
		subtitle: dict['features.editor.subtitle'],
		hero: shotFor('editor', dict['shot.editor.alt']),
		slabs: [
			slab(dict, 'features.editor.slab1', 'editor', 'shot.editor.alt'),
			slab(dict, 'features.editor.slab2', 'export', 'shot.export.alt', { reverse: true, tinted: true }),
		],
		intro: introFor(dict, 'features.editor', 2),
		faqs: faqsFor(dict, 'features.editor', 3),
		dict,
		locale,
	}
}

export function buildPlatformPage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['features.platform.eyebrow'],
		title: dict['features.platform.title'],
		subtitle: dict['features.platform.subtitle'],
		hero: shotFor('recorded/chat-workspace', dict['shot.recorded.answer.alt']),
		slabs: [
			slab(dict, 'features.platform.slab1', 'recorded/chat-answer', 'shot.recorded.answer.alt'),
			{
				eyebrow: dict['features.platform.slab2.eyebrow'],
				title: dict['features.platform.slab2.title'],
				desc: dict['features.platform.slab2.desc'],
				steps: [1, 2, 3].map((n) => ({
					title: dict[`features.platform.slab2.step${n}.title` as keyof Dictionary],
					desc: dict[`features.platform.slab2.step${n}.desc` as keyof Dictionary],
				})),
				reverse: true,
				tinted: true,
			},
		],
		intro: introFor(dict, 'features.platform', 2),
		faqs: faqsFor(dict, 'features.platform', 3),
		dict,
		locale,
	}
}

export function buildFeaturesHub(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['features.hub.eyebrow'],
		title: dict['features.hub.title'],
		subtitle: dict['features.hub.subtitle'],
		hero: shotFor('recorded/chat-workspace', dict['shot.recorded.answer.alt']),
		slabs: [
			{
				eyebrow: dict['features.capture.eyebrow'],
				title: dict['features.capture.title'],
				desc: dict['features.capture.hubdesc'],
				shot: shotFor('recorded/meeting-library', dict['shot.recorded.library.alt']),
				...hubLink(dict, '/features/capture', locale, 'nav.features.capture'),
			},
			{
				eyebrow: dict['features.organize.eyebrow'],
				title: dict['features.organize.title'],
				desc: dict['features.organize.hubdesc'],
				shot: shotFor('tasks', dict['shot.tasks.alt']),
				...hubLink(dict, '/features/organize', locale, 'nav.features.organize'),
				reverse: true,
				tinted: true,
			},
			{
				eyebrow: dict['features.editor.eyebrow'],
				title: dict['features.editor.title'],
				desc: dict['features.editor.hubdesc'],
				shot: shotFor('editor', dict['shot.editor.alt']),
				...hubLink(dict, '/features/editor', locale, 'nav.features.editor'),
			},
			{
				eyebrow: dict['features.platform.eyebrow'],
				title: dict['features.platform.title'],
				desc: dict['features.platform.hubdesc'],
				shot: shotFor('recorded/chat-workspace', dict['shot.recorded.answer.alt']),
				...hubLink(dict, '/features/platform', locale, 'nav.features.platform'),
				reverse: true,
				tinted: true,
			},
		],
		intro: introFor(dict, 'features.hub', 2),
		faqs: faqsFor(dict, 'features.hub', 3),
		dict,
		locale,
	}
}
