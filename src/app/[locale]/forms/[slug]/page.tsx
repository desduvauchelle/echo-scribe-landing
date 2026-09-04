import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFormBySlug } from '@growth-engine/sdk-server'
import { FormRenderer } from '@growth-engine/sdk-client/components'
import { getDb, safeQuery } from '@/lib/db'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
	const { locale, slug } = await params
	const form = await safeQuery(null, () => getFormBySlug(getDb(), slug))
	if (!form) return {}
	return {
		...buildPageMetadata({
			path: `/forms/${slug}`,
			locale,
			title: form.name,
			description: form.description,
		}),
		// Scaffold infrastructure: nothing links here, it is not in the sitemap, and
		// `contact-form` — the one live form — was deliberately retired from /contact
		// in Aug 2026 after 0 submissions in 44 sessions. Left reachable so a future
		// form can be wired up quickly, but kept OUT of the index: an orphaned, thin,
		// zero-inbound-link page is exactly what Google files under "Crawled –
		// currently not indexed", and on a host with as little authority as this
		// subdomain, every such URL spends crawl budget that the blog needs. `follow`
		// stays on so any link equity passing through still flows.
		robots: { index: false, follow: true },
	}
}

export default async function DynamicFormPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>
}) {
	const { slug } = await params
	const form = await safeQuery(null, () => getFormBySlug(getDb(), slug))

	if (!form) notFound()

	return (
		<main className="container mx-auto px-4 py-12">
			<FormRenderer form={form} />
		</main>
	)
}
