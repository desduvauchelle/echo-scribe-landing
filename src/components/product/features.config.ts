import type { Dictionary } from '@/i18n'
import type { ProductPageProps, Slab } from './ProductPage'
import type { Shot } from './ScreenshotFrame'

const S = '/screenshots'

function shotFor(src: string, alt: string): Shot {
	return { src: `${S}/${src}.png`, alt }
}

function slab(
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
		hero: shotFor('meeting-hud', dict['shot.meeting-hud.alt']),
		slabs: [
			slab(dict, 'features.capture.slab1', 'meeting-hud', 'shot.meeting-hud.alt'),
			slab(dict, 'features.capture.slab2', 'screen-recorder', 'shot.screen-recorder.alt', { reverse: true, tinted: true }),
			slab(dict, 'features.capture.slab3', 'dictation', 'shot.dictation.alt'),
		],
		dict,
		locale,
	}
}

export function buildOrganizePage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['features.organize.eyebrow'],
		title: dict['features.organize.title'],
		subtitle: dict['features.organize.subtitle'],
		hero: shotFor('meetings', dict['shot.meetings.alt']),
		slabs: [
			slab(dict, 'features.organize.slab1', 'chat', 'shot.chat.alt'),
			slab(dict, 'features.organize.slab2', 'daily-summary', 'shot.daily-summary.alt', { reverse: true, tinted: true }),
			slab(dict, 'features.organize.slab3', 'projects', 'shot.projects.alt'),
		],
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
		dict,
		locale,
	}
}

export function buildPlatformPage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['features.platform.eyebrow'],
		title: dict['features.platform.title'],
		subtitle: dict['features.platform.subtitle'],
		hero: shotFor('settings', dict['shot.settings.alt']),
		slabs: [
			slab(dict, 'features.platform.slab1', 'settings', 'shot.settings.alt'),
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
		dict,
		locale,
	}
}

export function buildFeaturesHub(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['features.hub.eyebrow'],
		title: dict['features.hub.title'],
		subtitle: dict['features.hub.subtitle'],
		hero: shotFor('dashboard', dict['shot.dashboard.alt']),
		slabs: [
			{
				eyebrow: dict['features.capture.eyebrow'],
				title: dict['features.capture.title'],
				desc: dict['features.capture.subtitle'],
				shot: shotFor('meeting-hud', dict['shot.meeting-hud.alt']),
			},
			{
				eyebrow: dict['features.organize.eyebrow'],
				title: dict['features.organize.title'],
				desc: dict['features.organize.subtitle'],
				shot: shotFor('tasks', dict['shot.tasks.alt']),
				reverse: true,
				tinted: true,
			},
			{
				eyebrow: dict['features.editor.eyebrow'],
				title: dict['features.editor.title'],
				desc: dict['features.editor.subtitle'],
				shot: shotFor('editor', dict['shot.editor.alt']),
			},
			{
				eyebrow: dict['features.platform.eyebrow'],
				title: dict['features.platform.title'],
				desc: dict['features.platform.subtitle'],
				shot: shotFor('settings', dict['shot.settings.alt']),
				reverse: true,
				tinted: true,
			},
		],
		dict,
		locale,
	}
}
