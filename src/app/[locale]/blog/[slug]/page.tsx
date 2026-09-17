import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
	getBlogPost,
	getBlogPosts,
	getBlogAuthorById,
	getBlogTopicsForPost,
	getBusinessConfig,
	getRelatedPosts,
} from '@growth-engine/sdk-server'
import { BlogContent, RelatedArticles, TopicChips } from '@growth-engine/sdk-client/components'
import { getDictionary } from '@/i18n'
import { getDb, safeQuery } from '@/lib/db'
import { formatDate, localePrefix, localizedPath } from '@/lib/i18n-utils'
import { buildUrl } from '@/lib/sitemap-shared'
import { buildPageMetadata } from '@/lib/seo'
import { AuthorByline } from '@/components/blog/AuthorByline'
import { withCoveragePost } from '@/lib/related-posts'
import { parseKeywords } from '@/lib/post-keywords'

export const revalidate = 120

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
	const { locale, slug } = await params
	const post = await safeQuery(null, () => getBlogPost(getDb(), slug, locale))
	if (!post) return {}
	return buildPageMetadata({
		path: `/blog/${slug}`,
		locale,
		title: post.seoTitle ?? post.title,
		description: post.seoDesc,
		image: post.heroImageUrl,
		type: 'article',
		brand: false,
	})
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>
}) {
	const { locale, slug } = await params
	const dict = await getDictionary(locale)

	const post = await safeQuery(null, () => getBlogPost(getDb(), slug, locale))
	if (!post) notFound()

	// The structural internal links, both computed by the SDK from stored data
	// — deterministic, nothing to curate. `relatedPosts` links this post
	// sideways to 3–5 siblings; `topics` links it up to its pillar page(s).
	// `allPosts` is only here for the coverage cycle — see `withCoveragePost`.
	const [relatedPosts, topics, allPosts, author, business] = await Promise.all([
		safeQuery([], () => getRelatedPosts(getDb(), post, { locale })),
		safeQuery([], () => getBlogTopicsForPost(getDb(), post)),
		safeQuery([], () => getBlogPosts(getDb(), { locale, limit: 0 })),
		post.authorId
			? safeQuery(null, () => getBlogAuthorById(getDb(), post.authorId!))
			: Promise.resolve(null),
		safeQuery(null, () => getBusinessConfig(getDb())),
	])

	const date = formatDate(post.createdAt, locale)

	return (
		<main className="container mx-auto px-4 py-12">
			<nav className="mb-8">
				<Link href={localizedPath('/blog', locale)} className="text-sm text-primary hover:underline">
					← {dict['blog.back']}
				</Link>
			</nav>

			<article className="max-w-3xl mx-auto">
				{post.heroImageUrl && (
					<figure className="aspect-video overflow-hidden rounded-xl mb-8">
						<img
							src={post.heroImageUrl}
							alt={post.title}
							className="w-full h-full object-cover"
						/>
					</figure>
				)}

				<time className="text-sm text-base-content/50">{date}</time>
				<h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>

				{author && (
					<div className="mb-8">
						<AuthorByline author={author} locale={locale} />
					</div>
				)}

				{/*
				 * `post.keywords` is the raw database column — a JSON string, not
				 * the `string[]` the name promises — and SDK 0.1.100's BlogPosting
				 * JSON-LD calls `.join()` on it. Normalise it here or every post
				 * page renders Next's error shell instead of the article. See
				 * `parseKeywords`.
				 */}
				<BlogContent
					html={post.content}
					post={{ ...post, keywords: parseKeywords(post.keywords) }}
					canonicalUrl={buildUrl(`/blog/${slug}`, locale)}
					{...(author ? { author } : {})}
					{...(business ? { business } : {})}
				/>

				<TopicChips
					topics={topics}
					locale={locale}
					localePrefix={localePrefix(locale)}
					label={dict['blog.filed.under']}
					showCounts={false}
					className="mt-10"
				/>
			</article>

			<div className="max-w-5xl mx-auto">
				{/*
				 * No `cta` on purpose. `getBookingCallToAction()` would resolve to
				 * the retired `contact-form` (0 submissions in 44 sessions, and
				 * `noindex` since), and Tucky is a free one-line install with
				 * nothing to ask us for first — see "Adoption path" in CLAUDE.md.
				 * Omitting the prop hides the slot; it does not render an empty one.
				 */}
				<RelatedArticles
					posts={withCoveragePost(relatedPosts, allPosts, slug)}
					locale={locale}
					localePrefix={localePrefix(locale)}
					heading={dict['blog.related.posts']}
				/>
			</div>
		</main>
	)
}
