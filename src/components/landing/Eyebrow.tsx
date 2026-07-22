import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<span
			className={cn(
				'inline-block rounded-full border border-accent/20 bg-accent/8 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.1em] text-primary dark:text-primary',
				className,
			)}
		>
			{children}
		</span>
	)
}
