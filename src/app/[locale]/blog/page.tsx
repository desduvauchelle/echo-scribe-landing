import type { Metadata } from 'next'
import { getBlogPosts, getBlogAuthors } from '@growth-engine/sdk-server'
import { BlogList } from '@growth-engine/sdk-client/components'
import { getDictionary } from '@/i18n'
import { getDb, safeQuery } from '@/lib/db'
import { localePrefix } from '@/lib/i18n-utils'
import { buildPageMetadata } from '@/lib/seo'
import { breadcrumbLd } from '@/lib/structured-data'
import { JsonLd } from '@/components/seo/JsonLd'
import { AuthorChips } from '@/components/blog/AuthorChips'
import { AllPostsIndex } from '@/components/blog/AllPostsIndex'

export const revalidate = 60

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({
		path: '/blog',
		locale,
		title: dict['blog.heading'],
		description: dict['blog.meta.description'],
		brand: false,
	})
}

export default async function BlogPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const dict = await getDictionary(locale)

	const [posts, authors] = await Promise.all([
		safeQuery([], () => getBlogPosts(getDb(), { locale, limit: 0 })),
		safeQuery([], () => getBlogAuthors(getDb())),
	])

	return (
		<main className="container mx-auto px-4 py-12">
			<JsonLd
				data={breadcrumbLd(
					[
						{ name: dict['nav.home'], path: '' },
						{ name: dict['nav.blog'], path: '/blog' },
					],
					locale,
				)}
			/>
			<h1 className="text-4xl font-bold text-center mb-2">{dict['blog.heading']}</h1>
			<p className="text-center text-base-content/60 mb-10">
				{dict['blog.subtitle']}
			</p>

			<AuthorChips
				authors={authors}
				locale={locale}
				label={dict['blog.filter.by.author']}
			/>

			<BlogList
				posts={posts}
				locale={locale}
				localePrefix={localePrefix(locale)}
				authors={authors}
				translations={{
					noPostsMessage: dict['blog.no.posts'],
					clearSearchLabel: dict['blog.clear.search'],
					searchPlaceholder: dict['blog.search.placeholder'],
				}}
			/>

			{/*
			 * `BlogList` above paginates client-side, so only its first page is in
			 * the HTML. This is the crawlable index of the rest — see AllPostsIndex.
			 */}
			<AllPostsIndex
				posts={posts}
				locale={locale}
				heading={dict['blog.index.heading']}
				description={dict['blog.index.description']}
			/>
		</main>
	)
}
