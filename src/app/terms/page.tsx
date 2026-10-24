import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Container } from "@/components/shared/container"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Deafference — Terms of Service",
  description: "Terms of Service for the Deafference platform.",
}

const SECTIONS = [
  {
    title: "Using Deafference",
    body: "Deafference is provided for real-time sign-and-speech translation assistance. You agree to use it lawfully and not to attempt to disrupt, reverse-engineer, or overload the service.",
  },
  {
    title: "Accounts",
    body: "You're responsible for keeping your account credentials secure and for activity that happens under your account. Let us know right away if you suspect unauthorized access.",
  },
  {
    title: "Content & translations",
    body: "Translations are generated automatically and may contain errors — don't rely on them for decisions where mistranslation could cause harm (e.g. medical or legal contexts) without human verification.",
  },
  {
    title: "Changes",
    body: "We may update these terms as the product evolves. Continued use after a change means you accept the updated terms.",
  },
]

export default function TermsPage() {
  return (
    <div className="landing-bright relative min-h-dvh bg-background text-foreground">
      <Navbar />
      <main className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This is a placeholder overview — the full legal terms will be published before general availability. See
            also our{" "}
            <Link href="/how-it-works#privacy" className="font-medium text-primary underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {SECTIONS.map((section) => (
              <Card key={section.title} className="p-6">
                <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{section.body}</p>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Last updated August 2026
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
