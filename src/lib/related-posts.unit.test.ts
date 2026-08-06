import { describe, it, expect } from 'vitest'
import { selectRelatedPosts, parseKeywords, tokenize } from './related-posts'
import type { RelatablePost } from './related-posts'

function makePosts(n: number): RelatablePost[] {
	return Array.from({ length: n }, (_, i) => ({
		slug: `post-${i}`,
		title: `Post ${i}`,
		keywords: null,
	}))
}

describe('parseKeywords', () => {
	it('reads the JSON-encoded string array Brain stores', () => {
		expect(parseKeywords('["local whisper mac","offline voice notes"]')).toEqual([
			'local whisper mac',
			'offline voice notes',
		])
	})

	it('reads a plain array', () => {
		expect(parseKeywords(['a', 'b'])).toEqual(['a', 'b'])
	})

	it('reads a bare comma-separated string', () => {
		expect(parseKeywords('local whisper, offline notes')).toEqual([
			'local whisper',
			'offline notes',
		])
	})

	it('returns nothing for null, empty, or malformed input', () => {
		expect(parseKeywords(null)).toEqual([])
		expect(parseKeywords(undefined)).toEqual([])
		expect(parseKeywords('')).toEqual([])
		expect(parseKeywords('   ')).toEqual([])
		expect(parseKeywords('["unterminated')).toEqual([])
		expect(parseKeywords(42)).toEqual([])
	})

	it('drops non-string members rather than throwing', () => {
		expect(parseKeywords('["ok", 3, null]')).toEqual(['ok'])
	})
})

describe('tokenize', () => {
	it('drops stopwords and tokens under three characters', () => {
		expect([...tokenize('How to Get the Best AI on a Mac')]).toEqual(['best', 'mac'])
	})

	it('keeps the product words posts here actually differ on', () => {
		const tokens = tokenize('Local offline private voice transcription')
		for (const word of ['local', 'offline', 'private', 'voice', 'transcription']) {
			expect(tokens.has(word)).toBe(true)
		}
	})
})

describe('selectRelatedPosts', () => {
	it('returns the requested number of posts and never the current one', () => {
		const posts = makePosts(10)
		const related = selectRelatedPosts(posts, 'post-4')
		expect(related).toHaveLength(3)
		expect(related.map((p) => p.slug)).not.toContain('post-4')
	})

	it('returns unique posts', () => {
		const posts = makePosts(10)
		const slugs = selectRelatedPosts(posts, 'post-0').map((p) => p.slug)
		expect(new Set(slugs).size).toBe(slugs.length)
	})

	/**
	 * The regression this file exists for. The SDK component returned the same
	 * three posts from every post, which is what orphaned most of the blog.
	 */
	it('leaves no post without an inbound link', () => {
		const posts = makePosts(31)
		const inbound = new Map(posts.map((p) => [p.slug, 0]))

		for (const post of posts) {
			for (const related of selectRelatedPosts(posts, post.slug)) {
				inbound.set(related.slug, (inbound.get(related.slug) ?? 0) + 1)
			}
		}

		const orphans = [...inbound].filter(([, count]) => count === 0).map(([slug]) => slug)
		expect(orphans).toEqual([])
	})

	it('holds that guarantee when posts share no keywords at all', () => {
		const posts = Array.from({ length: 12 }, (_, i) => ({
			slug: `post-${i}`,
			title: `Wholly Unrelated Subject Number ${i}`,
			keywords: null,
		}))

		const inbound = new Set<string>()
		for (const post of posts) {
			for (const related of selectRelatedPosts(posts, post.slug)) inbound.add(related.slug)
		}

		expect(inbound.size).toBe(posts.length)
	})

	it('links the successor in canonical order, wrapping at the end', () => {
		const posts = makePosts(10)
		expect(selectRelatedPosts(posts, 'post-3').map((p) => p.slug)).toContain('post-4')
		expect(selectRelatedPosts(posts, 'post-9').map((p) => p.slug)).toContain('post-0')
	})

	it('ranks a keyword match above an unrelated post', () => {
		const posts: RelatablePost[] = [
			{ slug: 'current', title: 'Dictating on a Mac', keywords: '["voice dictation mac"]' },
			{ slug: 'unrelated-a', title: 'Quarterly Pricing Notes', keywords: '["pricing"]' },
			{ slug: 'unrelated-b', title: 'Quarterly Hiring Notes', keywords: '["hiring"]' },
			{ slug: 'unrelated-c', title: 'Quarterly Roadmap Notes', keywords: '["roadmap"]' },
			{ slug: 'match', title: 'More Dictation Tricks', keywords: '["voice dictation mac"]' },
		]

		// `unrelated-a` is the cycle slot, so relevance owns the rest.
		expect(selectRelatedPosts(posts, 'current')[0]?.slug).toBe('match')
	})

	it('falls back to titles when keywords are missing', () => {
		const posts: RelatablePost[] = [
			{ slug: 'current', title: 'Offline transcription on a Mac', keywords: null },
			{ slug: 'filler-a', title: 'Pricing update', keywords: null },
			{ slug: 'filler-b', title: 'Hiring update', keywords: null },
			{ slug: 'filler-c', title: 'Roadmap update', keywords: null },
			{ slug: 'match', title: 'Offline transcription quality', keywords: null },
		]

		expect(selectRelatedPosts(posts, 'current')[0]?.slug).toBe('match')
	})

	it('is deterministic across calls', () => {
		const posts = makePosts(20)
		const first = selectRelatedPosts(posts, 'post-7').map((p) => p.slug)
		const second = selectRelatedPosts(posts, 'post-7').map((p) => p.slug)
		expect(first).toEqual(second)
	})

	it('handles blogs smaller than the slot count', () => {
		expect(selectRelatedPosts(makePosts(1), 'post-0')).toEqual([])
		expect(selectRelatedPosts(makePosts(3), 'post-0').map((p) => p.slug)).toEqual([
			'post-1',
			'post-2',
		])
		expect(selectRelatedPosts([], 'missing')).toEqual([])
	})

	it('still returns relevant posts when the current slug is not in the list', () => {
		const posts = makePosts(10)
		const related = selectRelatedPosts(posts, 'not-published-yet')
		expect(related).toHaveLength(3)
	})

	it('returns nothing for a non-positive count', () => {
		expect(selectRelatedPosts(makePosts(10), 'post-0', 0)).toEqual([])
	})
})
