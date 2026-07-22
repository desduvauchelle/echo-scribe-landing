import Image from 'next/image'
import type { Dictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'
import { ScrollReveal } from './ScrollReveal'
import { TrackedLink } from './TrackedLink'

const DownloadIcon = ({ size = 17 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7 10 12 15 17 10" />
		<line x1="12" y1="15" x2="12" y2="3" />
	</svg>
)

const WAVE_DELAYS = ['0s', '0.12s', '0.24s', '0.36s', '0.48s', '0.6s', '0.72s']
const WAVE_HEIGHTS = ['22%', '50%', '80%', '100%', '80%', '50%', '22%']

export function Hero({ dict, locale }: { dict: Dictionary; locale: string }) {
	const home = localizedPath('/', locale)

	return (
		<>
			<section className="relative overflow-hidden pt-24 pb-10 text-center">
				{/* Soft radial glow behind the hero, as on the original page */}
				<div
					className="pointer-events-none absolute inset-0"
					style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(55,164,119,0.10) 0%, transparent 70%)' }}
					aria-hidden="true"
				/>

				<div className="container relative mx-auto max-w-[1080px] px-6">
					<ScrollReveal y={20} duration={0.7} start="top 95%">
						<div className="mb-7 flex justify-center">
							<Image
								src="/icon.jpeg"
								alt="Echo Scribe logo"
								width={88}
								height={88}
								priority
								className="rounded-[22px] shadow-[0_0_0_1px_rgba(18,59,45,0.12),0_24px_64px_rgba(18,59,45,0.20),0_0_80px_rgba(45,170,124,0.22)]"
							/>
						</div>

						<div className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-[13px] font-medium text-primary">
							<span className="h-[7px] w-[7px] animate-pulse-dot rounded-full bg-accent" aria-hidden="true" />
							{dict['hero.badge']}
						</div>

						<h1 className="mb-6 text-[clamp(42px,6.5vw,82px)] font-extrabold leading-[1.05] tracking-[-0.04em]">
							{dict['hero.title.line1']}
							<br />
							<em className="bg-gradient-to-br from-primary to-accent bg-clip-text not-italic text-transparent">
								{dict['hero.title.line2']}
							</em>
						</h1>

						<p className="mx-auto mb-11 max-w-[560px] text-[clamp(17px,2.2vw,21px)] leading-[1.65] text-base-content/70">
							{dict['hero.subtitle']}
						</p>
					</ScrollReveal>

					<ScrollReveal y={20} delay={0.15} start="top 95%">
						<div className="mb-13 flex flex-wrap items-center justify-center gap-3.5">
							<TrackedLink href={`${home}#install`} className="btn btn-primary btn-lg gap-2.5 rounded-[14px] px-7 font-bold" eventName="cta_click">
								<DownloadIcon />
								{dict['hero.cta.primary']}
							</TrackedLink>
							<a href="#how-it-works" className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-neutral">
								{dict['hero.cta.secondary']}
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<polyline points="9 18 15 12 9 6" />
								</svg>
							</a>
						</div>

						<div className="flex flex-wrap justify-center gap-6 text-[13px] text-base-content/50">
							<span className="flex items-center gap-1.5">
								<svg className="text-primary" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<rect x="2" y="3" width="20" height="14" rx="2" />
									<line x1="8" y1="21" x2="16" y2="21" />
									<line x1="12" y1="17" x2="12" y2="21" />
								</svg>
								{dict['hero.meta.local']}
							</span>
							<span className="flex items-center gap-1.5">
								<svg className="text-primary" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<circle cx="12" cy="12" r="10" />
									<polyline points="12 6 12 12 16 14" />
								</svg>
								{dict['hero.meta.cloud']}
							</span>
							<span className="flex items-center gap-1.5">
								<svg className="text-primary" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
								</svg>
								{dict['hero.meta.capture']}
							</span>
						</div>
					</ScrollReveal>

					<div className="pt-10" aria-hidden="true">
						<div className="flex h-11 items-end justify-center gap-[5px]">
							{WAVE_DELAYS.map((delay, i) => (
								<div
									key={delay}
									className="w-[5px] animate-wave rounded-[3px] bg-accent opacity-70"
									style={{ height: WAVE_HEIGHTS[i], animationDelay: delay }}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Curved transition into the next section */}
			<div className="relative -mt-px leading-none" aria-hidden="true">
				<svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block h-[76px] w-full">
					<path d="M0,90 L1440,90 L1440,44 C1080,90 360,90 0,44 Z" fill="var(--color-base-200)" />
				</svg>
			</div>
		</>
	)
}
