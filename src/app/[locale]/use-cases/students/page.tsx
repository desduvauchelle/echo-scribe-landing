import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { ProductPage } from '@/components/product/ProductPage'
import { buildStudentsPage } from '@/components/product/usecases.config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({ path: '/use-cases/students', locale, title: dict['usecases.students.meta.title'], description: dict['usecases.students.meta.desc'] })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return <ProductPage {...buildStudentsPage(dict, locale)} />
}
