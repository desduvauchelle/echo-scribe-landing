'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Dictionary } from '@/i18n'
import { cn } from '@/lib/utils'
import styles from './mascot.module.css'

type Pose = 'listen' | 'collect' | 'wave'
type Entrance = 'up' | 'left' | 'right'
type Motion = 'float' | 'nod' | 'sway' | 'still'

export function Mascot({ pose, className, interactive = false, dict, entrance = 'up', motion = 'float', delay = 0 }: {
	pose: Pose
	className?: string
	interactive?: boolean
	dict: Dictionary
	entrance?: Entrance
	motion?: Motion
	delay?: number
}) {
	const ref = useRef<HTMLDivElement>(null)
	const [arrived, setArrived] = useState(false)
	const [waving, setWaving] = useState(false)
	const [greeting, setGreeting] = useState(0)

	useEffect(() => {
		if (!ref.current) return
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setArrived(true)
				observer.disconnect()
			}
		}, { threshold: 0.3 })
		observer.observe(ref.current)
		return () => observer.disconnect()
	}, [])

	const art = <span
		key={greeting}
		className={cn(
			styles.art,
			styles[waving ? 'wave' : pose],
			styles[`from-${entrance}`],
			styles[motion],
			arrived && styles.arrived,
			greeting > 0 && styles.greet,
		)}
		style={{ '--mascot-delay': `${delay}ms` } as CSSProperties}
		aria-hidden="true"
	>
		<Image src="/mascot/tucky-poses.png" alt="" width={1920} height={819} sizes={interactive ? '(min-width: 1024px) 1500px, 780px' : '840px'} priority={interactive} className={styles.sheet} />
	</span>

	return <div ref={ref} className={cn(styles.mascot, className)}>
		{interactive ? <button type="button" aria-label={dict['mascot.greet']} aria-pressed={waving} className={styles.hello} onClick={() => { setWaving(!waving); setGreeting(greeting + 1) }}>
			{art}
			<span className={styles.hint}>{waving ? dict['mascot.hello'] : dict['mascot.greet']} <span aria-hidden="true">↗</span></span>
		</button> : <div className={styles.decorative} aria-hidden="true">{art}</div>}
	</div>
}
