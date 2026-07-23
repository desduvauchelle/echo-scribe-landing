import type { DictionaryKey } from '@/i18n'

export interface NavItem {
	path: string
	labelKey: DictionaryKey
}

export interface NavGroup {
	labelKey: DictionaryKey
	hubPath: string
	itemKeys: NavItem[]
}

export const FEATURE_GROUP: NavGroup = {
	labelKey: 'nav.features',
	hubPath: '/features',
	itemKeys: [
		{ path: '/features/capture', labelKey: 'nav.features.capture' },
		{ path: '/features/organize', labelKey: 'nav.features.organize' },
		{ path: '/features/editor', labelKey: 'nav.features.editor' },
		{ path: '/features/platform', labelKey: 'nav.features.platform' },
	],
}

export const USECASE_GROUP: NavGroup = {
	labelKey: 'nav.usecases',
	hubPath: '/use-cases',
	itemKeys: [
		{ path: '/use-cases/consultants', labelKey: 'nav.usecases.consultants' },
		{ path: '/use-cases/sales-teams', labelKey: 'nav.usecases.sales' },
		{ path: '/use-cases/founders', labelKey: 'nav.usecases.founders' },
		{ path: '/use-cases/students', labelKey: 'nav.usecases.students' },
	],
}

export const NAV_GROUPS: NavGroup[] = [FEATURE_GROUP, USECASE_GROUP]
