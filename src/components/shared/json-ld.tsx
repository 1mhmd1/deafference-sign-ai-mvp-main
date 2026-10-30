/**
 * Structured data for search engines (schema.org), as the Next.js docs recommend: a JSON-LD script
 * tag rendered on the server, with `<` escaped so the payload can never close the tag.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}
