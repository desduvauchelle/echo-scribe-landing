/**
 * Brain stores `blog_posts.keywords` as a JSON-encoded string array, and
 * `getBlogPost()` from the SDK returns the raw database row — so `post.keywords`
 * on a post page is a STRING, not the `string[]` the name suggests.
 *
 * That only started mattering with SDK 0.1.100, which added `keywords` to the
 * `BlogPosting` JSON-LD `BlogContent` emits and does `keywords.join(', ')` on
 * whatever it is handed. Every post on this blog has keywords, so every post
 * page threw `keywords.join is not a function` during render and Next served
 * the error shell — HTTP 200, `<meta name="robots" content="noindex">`, no
 * article, no links. Search Console would have read that as the whole blog
 * going noindex overnight.
 *
 * So the post page normalises the field before handing the post to the SDK.
 * Parsing is defensive on purpose: older posts have `null`, and the value has
 * arrived as a bare comma-separated string.
 */
export function parseKeywords(raw: unknown): string[] {
	if (Array.isArray(raw)) return raw.filter((k): k is string => typeof k === 'string')
	if (typeof raw !== 'string') return []

	const trimmed = raw.trim()
	if (!trimmed) return []

	// A leading `[` or `{` means this was meant to be JSON. If it does not parse
	// — or parses to something that is not an array — the value is unreadable:
	// say so, rather than comma-splitting the broken JSON and emitting
	// `["unterminated` as one of the post's keywords.
	if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
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
