import type { Metadata } from 'next'
import { getFormBySlug, getBusinessConfig } from '@growth-engine/sdk-server'
import { FormRenderer } from '@growth-engine/sdk-client/components'
import { getDictionary } from '@/i18n'
import { getDb, safeQuery } from '@/lib/db'
import { buildPageMetadata } from '@/lib/seo'
import { ConfigDisplay } from '@/components/config/ConfigDisplay'
import { ContactAnalytics } from './ContactAnalytics'

const CONTACT_FORM_SLUG = 'contact-form'

export const revalidate = 120

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({
		path: '/contact',
		locale,
		title: dict['contact.heading'],
		description: dict['contact.meta.description'],
	})
}

export default async function ContactPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const dict = await getDictionary(locale)

	const [form, config] = await Promise.all([
		safeQuery(null, () => getFormBySlug(getDb(), CONTACT_FORM_SLUG)),
		safeQuery(null, () => getBusinessConfig(getDb())),
	])

	return (
		<main className="container mx-auto px-4 py-12">
			<ContactAnalytics />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
				{/* Contact Form — FormRenderer emits the page's single <h1> from
				    form.name, so we localize it here instead of adding a second H1. */}
				<div>
					{form ? (
						<FormRenderer
							form={{
								...form,
								name: dict['contact.heading'],
								description: dict['contact.subtitle'],
							}}
							translations={{
								defaultSubmitLabel: 'Send Message',
							}}
						/>
					) : null}
				</div>

				{/* Business Info */}
				{config && (
					<div>
						<ConfigDisplay
							hours={config.hours ?? null}
							contact={config.contact ?? null}
							dict={dict}
						/>
					</div>
				)}
			</div>
		</main>
	)
}
