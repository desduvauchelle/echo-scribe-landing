/**
 * Inline schema.org JSON-LD. Server component — rendered into the initial HTML
 * so crawlers that don't execute JS still see it. `<` is escaped because a
 * literal `</script>` inside any payload string (CMS/dictionary text) would
 * terminate the script element early and break the page.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
		/>
	)
}
