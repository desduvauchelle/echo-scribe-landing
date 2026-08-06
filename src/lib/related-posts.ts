/**
 * Which posts does a blog post link out to?
 *
 * The SDK's `RelatedPosts` does `posts.filter(p => p.slug !== currentSlug).slice(0, 3)`
 * — literally the same first three posts at the bottom of every post in the
 * blog. Measured on this site at 31 posts: three posts collected 30 inbound
 * links each and the other 26 got zero, so most of the blog was reachable only
 * through hand-written "Related reading" links in the post bodies — two to
 * three clicks deep with a single inbound link each. A crawl flagged nine of
 * them as orphan pages (`orphan_page`), and one post really was orphaned.
 *
 * So the selection here has two jobs, and the first one is not editorial:
 *
 *   1. **Coverage.** One slot is always the post's successor in canonical
 *      order, wrapping at the end. That single rule threads a cycle through
 *      EVERY post, so every post has at least one inbound link regardless of
 *      what its content looks like — and still does when post 32 is published.
 *      Orphans stop being something anyone has to remember to prevent.
 *   2. **Relevance.** The remaining slots go to the highest keyword/title
 *      overlap, so the links are also worth clicking.
 *
 * Ordering is deterministic: same posts in, same links out. A link graph that
 * reshuffles on every deploy is not a signal we want to send a crawler.
 */

/** The fields this needs off a post. `BlogPost` satisfies it structurally. */
export interface RelatablePost {
	slug: string
	title: string
	/**
	 * Brain stores this as a JSON-encoded string array, but it is `null` on
	 * older posts and has arrived as a bare comma-separated string. Parsed
	 * defensively — a post with unreadable keywords still ranks on its title.
	 */
	keywords?: unknown
}

/** How many of the slots the coverage cycle claims. The rest rank on overlap. */
const CYCLE_SLOTS = 1

const KEYWORD_WEIGHT = 3
const TITLE_WEIGHT = 1

/**
 * Tokens too common in this blog's titles and keyword sets to carry signal.
 * Deliberately short: product words that look generic in isolation — `mac`,
 * `local`, `offline`, `private`, `voice` — are exactly the axes posts here
 * differ on, so they stay in.
 */
const STOPWORDS = new Set([
	'the', 'and', 'for', 'you', 'your', 'with', 'without', 'from', 'that',
	'this', 'what', 'when', 'why', 'how', 'not', 'but', 'are', 'was', 'can',
	'get', 'got', 'out', 'off', 'into', 'onto', 'over', 'than', 'then', 'all',
	'any', 'own', 'its', 'has', 'have', 'they', 'them', 'their', 'about',
])

const MIN_TOKEN_LENGTH = 3

interface Profile {
	keywords: Set<string>
	title: Set<string>
}

const EMPTY_PROFILE: Profile = { keywords: new Set(), title: new Set() }

export function tokenize(text: string): Set<string> {
	const tokens = text
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((t) => t.length >= MIN_TOKEN_LENGTH && !STOPWORDS.has(t))
	return new Set(tokens)
}

export function parseKeywords(raw: unknown): string[] {
	if (Array.isArray(raw)) return raw.filter((k): k is string => typeof k === 'string')
	if (typeof raw !== 'string') return []

	const trimmed = raw.trim()
	if (!trimmed) return []

	// A leading `[` means this was meant to be the JSON array. If it does not
	// parse, the value is unreadable — say so rather than comma-splitting the
	// broken JSON and scoring `["unterminated` as one of the post's keywords.
	if (trimmed.startsWith('[')) {
		try {
			const parsed: unknown = JSON.parse(trimmed)
			return Array.isArray(parsed)
				? parsed.filter((k): k is string => typeof k === 'string')
				: []
		} catch {
			return []
		}
	}

	return trimmed
		.split(',')
		.map((k) => k.trim())
		.filter(Boolean)
}

function profile(post: RelatablePost): Profile {
	return {
		keywords: tokenize(parseKeywords(post.keywords).join(' ')),
		title: tokenize(post.title),
	}
}

function overlap(a: Set<string>, b: Set<string>): number {
	let shared = 0
	for (const token of a) if (b.has(token)) shared++
	return shared
}

function similarity(a: Profile, b: Profile): number {
	return (
		overlap(a.keywords, b.keywords) * KEYWORD_WEIGHT +
		overlap(a.title, b.title) * TITLE_WEIGHT
	)
}

/**
 * Pick the posts to link from `currentSlug`, most relevant first with the
 * coverage-cycle post last.
 *
 * `posts` must be the full post list in the SAME order on every page that
 * calls this (both callers pass `getBlogPosts(db, { locale, limit: 0 })`) —
 * the cycle is only a cycle if every post agrees on who its successor is.
 */
export function selectRelatedPosts<T extends RelatablePost>(
	posts: T[],
	currentSlug: string,
	count = 3,
): T[] {
	if (count <= 0) return []

	const others = posts.filter((p) => p.slug !== currentSlug)
	if (others.length <= count) return others

	const index = posts.findIndex((p) => p.slug === currentSlug)

	// The coverage guarantee. `index === -1` means the current post is not in
	// the list (a preview, or a locale mismatch) — there is no cycle to join,
	// so give the slot back to relevance rather than linking something random.
	const successor = index === -1 ? null : (posts[(index + 1) % posts.length] ?? null)
	const cycle = successor && successor.slug !== currentSlug ? successor : null

	const current = index === -1 ? EMPTY_PROFILE : profile(posts[index]!)
	const relevantSlots = cycle ? count - CYCLE_SLOTS : count

	const relevant = others
		.filter((p) => p.slug !== cycle?.slug)
		.map((post, order) => ({ post, order, score: similarity(current, profile(post)) }))
		// Ties break on canonical order, so the output is stable between builds.
		.sort((a, b) => b.score - a.score || a.order - b.order)
		.slice(0, relevantSlots)
		.map((scored) => scored.post)

	return cycle ? [...relevant, cycle] : relevant
}
