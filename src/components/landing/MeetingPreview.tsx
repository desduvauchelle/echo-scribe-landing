import type { Dictionary } from '@/i18n'
import { Mascot } from './Mascot'

/** Illustrative meeting notes, with decisions and next steps visible at a glance. */
export function MeetingPreview({ dict }: { dict: Dictionary }) {
	return (
		<figure className="min-w-0">
			<div className="mb-4 flex items-center justify-between gap-3 text-sm text-base-content/70"><span>{dict['meeting.preview.after']}</span><span>{dict['meeting.preview.example']}</span></div>
			<div className="rounded-2xl border border-base-content/15 bg-base-100 p-6 shadow-[0_16px_40px_rgba(18,59,45,0.06)] sm:p-8">
				<div className="mb-5 flex items-center justify-between gap-4 border-b border-base-content/10 pb-5">
					<span className="text-lg font-semibold">Tucky</span>
					<Mascot pose="collect" motion="still" dict={dict} className="-my-3 max-w-[96px] shrink-0 sm:max-w-[120px]" />
				</div>
				<p className="text-2xl font-bold tracking-tight">{dict['meeting.preview.title']}</p>
				<p className="mb-2 mt-6 text-base font-semibold text-primary">{dict['meeting.preview.decisions']}</p>
				<p className="text-lg leading-relaxed">{dict['meeting.preview.decision']}</p>
				<p className="mb-3 mt-6 text-base font-semibold text-primary">{dict['meeting.preview.actions']}</p>
				<ul className="space-y-3 text-lg leading-relaxed">
					{(['meeting.preview.action1', 'meeting.preview.action2'] as const).map((key) => <li key={key} className="flex gap-3"><span className="mt-1.5 h-4 w-4 shrink-0 rounded border border-base-content/35" aria-hidden="true" /><span>{dict[key]}</span></li>)}
				</ul>
			</div>
		</figure>
	)
}
