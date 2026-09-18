import { describe, it, expect } from 'vitest'
import { parseKeywords } from './post-keywords'

describe('parseKeywords', () => {
	it('reads the JSON-encoded string array Brain stores', () => {
		expect(parseKeywords('["local ai mac","on-device transcription"]')).toEqual([
			'local ai mac',
			'on-device transcription',
		])
	})

	it('reads a plain array', () => {
		expect(parseKeywords(['a', 'b'])).toEqual(['a', 'b'])
	})

	it('reads a bare comma-separated string', () => {
		expect(parseKeywords('local ai mac, dictation')).toEqual(['local ai mac', 'dictation'])
	})

	it('returns nothing for null, empty, or malformed input', () => {
		expect(parseKeywords(null)).toEqual([])
		expect(parseKeywords(undefined)).toEqual([])
		expect(parseKeywords('')).toEqual([])
		expect(parseKeywords('   ')).toEqual([])
		expect(parseKeywords(42)).toEqual([])
		// Broken JSON is unreadable, not a one-element list of broken JSON.
		expect(parseKeywords('["unterminated')).toEqual([])
		expect(parseKeywords('{"not":"an array"}')).toEqual([])
	})

	it('drops non-string members rather than throwing', () => {
		expect(parseKeywords('["ok",3,null]')).toEqual(['ok'])
	})

	it('always returns something `.join()` can be called on', () => {
		for (const raw of [null, undefined, 42, '', '["a"]', 'a,b', ['c']]) {
			expect(() => parseKeywords(raw).join(', ')).not.toThrow()
		}
	})
})
