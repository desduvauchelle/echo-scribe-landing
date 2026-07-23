import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { ProductPage } from '@/components/product/ProductPage'
import { buildEditorPage } from '@/components/product/features.config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({ path: '/features/editor', locale, title: dict['features.editor.title'], description: dict['features.editor.meta.desc'] })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return <ProductPage {...buildEditorPage(dict, locale)} />
}
