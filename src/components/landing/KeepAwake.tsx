import type { Dictionary } from '@/i18n'

export function KeepAwake({ dict }: { dict: Dictionary }) {
	return (
		<section className="border-t border-base-content/10 bg-base-200 py-16">
			<div className="container mx-auto grid max-w-[1080px] gap-8 px-6 md:grid-cols-2 md:items-center">
				<div>
					<h2 className="mb-4 text-3xl font-bold tracking-tight">{dict['awake.title']}</h2>
					<p className="leading-relaxed text-base-content/70">{dict['awake.description']}</p>
				</div>
				<div className="min-w-0 rounded-2xl border border-base-content/12 bg-base-100 p-6">
					<p className="mb-4 text-sm text-base-content/70">{dict['awake.instruction']}</p>
					<blockquote lang="en" className="text-xl font-semibold leading-relaxed text-primary">
						“{dict['awake.command']}”
					</blockquote>
				</div>
			</div>
		</section>
	)
}
