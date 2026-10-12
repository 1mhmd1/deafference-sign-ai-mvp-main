import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { ScenarioGrid } from "@/components/landing/scenario-grid"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Scenarios — Deafference",
  description:
    "Everyday environments where Deafference bridges spoken and sign communication in real time.",
}

export default function ScenariosPage() {
  return (
    <div className="landing-bright relative min-h-dvh bg-background text-foreground">
      <div aria-hidden="true" className="starfield pointer-events-none fixed inset-0 z-30" />
      <Navbar />
      <main>
        <ScenarioGrid />
      </main>
      <Footer />
    </div>
  )
}
