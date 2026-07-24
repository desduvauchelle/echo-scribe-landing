'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/components/analytics/GoogleAnalytics'

export function TrackedLink({
	href,
	className,
	eventName,
	eventParams,
	target,
	rel,
	children,
}: {
	href: string
	className?: string
	eventName: string
	eventParams?: Record<string, string>
	target?: string
	rel?: string
	children: ReactNode
}) {
	return (
		<Link
			href={href}
			className={className}
			target={target}
			rel={rel}
			onClick={() => trackEvent(eventName, eventParams)}
		>
			{children}
		</Link>
	)
}
