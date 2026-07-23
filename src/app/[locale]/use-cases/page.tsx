import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { ProductPage } from '@/components/product/ProductPage'
import { buildUseCasesHub } from '@/components/product/usecases.config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({ path: '/use-cases', locale, title: dict['usecases.hub.title'], description: dict['usecases.hub.meta.desc'] })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return <ProductPage {...buildUseCasesHub(dict, locale)} />
}
