import Link from 'next/link'
import type { Dictionary } from '@/i18n'
import type { NavGroup } from './nav.config'
import { localizedPath } from '@/lib/i18n-utils'

export function NavDropdown({ group, dict, locale }: { group: NavGroup; dict: Dictionary; locale: string }) {
	return (
		<div className="dropdown dropdown-hover">
			<Link
				href={localizedPath(group.hubPath, locale)}
				className="flex items-center gap-1 text-base-content/70 transition-colors hover:text-primary"
			>
				{dict[group.labelKey]}
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</Link>
			<ul className="dropdown-content menu z-50 mt-2 w-60 rounded-box border border-base-content/10 bg-base-100 p-2 shadow-lg">
				{group.itemKeys.map((item) => (
					<li key={item.path}>
						<Link href={localizedPath(item.path, locale)}>{dict[item.labelKey]}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
