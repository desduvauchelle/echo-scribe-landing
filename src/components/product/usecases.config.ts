import type { Dictionary } from '@/i18n'
import type { ProductPageProps } from './ProductPage'
import { shotFor, slab } from './features.config'

export function buildConsultantsPage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['usecases.consultants.eyebrow'],
		title: dict['usecases.consultants.title'],
		subtitle: dict['usecases.consultants.subtitle'],
		hero: shotFor('meeting-hud', dict['shot.meeting-hud.alt']),
		slabs: [
			slab(dict, 'usecases.consultants.slab1', 'meeting-hud', 'shot.meeting-hud.alt'),
			slab(dict, 'usecases.consultants.slab2', 'chat', 'shot.chat.alt', { reverse: true, tinted: true }),
			slab(dict, 'usecases.consultants.slab3', 'meetings', 'shot.meetings.alt'),
		],
		dict,
		locale,
	}
}

export function buildSalesPage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['usecases.sales.eyebrow'],
		title: dict['usecases.sales.title'],
		subtitle: dict['usecases.sales.subtitle'],
		hero: shotFor('meeting-hud', dict['shot.meeting-hud.alt']),
		slabs: [
			slab(dict, 'usecases.sales.slab1', 'meeting-hud', 'shot.meeting-hud.alt'),
			slab(dict, 'usecases.sales.slab2', 'meetings', 'shot.meetings.alt', { reverse: true, tinted: true }),
			slab(dict, 'usecases.sales.slab3', 'chat', 'shot.chat.alt'),
		],
		dict,
		locale,
	}
}

export function buildFoundersPage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['usecases.founders.eyebrow'],
		title: dict['usecases.founders.title'],
		subtitle: dict['usecases.founders.subtitle'],
		hero: shotFor('dictation', dict['shot.dictation.alt']),
		slabs: [
			slab(dict, 'usecases.founders.slab1', 'dictation', 'shot.dictation.alt'),
			slab(dict, 'usecases.founders.slab2', 'screen-recorder', 'shot.screen-recorder.alt', { reverse: true, tinted: true }),
			slab(dict, 'usecases.founders.slab3', 'daily-summary', 'shot.daily-summary.alt'),
		],
		dict,
		locale,
	}
}

export function buildStudentsPage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['usecases.students.eyebrow'],
		title: dict['usecases.students.title'],
		subtitle: dict['usecases.students.subtitle'],
		hero: shotFor('meeting-hud', dict['shot.meeting-hud.alt']),
		slabs: [
			slab(dict, 'usecases.students.slab1', 'meeting-hud', 'shot.meeting-hud.alt'),
			slab(dict, 'usecases.students.slab2', 'chat', 'shot.chat.alt', { reverse: true, tinted: true }),
			slab(dict, 'usecases.students.slab3', 'projects', 'shot.projects.alt'),
		],
		dict,
		locale,
	}
}

export function buildUseCasesHub(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['usecases.hub.eyebrow'],
		title: dict['usecases.hub.title'],
		subtitle: dict['usecases.hub.subtitle'],
		hero: shotFor('meeting-hud', dict['shot.meeting-hud.alt']),
		slabs: [
			{
				eyebrow: dict['usecases.consultants.eyebrow'],
				title: dict['usecases.consultants.title'],
				desc: dict['usecases.consultants.subtitle'],
				shot: shotFor('meeting-hud', dict['shot.meeting-hud.alt']),
			},
			{
				eyebrow: dict['usecases.sales.eyebrow'],
				title: dict['usecases.sales.title'],
				desc: dict['usecases.sales.subtitle'],
				shot: shotFor('meetings', dict['shot.meetings.alt']),
				reverse: true,
				tinted: true,
			},
			{
				eyebrow: dict['usecases.founders.eyebrow'],
				title: dict['usecases.founders.title'],
				desc: dict['usecases.founders.subtitle'],
				shot: shotFor('dictation', dict['shot.dictation.alt']),
			},
			{
				eyebrow: dict['usecases.students.eyebrow'],
				title: dict['usecases.students.title'],
				desc: dict['usecases.students.subtitle'],
				shot: shotFor('projects', dict['shot.projects.alt']),
				reverse: true,
				tinted: true,
			},
		],
		dict,
		locale,
	}
}
