import type { Dictionary } from '@/i18n'
import { Eyebrow } from './Eyebrow'
import { ScrollReveal } from './ScrollReveal'

const ICONS = [
	// Shield
	<path key="shield" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
	// Globe
	<g key="globe">
		<circle cx="12" cy="12" r="10" />
		<line x1="2" y1="12" x2="22" y2="12" />
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</g>,
	// Briefcase with lock
	<g key="briefcase">
		<rect x="2" y="7" width="20" height="14" rx="2" />
		<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
		<line x1="12" y1="12" x2="12" y2="16" />
		<line x1="10" y1="14" x2="14" y2="14" />
	</g>,
	// File
	<g key="file">
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
		<polyline points="14 2 14 8 20 8" />
	</g>,
]

export function PrivacyGrid({ dict }: { dict: Dictionary }) {
	const cards = [1, 2, 3, 4] as const

	return (
		<section id="privacy" className="scroll-mt-20 border-t border-base-content/10 bg-base-200 py-25">
			<div className="container mx-auto max-w-[1080px] px-6">
				<ScrollReveal y={30} className="mb-14 text-center">
					<Eyebrow className="mb-5">{dict['privacy.landing.eyebrow']}</Eyebrow>
					<h2 className="mb-4 text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-0.03em]">
						{dict['privacy.landing.title']}
					</h2>
					<p className="mx-auto max-w-[520px] text-lg leading-relaxed text-base-content/70">
						{dict['privacy.landing.subtitle']}
					</p>
				</ScrollReveal>

				<ScrollReveal y={40} stagger={0.1} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{cards.map((n, i) => (
						<div key={n} className="rounded-[14px] border border-base-content/12 bg-base-100 p-6">
							<svg
								className="mb-3.5 h-10 w-10 text-success"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								{ICONS[i]}
							</svg>
							<h3 className="mb-2 text-[15px] font-semibold">{dict[`privacy.landing.card${n}.title`]}</h3>
							<p className="text-sm leading-[1.55] text-base-content/70">{dict[`privacy.landing.card${n}.desc`]}</p>
						</div>
					))}
				</ScrollReveal>
			</div>
		</section>
	)
}
