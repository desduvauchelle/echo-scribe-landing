import { notFound, redirect } from 'next/navigation'
import { getDictionary } from '@/i18n'
import { ComparisonPage } from '@/components/compare/ComparisonPage'
import { getComparison } from '@/components/compare/comparisons'
import { comparisonMetadata } from '@/components/compare/metadata'
import { localizedPath } from '@/lib/i18n-utils'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const comparison = getComparison(slug)
	if (!comparison) notFound()
	return comparisonMetadata(`/compare/${slug}`, `Tucky vs ${comparison.name}: Features & Privacy`, `Compare Tucky and ${comparison.name}: features, privacy, local processing, and free plans. Find the right fit and install Tucky free on your Mac.`)
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await params
	const comparison = getComparison(slug)
	if (!comparison) notFound()
	if (locale !== 'en') redirect(localizedPath(`/compare/${slug}`, 'en'))
	return <ComparisonPage comparison={comparison} dict={await getDictionary('en')} />
}
