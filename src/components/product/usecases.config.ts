import type { Dictionary } from '@/i18n'
import type { ProductPageProps } from './ProductPage'
import { faqsFor, hubLink, introFor, shotFor, slab } from './features.config'

export function buildConsultantsPage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['usecases.consultants.eyebrow'],
		title: dict['usecases.consultants.title'],
		subtitle: dict['usecases.consultants.subtitle'],
		hero: shotFor('recorded/meeting-library', dict['shot.recorded.library.alt']),
		slabs: [
			slab(dict, 'usecases.consultants.slab1', 'recorded/meeting-summary', 'shot.recorded.summary.alt'),
			slab(dict, 'usecases.consultants.slab2', 'recorded/chat-answer', 'shot.recorded.answer.alt', { reverse: true, tinted: true }),
			slab(dict, 'usecases.consultants.slab3', 'recorded/meeting-summary', 'shot.recorded.summary.alt'),
		],
		intro: introFor(dict, 'usecases.consultants', 2),
		faqs: faqsFor(dict, 'usecases.consultants', 3),
		breadcrumbs: [
			{ name: dict['nav.home'], path: '' },
			{ name: dict['nav.usecases'], path: '/use-cases' },
			{ name: dict['nav.usecases.consultants'], path: '/use-cases/consultants' },
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
		hero: shotFor('recorded/meeting-library', dict['shot.recorded.library.alt']),
		slabs: [
			slab(dict, 'usecases.sales.slab1', 'recorded/coaching-feedback', 'shot.recorded.feedback.alt'),
			slab(dict, 'usecases.sales.slab2', 'recorded/meeting-summary', 'shot.recorded.summary.alt', { reverse: true, tinted: true }),
			slab(dict, 'usecases.sales.slab3', 'recorded/chat-answer', 'shot.recorded.answer.alt'),
		],
		intro: introFor(dict, 'usecases.sales', 2),
		faqs: faqsFor(dict, 'usecases.sales', 3),
		breadcrumbs: [
			{ name: dict['nav.home'], path: '' },
			{ name: dict['nav.usecases'], path: '/use-cases' },
			{ name: dict['nav.usecases.sales'], path: '/use-cases/sales-teams' },
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
		hero: shotFor('recorded/recording-preview', dict['shot.recorded.recording.alt']),
		slabs: [
			slab(dict, 'usecases.founders.slab1', 'dictation', 'shot.dictation.alt'),
			slab(dict, 'usecases.founders.slab2', 'recorded/recording-preview', 'shot.recorded.recording.alt', { reverse: true, tinted: true }),
			slab(dict, 'usecases.founders.slab3', 'daily-summary', 'shot.daily-summary.alt'),
		],
		intro: introFor(dict, 'usecases.founders', 2),
		faqs: faqsFor(dict, 'usecases.founders', 3),
		breadcrumbs: [
			{ name: dict['nav.home'], path: '' },
			{ name: dict['nav.usecases'], path: '/use-cases' },
			{ name: dict['nav.usecases.founders'], path: '/use-cases/founders' },
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
		hero: shotFor('recorded/meeting-library', dict['shot.recorded.library.alt']),
		slabs: [
			slab(dict, 'usecases.students.slab1', 'meeting-hud', 'shot.meeting-hud.alt'),
			slab(dict, 'usecases.students.slab2', 'recorded/chat-answer', 'shot.recorded.answer.alt', { reverse: true, tinted: true }),
			slab(dict, 'usecases.students.slab3', 'projects', 'shot.projects.alt'),
		],
		intro: introFor(dict, 'usecases.students', 2),
		faqs: faqsFor(dict, 'usecases.students', 3),
		breadcrumbs: [
			{ name: dict['nav.home'], path: '' },
			{ name: dict['nav.usecases'], path: '/use-cases' },
			{ name: dict['nav.usecases.students'], path: '/use-cases/students' },
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
		hero: shotFor('recorded/meeting-library', dict['shot.recorded.library.alt']),
		slabs: [
			{
				eyebrow: dict['usecases.consultants.eyebrow'],
				title: dict['usecases.consultants.title'],
				desc: dict['usecases.consultants.hubdesc'],
				shot: shotFor('recorded/meeting-summary', dict['shot.recorded.summary.alt']),
				...hubLink(dict, '/use-cases/consultants', locale, 'usecases.consultants.explorelink', { verbatim: true }),
			},
			{
				eyebrow: dict['usecases.sales.eyebrow'],
				title: dict['usecases.sales.title'],
				desc: dict['usecases.sales.hubdesc'],
				shot: shotFor('recorded/meeting-library', dict['shot.recorded.library.alt']),
				...hubLink(dict, '/use-cases/sales-teams', locale, 'usecases.sales.explorelink', { verbatim: true }),
				reverse: true,
				tinted: true,
			},
			{
				eyebrow: dict['usecases.founders.eyebrow'],
				title: dict['usecases.founders.title'],
				desc: dict['usecases.founders.hubdesc'],
				shot: shotFor('recorded/recording-preview', dict['shot.recorded.recording.alt']),
				...hubLink(dict, '/use-cases/founders', locale, 'usecases.founders.explorelink', { verbatim: true }),
			},
			{
				eyebrow: dict['usecases.students.eyebrow'],
				title: dict['usecases.students.title'],
				desc: dict['usecases.students.hubdesc'],
				shot: shotFor('projects', dict['shot.projects.alt']),
				...hubLink(dict, '/use-cases/students', locale, 'usecases.students.explorelink', { verbatim: true }),
				reverse: true,
				tinted: true,
			},
		],
		intro: introFor(dict, 'usecases.hub', 2),
		faqs: faqsFor(dict, 'usecases.hub', 3),
		breadcrumbs: [
			{ name: dict['nav.home'], path: '' },
			{ name: dict['nav.usecases'], path: '/use-cases' },
		],
		dict,
		locale,
	}
}
