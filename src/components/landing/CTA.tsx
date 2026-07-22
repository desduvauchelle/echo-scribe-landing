import type { Dictionary } from '@/i18n'
import { ScrollReveal } from './ScrollReveal'
import { InstallBox } from './InstallBox'

export function CTA({ dict }: { dict: Dictionary }) {
	const meta = [dict['cta.meta.macos'], dict['cta.meta.chips'], dict['cta.meta.update'], dict['cta.meta.models']]

	return (
		<section id="install" className="scroll-mt-20 border-t border-base-content/10 bg-base-100 py-25 text-center">
			<div className="container mx-auto max-w-[1080px] px-6">
				<ScrollReveal y={30}>
					<h2 className="mb-3.5 text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-0.03em]">{dict['cta.heading']}</h2>
					<p className="mb-10 text-lg text-base-content/70">{dict['cta.subtitle']}</p>

					<InstallBox dict={dict} />

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
