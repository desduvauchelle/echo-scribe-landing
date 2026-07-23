import { chromium } from 'playwright'
import { readdir, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, basename } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const screensDir = join(here, 'screens')
const outDir = join(here, '..', '..', 'public', 'screenshots')

await mkdir(outDir, { recursive: true })
const files = (await readdir(screensDir)).filter((f) => f.endsWith('.html'))
const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 2 })

for (const file of files) {
	const name = basename(file, '.html')
	await page.goto('file://' + join(screensDir, file), { waitUntil: 'networkidle' })
	const shot = page.locator('#shot')
	await shot.screenshot({ path: join(outDir, name + '.png') })
	console.log('rendered', name + '.png')
}

await browser.close()
