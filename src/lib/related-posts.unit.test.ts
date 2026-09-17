import { describe, it, expect } from 'vitest'
import { coveragePost, withCoveragePost } from './related-posts'

/**
 * These cover the ONE thing this module promises: no published post is left
 * without an inbound link. Relevance ranking lives in the SDK's
 * `getRelatedPosts()` and is tested there.
 */

interface TestPost {
	slug: string
}

function makePosts(count: number): TestPost[] {
	return Array.from({ length: count }, (_, i) => ({ slug: `post-${i}` }))
}

/** What the SDK's ranking returns when it keeps picking the same few posts. */
function stubRanking(posts: TestPost[], currentSlug: string): TestPost[] {
	return posts.filter((p) => p.slug !== currentSlug).slice(0, 3)
}

describe('coveragePost', () => {
	it('is the next post in canonical order', () => {
		expect(coveragePost(makePosts(10), 'post-3')?.slug).toBe('post-4')
	})

	it('wraps at the end of the list', () => {
		expect(coveragePost(makePosts(10), 'post-9')?.slug).toBe('post-0')
	})

	it('is null when the post is not in the list', () => {
		expect(coveragePost(makePosts(10), 'not-published-yet')).toBeNull()
	})

	it('is null for a blog of one post — a post cannot link to itself', () => {
		expect(coveragePost(makePosts(1), 'post-0')).toBeNull()
	})

	it('is null for an empty list', () => {
		expect(coveragePost([], 'missing')).toBeNull()
	})
})

describe('withCoveragePost', () => {
	it('leaves no post without an inbound link, even when the ranking is degenerate', () => {
		const posts = makePosts(30)
		const inbound = new Set<string>()
		for (const post of posts) {
			for (const related of withCoveragePost(stubRanking(posts, post.slug), posts, post.slug)) {
				inbound.add(related.slug)
			}
		}
		for (const post of posts) expect(inbound).toContain(post.slug)
	})

	it('keeps the ranked posts, appending the cycle rather than reordering them', () => {
		const posts = makePosts(30)
		const ranked = stubRanking(posts, 'post-20')
		const result = withCoveragePost(ranked, posts, 'post-20')
		expect(result.slice(0, 3).map((p) => p.slug)).toEqual(ranked.map((p) => p.slug))
		expect(result.at(-1)?.slug).toBe('post-21')
	})

	it('never exceeds the maximum slot count', () => {
		const posts = makePosts(30)
		// A full five ranked posts, none of them post-0's successor (post-1).
		const ranked = posts.filter((p) => !['post-0', 'post-1'].includes(p.slug)).slice(0, 5)
		expect(withCoveragePost(ranked, posts, 'post-0')).toHaveLength(5)
	})

	it('drops the weakest ranked post to make room for the cycle', () => {
		const posts = makePosts(30)
		const ranked = posts.filter((p) => !['post-0', 'post-1'].includes(p.slug)).slice(0, 5)
		const slugs = withCoveragePost(ranked, posts, 'post-0').map((p) => p.slug)
		expect(slugs).not.toContain(ranked[4]!.slug)
		expect(slugs).toContain('post-1')
	})

	it('leaves the ranking alone when it already contains the cycle post', () => {
		const posts = makePosts(30)
		const ranked = stubRanking(posts, 'post-0') // post-1, post-2, post-3
		expect(withCoveragePost(ranked, posts, 'post-0').map((p) => p.slug)).toEqual([
			'post-1',
			'post-2',
			'post-3',
		])
	})

	it('returns the ranking untouched when the post is not in the list', () => {
		const posts = makePosts(10)
		const ranked = stubRanking(posts, 'preview')
		expect(withCoveragePost(ranked, posts, 'preview')).toEqual(ranked)
	})

	it('returns nothing for a non-positive maximum', () => {
		const posts = makePosts(10)
		expect(withCoveragePost(stubRanking(posts, 'post-0'), posts, 'post-0', 0)).toEqual([])
	})

	it('is deterministic across calls', () => {
		const posts = makePosts(30)
		const ranked = stubRanking(posts, 'post-7')
		expect(withCoveragePost(ranked, posts, 'post-7')).toEqual(
			withCoveragePost(ranked, posts, 'post-7'),
		)
	})
})
