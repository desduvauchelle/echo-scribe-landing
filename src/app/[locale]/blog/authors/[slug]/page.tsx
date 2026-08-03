import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogAuthor, getAuthorPosts } from '@growth-engine/sdk-server'
import { BlogList } from '@growth-engine/sdk-client/components'
import { getDictionary } from '@/i18n'
import { getDb, safeQuery } from '@/lib/db'
import { localePrefix, localizedPath } from '@/lib/i18n-utils'
import { buildPageMetadata, composeMetaDescription } from '@/lib/seo'
import { buildUrl } from '@/lib/sitemap-shared'
import { CTA } from '@/components/landing/CTA'
import { Eyebrow } from '@/components/landing/Eyebrow'
import { ScrollReveal } from '@/components/landing/ScrollReveal'

export const revalidate = 300

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
	const { locale, slug } = await params
	const author = await safeQuery(null, () => getBlogAuthor(getDb(), slug))
	if (!author) return {}
	const dict = await getDictionary(locale)
	return buildPageMetadata({
		path: `/blog/authors/${slug}`,
		locale,
		title: author.name,
		// The bio is CMS-authored and often a single short line — too thin to fill
		// a search snippet on its own — so it is topped up with the author-page
		// blurb. A bio long enough to stand alone is used verbatim.
		description: composeMetaDescription(
			author.bio,
			dict['authors.detail.meta.description'].replace('{name}', author.name),
		),
		...(author.avatarUrl ? { image: author.avatarUrl } : {}),
		brand: false,
	})
}

export default async function AuthorDetailPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>
}) {
	const { locale, slug } = await params
	const dict = await getDictionary(locale)

	const author = await safeQuery(null, () => getBlogAuthor(getDb(), slug))
	if (!author) notFound()

	const posts = await safeQuery([], () => getAuthorPosts(getDb(), slug, { locale, limit: 0 }))

	const canonical = buildUrl(`/blog/authors/${slug}`, locale)
	const postCount =
		posts.length === 1
			? dict['authors.detail.posts.count.one']
			: dict['authors.detail.posts.count'].replace('{count}', String(posts.length))

	// Product discovery from a blog page: the same three destinations the /loops
	// page points at. Copy is shared deliberately — one wording per destination,
	// already translated. See `loops.explore.*` in the dictionaries.
	const explore = [
		{
			href: '/features/capture',
			label: dict['loops.explore.capture.label'],
			desc: dict['loops.explore.capture.desc'],
		},
		{
			href: '/features/organize',
			label: dict['loops.explore.organize.label'],
			desc: dict['loops.explore.organize.desc'],
		},
		{
			href: '/use-cases',
			label: dict['loops.explore.usecases.label'],
			desc: dict['loops.explore.usecases.desc'],
		},
	]

	return (
		<>
			{/*
			 * ProfilePage/Person — the author-entity signal Google reads for E-E-A-T
			 * (who wrote this, what else have they written). Post URLs use `slug`,
			 * matching the sitemap and each post's own canonical.
			 */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'ProfilePage',
						'@id': canonical,
						url: canonical,
						mainEntity: {
							'@type': 'Person',
							name: author.name,
							url: canonical,
							...(author.bio ? { description: author.bio } : {}),
							...(author.avatarUrl ? { image: author.avatarUrl } : {}),
							...(author.websiteUrl ? { sameAs: [author.websiteUrl] } : {}),
						},
						...(posts.length > 0
							? {
									hasPart: posts.map((post) => ({
										'@type': 'BlogPosting',
										headline: post.title,
										url: buildUrl(`/blog/${post.slug}`, locale),
										...(post.publishedAt
											? { datePublished: new Date(post.publishedAt).toISOString() }
											: {}),
									})),
								}
							: {}),
					}),
				}}
			/>

			{/* Author header */}
			<section className="border-b border-base-content/10 bg-base-100 py-16">
				<div className="container mx-auto max-w-[720px] px-6 text-center">
					<nav className="mb-8 text-left">
						<Link
							href={localizedPath('/blog/authors', locale)}
							className="text-sm text-primary hover:underline"
						>
							{dict['authors.back']}
						</Link>
					</nav>

					<ScrollReveal y={30}>
						{author.avatarUrl ? (
							<img
								src={author.avatarUrl}
								alt=""
								className="mx-auto mb-5 h-32 w-32 rounded-full object-cover"
							/>
						) : (
							<span className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full bg-base-300 text-5xl font-semibold text-base-content/80">
								{author.name.charAt(0).toUpperCase()}
							</span>
						)}

						<Eyebrow className="mb-4">{dict['authors.detail.eyebrow']}</Eyebrow>
						<h1 className="mb-3 text-[clamp(32px,5vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em]">
							{author.name}
						</h1>

						{author.bio && (
							<p className="mx-auto max-w-[54ch] text-[19px] leading-[1.6] text-base-content/70">
								{author.bio}
							</p>
						)}

						<div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-base-content/50">
							{posts.length > 0 && <span>{postCount}</span>}
							{author.websiteUrl && (
								<>
									{posts.length > 0 && <span aria-hidden="true">·</span>}
									<a
										href={author.websiteUrl}
										target="_blank"
										rel="noopener noreferrer me"
										className="text-primary hover:underline"
									>
										{dict['authors.website']} →
									</a>
								</>
							)}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* What they write about — the page's own indexable prose, not the bio */}
			<section className="border-b border-base-content/10 bg-base-200 py-16">
				<div className="container mx-auto max-w-[720px] px-6">
					<ScrollReveal y={30} className="flex flex-col gap-5">
						<h2 className="text-[clamp(24px,3.4vw,34px)] font-extrabold leading-[1.15] tracking-[-0.03em]">
							{dict['authors.detail.about.title'].replace('{name}', author.name)}
						</h2>
						<p className="text-[17px] leading-[1.75] text-base-content/75">
							{dict['authors.detail.about.body1'].replace('{name}', author.name)}
						</p>
						<p className="text-[17px] leading-[1.75] text-base-content/75">
							{dict['authors.detail.about.body2']}
						</p>
					</ScrollReveal>
				</div>
			</section>

			{/* Their posts */}
			<section className="border-b border-base-content/10 bg-base-100 py-16">
				<div className="container mx-auto max-w-[1080px] px-6">
					<h2 className="mb-8 text-[clamp(24px,3.4vw,34px)] font-extrabold leading-[1.15] tracking-[-0.03em]">
						{dict['authors.posts.heading'].replace('{name}', author.name)}
					</h2>

					{posts.length === 0 ? (
						<div className="py-12 text-base-content/50">
							<p className="text-lg">{dict['authors.posts.empty']}</p>
						</div>
					) : (
						<BlogList
							posts={posts}
							locale={locale}
							localePrefix={localePrefix(locale)}
							translations={{
								noPostsMessage: dict['authors.posts.empty'],
								clearSearchLabel: dict['blog.clear.search'],
								searchPlaceholder: dict['blog.search.placeholder'],
							}}
						/>
					)}
				</div>
			</section>

			{/* The product behind the blog — the reason a reader is here at all */}
			<section className="border-b border-base-content/10 bg-base-200 py-20">
				<div className="container mx-auto max-w-[1080px] px-6">
					<ScrollReveal y={30} className="mb-10 max-w-[640px]">
						<Eyebrow className="mb-5">{dict['authors.detail.explore.eyebrow']}</Eyebrow>
						<h2 className="mb-4 text-[clamp(26px,3.6vw,40px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
							{dict['authors.detail.explore.title']}
						</h2>
						<p className="text-[17px] leading-[1.75] text-base-content/75">
							{dict['authors.detail.explore.body']}
						</p>
					</ScrollReveal>
					<ScrollReveal y={20} stagger={0.08} className="grid gap-5 sm:grid-cols-3">
						{explore.map((item) => (
							<Link
								key={item.href}
								href={localizedPath(item.href, locale)}
								className="group rounded-[14px] border border-base-content/10 bg-base-100 p-6 transition-colors hover:border-primary/40"
							>
								<h3 className="mb-2 flex items-center gap-1.5 text-[18px] font-bold">
									{item.label}
									<span
										className="text-primary transition-transform group-hover:translate-x-0.5"
										aria-hidden="true"
									>
										→
									</span>
								</h3>
								<p className="text-[14px] leading-[1.6] text-base-content/70">{item.desc}</p>
							</Link>
						))}
					</ScrollReveal>
				</div>
			</section>

			<CTA dict={dict} />
		</>
	)
}
