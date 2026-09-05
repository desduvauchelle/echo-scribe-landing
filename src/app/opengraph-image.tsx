import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/seo'

// Site-wide default social-share card, rendered by `next/og` (Vercel's OG image
// generator). Next injects the resulting <meta property="og:image"> into every
// page that doesn't define its own. See `twitter-image.tsx` for the X/Twitter card.
export const alt = `${SITE_NAME}: Typing is overrated. Just talk. Private voice to text for Mac.`
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
const MASCOT_DATA_URI = 'data:image/jpeg;base64,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'

export default async function OpengraphImage() {
	const glyphs =
		'Tucky Typing is overrated. Just talk. Free. Private. On-device AI. Voice to text for your whole Mac. Press a hotkey, speak, and polished text lands at your cursor. Free on your Mac. No account or cloud backend. 0123456789'
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
							Free. Private. On-device AI.
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

				{/* Headline + mascot */}
				<div style={{ display: 'flex', alignItems: 'center', gap: '44px' }}>
					<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
						<div style={{ display: 'flex', fontSize: '78px', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.04 }}>
							Typing is overrated.
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
							Just talk.
						</div>
						<div style={{ display: 'flex', marginTop: '26px', maxWidth: '780px', fontSize: '26px', fontWeight: 400, lineHeight: 1.4, color: '#b9d3c6' }}>
							Voice to text for your whole Mac. Press a hotkey, speak, and polished text lands at your cursor.
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
						<div style={{ display: 'flex', width: '196px', height: '196px', padding: '8px', borderRadius: '999px', backgroundColor: '#f4dfc5', border: '2px solid rgba(143,224,186,0.5)' }}>
							<img src={MASCOT_DATA_URI} width={180} height={180} style={{ borderRadius: '999px' }} />
						</div>
						<div style={{ display: 'flex', fontSize: '22px', fontWeight: 700, color: '#8fe0ba' }}>Meet Tucky</div>
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
						<img src={MASCOT_DATA_URI} width={58} height={58} style={{ borderRadius: '15px' }} />
						<div style={{ display: 'flex', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>
							{SITE_NAME}
						</div>
					</div>
					<div style={{ display: 'flex', fontSize: '20px', fontWeight: 400, color: '#9fc3b1' }}>
						Free on your Mac. No account or cloud backend.
					</div>
				</div>
			</div>
		),
		{ ...size, fonts },
	)
}
