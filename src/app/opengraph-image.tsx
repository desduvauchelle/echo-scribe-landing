import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/seo'

// Site-wide default social-share card, rendered by `next/og` (Vercel's OG image
// generator). Next injects the resulting <meta property="og:image"> into every
// page that doesn't define its own. See `twitter-image.tsx` for the X/Twitter card.
export const alt = `${SITE_NAME} — Capture everything. Understand what matters.`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Load Inter from Google Fonts so the card matches the site typeface. Wrapped so
// a network hiccup degrades to the built-in font rather than failing the image.
async function loadInter(weight: 400 | 700 | 800, text: string) {
	try {
		const url = `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(text)}`
		const css = await (await fetch(url)).text()
		const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
		if (!src) return null
		return await (await fetch(src)).arrayBuffer()
	} catch {
		return null
	}
}

// Accent-green waveform — the site's audio-capture motif.
const WAVE_BARS = [16, 34, 52, 26, 44, 60, 30, 48, 22, 38, 56, 20]

export default async function OpengraphImage() {
	const glyphs =
		'Echo Scribe Capture everything. Understand what matters. Private AI for the workday · Runs locally, no cloud backend 0123456789'
	const [regular, bold, extrabold] = await Promise.all([
		loadInter(400, glyphs),
		loadInter(700, glyphs),
		loadInter(800, glyphs),
	])

	const fonts = [
		regular && { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
		bold && { name: 'Inter', data: bold, weight: 700 as const, style: 'normal' as const },
		extrabold && { name: 'Inter', data: extrabold, weight: 800 as const, style: 'normal' as const },
	].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 700 | 800; style: 'normal' }[]

	const fontFamily = fonts.length ? 'Inter' : undefined

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '72px',
					fontFamily,
					color: '#f4faf1',
					// Dark-theme forest palette from globals.css
					backgroundColor: '#0c2018',
					backgroundImage:
						'radial-gradient(1100px 520px at 88% -8%, rgba(55,164,119,0.28), transparent 60%), linear-gradient(135deg, #0c2018 0%, #123b2d 58%, #0e281e 100%)',
				}}
			>
				{/* Header: badge + waveform */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '12px',
							padding: '11px 20px',
							borderRadius: '999px',
							backgroundColor: 'rgba(55,164,119,0.12)',
							border: '1px solid rgba(143,224,186,0.38)',
						}}
					>
						<div style={{ width: '11px', height: '11px', borderRadius: '999px', backgroundColor: '#8fe0ba' }} />
						<div style={{ fontSize: '22px', fontWeight: 500, color: '#cfe9db' }}>
							Private AI for the workday
						</div>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
						{WAVE_BARS.map((h, i) => (
							<div
								key={i}
								style={{
									width: '9px',
									height: `${h}px`,
									borderRadius: '5px',
									backgroundColor: i % 2 === 0 ? '#37a477' : '#8fe0ba',
								}}
							/>
						))}
					</div>
				</div>

				{/* Headline */}
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ display: 'flex', fontSize: '78px', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.04 }}>
						Capture everything.
					</div>
					<div
						style={{
							display: 'flex',
							fontSize: '78px',
							fontWeight: 800,
							letterSpacing: '-2px',
							lineHeight: 1.04,
							color: '#8fe0ba',
						}}
					>
						Understand what matters.
					</div>
					<div style={{ display: 'flex', marginTop: '26px', maxWidth: '900px', fontSize: '26px', fontWeight: 400, lineHeight: 1.4, color: '#b9d3c6' }}>
						Captures your conversations, meetings, and screen recordings into private, searchable work context.
					</div>
				</div>

				{/* Footer: wordmark lockup + local/private meta */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						paddingTop: '28px',
						borderTop: '1px solid rgba(255,255,255,0.09)',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
						<div
							style={{
								display: 'flex',
								alignItems: 'flex-end',
								justifyContent: 'center',
								gap: '5px',
								width: '58px',
								height: '58px',
								borderRadius: '15px',
								backgroundImage: 'linear-gradient(160deg, #37a477, #123b2d)',
							}}
						>
							<div style={{ width: '6px', height: '18px', borderRadius: '3px', backgroundColor: '#eafaf1', marginBottom: '20px' }} />
							<div style={{ width: '6px', height: '30px', borderRadius: '3px', backgroundColor: '#eafaf1', marginBottom: '20px' }} />
							<div style={{ width: '6px', height: '14px', borderRadius: '3px', backgroundColor: '#eafaf1', marginBottom: '20px' }} />
						</div>
						<div style={{ display: 'flex', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>
							{SITE_NAME}
						</div>
					</div>
					<div style={{ display: 'flex', fontSize: '20px', fontWeight: 400, color: '#9fc3b1' }}>
						Runs locally on your Mac · No cloud backend
					</div>
				</div>
			</div>
		),
		{ ...size, fonts },
	)
}
