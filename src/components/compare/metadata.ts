import { buildPageMetadata } from '@/lib/seo'
import { buildUrl } from '@/lib/sitemap-shared'

export function comparisonMetadata(path: string, title: string, description: string) {
	const metadata = buildPageMetadata({ path, locale: 'en', title, description })
	return {
		...metadata,
		alternates: { ...metadata.alternates, languages: { en: buildUrl(path, 'en'), 'x-default': buildUrl(path, 'en') } },
	}
}
