import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { ProductPage } from '@/components/product/ProductPage'
import { buildFeaturesHub } from '@/components/product/features.config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({ path: '/features', locale, title: dict['features.hub.meta.title'], description: dict['features.hub.meta.desc'] })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return <ProductPage {...buildFeaturesHub(dict, locale)} />
}
