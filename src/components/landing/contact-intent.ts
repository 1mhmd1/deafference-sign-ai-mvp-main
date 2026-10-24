/**
 * Lets any "#contact" link on the landing page pre-select the contact form's
 * topic (e.g. Enterprise → "sales"). Links call `requestContactTopic` in their
 * onClick and keep their normal href, so the anchor scroll still works.
 */
export const CONTACT_TOPICS = ["general", "demo", "sales", "partnership", "support"] as const
export type ContactTopic = (typeof CONTACT_TOPICS)[number]

/** Where each topic's email goes; matches the channel cards in contact.tsx. */
export const TOPIC_EMAIL: Record<ContactTopic, string> = {
  general: "fatima@deafference.com",
  demo: "fatima@deafference.com",
  sales: "fatima@deafference.com",
  partnership: "fatima@deafference.com",
  support: "fatima@deafference.com",
}

const EVENT = "landing:contact-topic"

export function requestContactTopic(topic: ContactTopic) {
  window.dispatchEvent(new CustomEvent<ContactTopic>(EVENT, { detail: topic }))
}

export function onContactTopic(listener: (topic: ContactTopic) => void) {
  const handler = (event: Event) => listener((event as CustomEvent<ContactTopic>).detail)
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}
