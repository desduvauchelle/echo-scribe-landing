import { describe, expect, it } from 'vitest'
import { selectMacAsset } from './route'

describe('macOS release selection', () => {
	it('prefers the Tucky archive over the legacy updater archive', () => {
		const selected = selectMacAsset([
			{ name: 'EchoScribe-aarch64.tar.gz', browser_download_url: 'legacy' },
			{ name: 'Tucky-aarch64.tar.gz', browser_download_url: 'tucky' },
		])

		expect(selected?.browser_download_url).toBe('tucky')
	})

	it('keeps the legacy archive as an upgrade fallback', () => {
		const selected = selectMacAsset([
			{ name: 'EchoScribe-aarch64.tar.gz', browser_download_url: 'legacy' },
		])

		expect(selected?.browser_download_url).toBe('legacy')
	})
})
