import type { Dictionary } from '@/i18n'
import { ScrollReveal } from './ScrollReveal'
import { InstallBox } from './InstallBox'
import { TrackedLink } from './TrackedLink'

const WINDOWS_DOWNLOAD_URL = 'https://github.com/desduvauchelle/echo-scribe/releases/latest'

export function CTA({ dict }: { dict: Dictionary }) {
	const meta = [dict['cta.meta.macos'], dict['cta.meta.chips'], dict['cta.meta.update'], dict['cta.meta.models']]

	return (
		<section id="install" className="scroll-mt-20 border-t border-base-content/10 bg-base-100 py-25 text-center">
			<div className="container mx-auto max-w-[1080px] px-6">
				<ScrollReveal y={30}>
					<h2 className="mb-3.5 text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-0.03em]">{dict['cta.heading']}</h2>
					<p className="mb-10 text-lg text-base-content/70">{dict['cta.subtitle']}</p>

					<InstallBox dict={dict} />

					<div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[13px] text-base-content/50">
						<span>{dict['cta.windows.label']}</span>
						<TrackedLink
							href={WINDOWS_DOWNLOAD_URL}
							target="_blank"
							rel="noopener noreferrer"
							eventName="cta_click"
							eventParams={{ cta: 'download_windows' }}
							className="btn btn-outline btn-sm gap-1.5 rounded-lg font-medium"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path d="M3 5.7 10.2 4.7v6.9H3V5.7Zm0 12.6 7.2 1v-6.8H3v5.8Zm8.1 1.1L21 20.8V12.5h-9.9v6.9Zm0-14.9v7h9.9V3.2l-9.9 1.3Z" />
							</svg>
							{dict['cta.windows.button']}
						</TrackedLink>
					</div>

					<div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px] text-base-content/50">
						{meta.map((item, i) => (
							<span key={item} className="flex items-center gap-5">
								{i > 0 && <span aria-hidden="true">·</span>}
								{item}
							</span>
						))}
					</div>
				</ScrollReveal>
			</div>
		</section>
	)
}
