import type { Locale } from "@/i18n/locale"

/** The landing pages that can carry a signed version (one video per page). */
export type SignVideoKey = "home" | "about" | "howItWorks" | "pricing" | "faq" | "security" | "contact"

export type SignVideo = {
  /** The video file, kept in /public/sign-videos, e.g. "/sign-videos/home.en.mp4". */
  src: string
  /** The sign language the signer uses, shown on the button, e.g. "ASL" or "لغة الإشارة اللبنانية". */
  signLanguage: string
  /** WebVTT captions in the page's language (strongly recommended), e.g. "/sign-videos/home.en.vtt". */
  captions?: string
  /** A still frame shown before the video plays, e.g. "/sign-videos/home.en.jpg". */
  poster?: string
}

/**
 * Signed versions of the website, recorded by Deaf signers. Listed per page and per interface
 * language (the captions follow the page's language).
 *
 * The "Watch in sign language" button (sign-video.tsx) only appears for the entries listed here, so
 * nothing shows until a real video exists. To add one, put the files in /public/sign-videos and add:
 *
 *   home: {
 *     en: { src: "/sign-videos/home.en.mp4", captions: "/sign-videos/home.en.vtt", signLanguage: "ASL" },
 *     ar: { src: "/sign-videos/home.ar.mp4", captions: "/sign-videos/home.ar.vtt", signLanguage: "…" },
 *   },
 */
export const SIGN_VIDEOS: Partial<Record<SignVideoKey, Partial<Record<Locale, SignVideo>>>> = {}
