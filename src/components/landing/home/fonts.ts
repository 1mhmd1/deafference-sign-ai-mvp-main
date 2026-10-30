import { Atkinson_Hyperlegible_Next, Lexend } from "next/font/google"

/** Headings (Lexend) and text (Atkinson Hyperlegible Next) of the website design; only the landing pages load them. */
export const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] })
export const atkinson = Atkinson_Hyperlegible_Next({ variable: "--font-atkinson", subsets: ["latin"] })

/** Put on the landing wrapper so df.css can reach both families. */
export const landingFonts = `${lexend.variable} ${atkinson.variable}`
