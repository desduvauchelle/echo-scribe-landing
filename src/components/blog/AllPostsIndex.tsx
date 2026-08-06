import Link from 'next/link'
import type { BlogPost } from '@growth-engine/sdk-client'
import { formatDate, localizedPath } from '@/lib/i18n-utils'

interface AllPostsIndexProps {
	posts: BlogPost[]
	locale: string
	heading: string
	description: string
}

/**
 * Every post, as one server-rendered link each.
 *
 * `BlogList` paginates with `<button onClick={setPage}>` — there is no `<a>`
 * and no page-2 URL (`/blog?page=2` serves the same nine posts), so a crawler
 * reading `/blog` sees the first nine posts of the blog and nothing else. At
 * 31 posts that left 22 with no link from the index at all, which is how nine
 * of them ended up flagged as orphan pages.
 *
 * This sits below the grid and is the crawlable half of the index: no
 * pagination, no client state, every post one click from `/blog`. It grows a
 * row per post, which is the point — a new post is linked the moment it is
 * published, with nothing to remember.
 */
export function AllPostsIndex({ posts, locale, heading, description }: AllPostsIndexProps) {
	if (posts.length === 0) return null

	return (
		<nav aria-labelledby="all-posts-heading" className="mt-16 border-t border-base-content/10 pt-10">
			<h2 id="all-posts-heading" className="text-2xl font-bold mb-1">
				{heading}
			</h2>
			<p className="text-sm text-base-content/60 mb-6">{description}</p>

			<ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
				{posts.map((post) => (
					<li key={post.slug}>
						<Link
							href={localizedPath(`/blog/${post.slug}`, locale)}
							className="group flex items-baseline justify-between gap-4 rounded-md py-2 transition-colors hover:bg-base-200"
						>
							<span className="text-[15px] leading-snug group-hover:text-primary">
								{post.title}
							</span>
							<time
								dateTime={new Date(post.createdAt).toISOString()}
								className="shrink-0 text-xs tabular-nums text-base-content/40"
							>
								{formatDate(post.createdAt, locale)}
							</time>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}
