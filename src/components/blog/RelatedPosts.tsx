import { BlogCard } from '@growth-engine/sdk-client/components'
import type { BlogPost } from '@growth-engine/sdk-client'
import { localePrefix } from '@/lib/i18n-utils'
import { selectRelatedPosts } from '@/lib/related-posts'

interface RelatedPostsProps {
	posts: BlogPost[]
	currentSlug: string
	locale: string
	heading: string
}

/**
 * Replaces the SDK's `RelatedPosts`, which linked the same first three posts
 * from every post in the blog and left everything else with no inbound links.
 * The picking rules — and why one slot is reserved for link coverage rather
 * than relevance — live in `selectRelatedPosts`.
 *
 * Rendering stays identical to the SDK component (same `BlogCard`, same grid),
 * so this is a change to which posts are linked, not to how the section looks.
 */
export function RelatedPosts({ posts, currentSlug, locale, heading }: RelatedPostsProps) {
	const related = selectRelatedPosts(posts, currentSlug)
	if (related.length === 0) return null

	return (
		<aside aria-label={heading} className="mt-16">
			<h2 className="text-2xl font-bold mb-6">{heading}</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{related.map((post) => (
					<BlogCard
						key={post.slug}
						{...post}
						locale={locale}
						localePrefix={localePrefix(locale)}
					/>
				))}
			</div>
		</aside>
	)
}
