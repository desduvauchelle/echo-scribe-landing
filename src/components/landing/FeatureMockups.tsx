import type { Dictionary } from '@/i18n'

// Decorative product mockups for the feature slabs, ported from the original
// landing page. Purely presentational — exposed to assistive tech as images.

export function TranscriptionDemo({ dict }: { dict: Dictionary }) {
	return (
		<div
			role="img"
			aria-label={dict['demo.transcription.aria']}
			className="overflow-hidden rounded-3xl border border-base-content/18 bg-elevated shadow-[0_32px_80px_rgba(18,59,45,0.14)]"
		>
			<div className="flex items-center gap-2 border-b border-base-content/10 bg-base-200 px-4.5 py-3.5">
				<div className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
				<div className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
				<div className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
				<span className="ml-2 text-[13px] text-base-content/50">{dict['demo.transcription.app']}</span>
			</div>
			<div className="min-h-[200px] p-6 text-[15px] leading-[1.75]">
				{dict['demo.transcription.body']}
				<span className="ml-0.5 inline-block h-4.5 w-0.5 animate-blink bg-accent align-middle" aria-hidden="true" />
			</div>
			<div className="mx-6 mb-6 flex items-center gap-3 rounded-[10px] border border-accent/25 bg-accent/10 px-4 py-3">
				<div className="flex h-5 items-end gap-[3px]" aria-hidden="true">
					{['0s', '0.1s', '0.2s', '0.3s', '0.4s'].map((delay, i) => (
						<div
							key={delay}
							className="w-[3px] animate-wave-fast rounded-sm bg-accent"
							style={{ height: ['40%', '80%', '100%', '80%', '40%'][i], animationDelay: delay }}
						/>
					))}
				</div>
				<span className="text-[13px] font-semibold text-success">{dict['demo.transcription.recording']}</span>
				<span className="ml-auto rounded-[5px] border border-base-content/10 bg-base-100 px-2 py-0.5 font-mono text-[11px] text-base-content/50">
					⌃ Space
				</span>
			</div>
		</div>
	)
}

export function EchoDemo({ dict }: { dict: Dictionary }) {
	return (
		<div
			role="img"
			aria-label={dict['demo.echo.aria']}
			className="overflow-hidden rounded-3xl border border-base-content/18 bg-elevated shadow-[0_32px_80px_rgba(18,59,45,0.14)]"
		>
			<div className="flex items-center gap-2 border-b border-base-content/10 bg-base-200 px-4.5 py-3.5">
				<div className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
				<div className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
				<div className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
				<span className="ml-2 text-[13px] text-base-content/50">{dict['demo.echo.title']}</span>
			</div>
			<div className="p-6">
				<div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.09em] text-base-content/50">
					{dict['demo.echo.said.label']}
				</div>
				<p className="mb-5 text-sm italic leading-[1.6] text-base-content/70">
					<span className="font-bold not-italic text-success">{dict['demo.echo.said.trigger']}</span>
					{dict['demo.echo.said.rest']}
				</p>
				<div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.09em] text-base-content/50">
					{dict['demo.echo.got.label']}
				</div>
				<div className="text-sm leading-[1.7]">
					<p>{dict['demo.echo.got.p1']}</p>
					<p className="mt-2">{dict['demo.echo.got.p2']}</p>
					<p className="mt-2">{dict['demo.echo.got.p3']}</p>
				</div>
			</div>
		</div>
	)
}

export function MeetingDemo({ dict }: { dict: Dictionary }) {
	const checks = [
		{ done: true, label: dict['demo.meeting.check1'] },
		{ done: true, label: dict['demo.meeting.check2'] },
		{ done: false, label: dict['demo.meeting.check3'], current: true },
		{ done: false, label: dict['demo.meeting.check4'] },
	]

	return (
		<div
			role="img"
			aria-label={dict['demo.meeting.aria']}
			className="rounded-3xl border border-base-content/18 bg-elevated p-5.5 shadow-[0_32px_80px_rgba(18,59,45,0.16)]"
		>
			<div className="mb-5.5 flex items-center justify-between">
				<span className="text-sm font-semibold">{dict['demo.meeting.title']}</span>
				<span className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent">{dict['demo.meeting.live']}</span>
			</div>
			<div className="mb-4.5 rounded-[10px] border border-secondary/35 bg-secondary/12 p-4 text-sm leading-normal text-warning">
				<strong className="mb-1.5 block text-[11px] uppercase tracking-[0.08em]">{dict['demo.meeting.prompt.label']}</strong>
				{dict['demo.meeting.prompt']}
			</div>
			<div className="flex flex-col gap-3">
				{checks.map((c) => (
					<div
						key={c.label}
						className={`flex items-start gap-2.5 text-[13px] ${c.current ? 'text-base-content' : 'text-base-content/70'}`}
					>
						<span className={c.done ? 'font-bold text-success' : 'text-base-content/50'}>{c.done ? '✓' : '○'}</span>
						<span>{c.label}</span>
					</div>
				))}
			</div>
		</div>
	)
}

export function ScreenDemo({ dict }: { dict: Dictionary }) {
	const cards = [
		{ text: dict['demo.screen.card1.text'], time: dict['demo.screen.card1.time'] },
		{ text: dict['demo.screen.card2.text'], time: dict['demo.screen.card2.time'] },
		{ text: dict['demo.screen.card3.text'], time: dict['demo.screen.card3.time'], incoming: true },
	]

	return (
		<div role="img" aria-label={dict['demo.screen.aria']} className="flex flex-col gap-3">
			{cards.map((card) => (
				<div
					key={card.text}
					className={`flex items-start gap-3.5 rounded-[14px] border px-5 py-4.5 shadow-[0_4px_20px_rgba(18,59,45,0.08)] ${
						card.incoming ? 'border-accent/30 bg-accent/6' : 'border-base-content/10 bg-elevated'
					}`}
				>
					<span className="shrink-0 rounded-full border border-secondary/30 bg-secondary/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.07em] text-warning">
						{dict['demo.capture.tag.screen']}
					</span>
					<div>
						<p className="text-sm leading-normal">{card.text}</p>
						<div className="mt-1 text-xs text-base-content/50">{card.time}</div>
					</div>
				</div>
			))}
		</div>
	)
}

export function CaptureDemo({ dict }: { dict: Dictionary }) {
	const cards = [
		{
			tag: dict['demo.capture.tag.meeting'],
			tagClass: 'bg-info/12 text-info border-info/30',
			text: dict['demo.capture.card1.text'],
			time: dict['demo.capture.card1.time'],
		},
		{
			tag: dict['demo.capture.tag.idea'],
			tagClass: 'bg-secondary/12 text-warning border-secondary/30',
			text: dict['demo.capture.card2.text'],
			time: dict['demo.capture.card2.time'],
		},
		{
			tag: dict['demo.capture.tag.task'],
			tagClass: 'bg-accent/12 text-success border-accent/30',
			text: dict['demo.capture.card3.text'],
			time: dict['demo.capture.card3.time'],
			incoming: true,
		},
	]

	return (
		<div role="img" aria-label={dict['demo.capture.aria']} className="flex flex-col gap-3">
			{cards.map((card) => (
				<div
					key={card.text}
					className={`flex items-start gap-3.5 rounded-[14px] border px-5 py-4.5 shadow-[0_4px_20px_rgba(18,59,45,0.08)] ${
						card.incoming ? 'border-accent/30 bg-accent/6' : 'border-base-content/10 bg-elevated'
					}`}
				>
					<span
						className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.07em] ${card.tagClass}`}
					>
						{card.tag}
					</span>
					<div>
						<p className="text-sm leading-normal">{card.text}</p>
						<div className="mt-1 text-xs text-base-content/50">{card.time}</div>
					</div>
				</div>
			))}
		</div>
	)
}

export function StatusDemo({ dict }: { dict: Dictionary }) {
	const metrics = [
		{ value: '38', label: dict['demo.status.metric1'] },
		{ value: '11', label: dict['demo.status.metric2'] },
		{ value: '6', label: dict['demo.status.metric3'] },
	]
	const rows = [
		{ label: dict['demo.status.row1'], value: '42%', width: '42%', orange: true },
		{ label: dict['demo.status.row2'], value: '78%', width: '78%', orange: false },
		{ label: dict['demo.status.row3'], value: dict['demo.status.row3.value'], width: '30%', orange: false },
	]

	return (
		<div
			role="img"
			aria-label={dict['demo.status.aria']}
			className="rounded-3xl border border-base-content/18 bg-elevated p-5.5 shadow-[0_32px_80px_rgba(18,59,45,0.16)]"
		>
			<div className="mb-6 flex items-center justify-between">
				<strong className="text-sm">{dict['demo.status.title']}</strong>
				<span className="font-mono text-[11px] text-base-content/50">{dict['demo.status.period']}</span>
			</div>
			<div className="mb-6 grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-3">
				{metrics.map((m) => (
					<div key={m.label} className="rounded-[9px] border border-base-content/10 bg-base-200 p-3.5">
						<strong className="mb-0.5 block text-[21px]">{m.value}</strong>
						<span className="text-[11px] text-base-content/50">{m.label}</span>
					</div>
				))}
			</div>
			{rows.map((row) => (
				<div key={row.label} className="mb-4 last:mb-0">
					<div className="mb-1.5 flex justify-between gap-3 text-[13px]">
						<span className="text-base-content/70">{row.label}</span>
						<strong className="text-xs text-success">{row.value}</strong>
					</div>
					<div className="h-[7px] overflow-hidden rounded-full bg-base-200">
						<div className={`h-full rounded-full ${row.orange ? 'bg-secondary' : 'bg-accent'}`} style={{ width: row.width }} />
					</div>
				</div>
			))}
		</div>
	)
}
