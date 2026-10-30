/**
 * Lets any link to the contact form pre-select its topic (e.g. Enterprise → "sales").
 * The form lives on /contact, so links elsewhere use `contactHref(topic)` (/contact?topic=…)
 * and the form reads it with `topicFromUrl`. On /contact itself, `requestContactTopic`
 * switches the topic in place.
 */
export const CONTACT_TOPICS = ["general", "demo", "sales", "partnership", "support"] as const
export type ContactTopic = (typeof CONTACT_TOPICS)[number]

export function contactHref(topic?: ContactTopic) {
  return topic && topic !== "general" ? `/contact?topic=${topic}` : "/contact"
}

/** The `?topic=` the visitor arrived with, when it names a known topic. */
export function topicFromUrl(): ContactTopic | null {
  const value = new URLSearchParams(window.location.search).get("topic")
  return CONTACT_TOPICS.find((topic) => topic === value) ?? null
}

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
