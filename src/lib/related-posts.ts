/**
 * The coverage guarantee under the related-articles block.
 *
 * Relevance ranking is the SDK's job now: `getRelatedPosts()` from
 * `@growth-engine/sdk-server` scores keyword and title overlap, fills any
 * shortfall with the newest posts, and returns 3–5 siblings. That ranking is
 * also what the seo-improvement loop re-runs, so the links it counts are links
 * that are really on the page — which is why nothing here re-ranks.
 *
 * What the ranking does NOT promise is an INBOUND link. It answers "what should
 * this post link to", never "does anything link to that post", and the two
 * come apart: a post nothing else resembles, and too old to win a newest-first
 * fallback slot, can be linked from nowhere. Measured on this blog at 31 posts
 * under the old SDK, three posts held 90 of 93 links and a crawl reported nine
 * `orphan_page` findings.
 *
 * One rule fixes that for good: one slot always goes to the post's SUCCESSOR in
 * canonical order, wrapping at the end. That threads a cycle through every
 * post, so every post has at least one inbound link regardless of its content —
 * and still does when the next post is published. Orphans stop being something
 * anyone has to remember to prevent.
 *
 * The topic hubs (`/blog/topic/<slug>`) are the other half: they link a post up
 * to its cluster. The cycle is what covers a post that belongs to no cluster.
 */

/** The fields this needs off a post. `BlogPost` satisfies it structurally. */
export interface RelatablePost {
	slug: string
}

/** How many of the slots the coverage cycle claims. The rest stay the SDK's. */
const CYCLE_SLOTS = 1

/**
 * The post's successor in canonical order, wrapping at the end.
 *
 * Null when the post is not in the list (a preview, or a locale mismatch):
 * there is no cycle to join, so there is no slot to take from relevance.
 *
 * `posts` must be the full post list in the SAME order everywhere this is
 * called — the cycle is only a cycle if every post agrees on its successor.
 */
export function coveragePost<T extends RelatablePost>(
	posts: T[],
	currentSlug: string,
): T | null {
	const index = posts.findIndex((p) => p.slug === currentSlug)
	if (index === -1) return null
	const successor = posts[(index + 1) % posts.length] ?? null
	return successor && successor.slug !== currentSlug ? successor : null
}

/**
 * The related-articles list as it is actually rendered: the SDK's ranking, plus
 * the coverage-cycle post when the ranking missed it.
 *
 * The cycle post REPLACES the weakest ranked slot rather than being added on
 * top, so the block keeps the 3–5 links the SDK's contract describes. Ordering
 * is deterministic: same posts in, same links out — a link graph that reshuffles
 * on every deploy is not a signal worth sending a crawler.
 */
export function withCoveragePost<T extends RelatablePost>(
	ranked: T[],
	posts: T[],
	currentSlug: string,
	max = 5,
): T[] {
	if (max <= 0) return []
	const cycle = coveragePost(posts, currentSlug)
	if (!cycle || ranked.some((p) => p.slug === cycle.slug)) return ranked.slice(0, max)
	return [...ranked.slice(0, Math.max(0, max - CYCLE_SLOTS)), cycle]
}
