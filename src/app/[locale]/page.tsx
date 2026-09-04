import { KeepAwake } from '@/components/landing/KeepAwake'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getBlogPosts } from '@growth-engine/sdk-server'
import { BlogCard } from '@growth-engine/sdk-client/components'
import { getDictionary } from '@/i18n'
import { getDb, safeQuery } from '@/lib/db'
import { localePrefix, localizedPath } from '@/lib/i18n-utils'
import { buildPageMetadata } from '@/lib/seo'
import { homeJsonLd } from '@/lib/structured-data'
import { JsonLd } from '@/components/seo/JsonLd'
import { Hero } from '@/components/landing/Hero'
import { WorkMemoryLoop } from '@/components/landing/WorkMemoryLoop'
import { Features } from '@/components/landing/Features'
import { UseCasesGrid } from '@/components/landing/UseCasesGrid'
import { PrivacyGrid } from '@/components/landing/PrivacyGrid'
import { CTA } from '@/components/landing/CTA'

export const revalidate = 60

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	// Canonical is the (locale-aware) site root — `buildPageMetadata` emits it
	// self-referencingly, so `/` never points anywhere but at itself.
	//
	// The title is branded like every other page (`… | Echo Scribe`) rather than
	// being a hand-written brand string. The homepage previously used
	// `brand: false` with the brand baked into each locale's value, which meant
	// every translation re-invented the branding AND ran 59–72 chars — past
	// Google's ~60-char cut in all eight languages, on the one page holding
	// position ~5.6 with a 0% click-through rate. One short descriptive value
	// plus the shared suffix keeps every locale inside the budget.
	return buildPageMetadata({
		path: '',
		locale,
		title: dict['home.meta.title'],
		description: dict['home.meta.description'],
	})
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const dict = await getDictionary(locale)
	const posts = await safeQuery([], () => getBlogPosts(getDb(), { locale, limit: 3 }))

	return (
		<>
			{/* Organization + WebSite + SoftwareApplication graph — the brand/product
			    entity search and answer engines resolve this site to. */}
			<JsonLd data={homeJsonLd(locale, dict)} />
			<Hero dict={dict} locale={locale} />
			<WorkMemoryLoop dict={dict} locale={locale} />
			<Features dict={dict} locale={locale} />
			<UseCasesGrid dict={dict} locale={locale} />
			<KeepAwake dict={dict} />
			<PrivacyGrid dict={dict} />

			<section className="py-20 bg-base-100 border-t border-base-content/10">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between mb-10">
						<h2 className="text-3xl font-bold">{dict['home.latest.blog']}</h2>
						<Link href={localizedPath('/blog', locale)} className="btn btn-ghost btn-sm">
							{dict['home.view.all']} →
						</Link>
					</div>

					{posts.length === 0 ? (
						<p className="text-center text-base-content/50 py-12">
							{dict['home.no.posts']}
						</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{posts.map((post) => (
								<BlogCard
									key={post.id}
									slug={post.slug}
									title={post.title}
									content={post.content}
									heroImageUrl={post.heroImageUrl}
									seoDesc={post.seoDesc}
									createdAt={post.createdAt}
									locale={locale}
									localePrefix={localePrefix(locale)}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			<CTA dict={dict} />
		</>
	)
}
