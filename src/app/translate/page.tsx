import { Suspense } from "react"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/site"
import { Loading } from "@/components/shared/loading"
import { TranslateWorkspace } from "@/components/deafference/translate-workspace"

export const metadata: Metadata = pageMetadata({
  title: "Translate",
  description:
    "The Deafference workspace in your browser: sign, speech and text tools in one place. An early preview: sign recognition is still being connected.",
  path: "/translate",
})

/** One page, all three translate modes (sign, avatar, speech) as tabs. */
export default function TranslatePage() {
  return (
    <div className="min-h-dvh">
      {/* useSearchParams (mode sync) needs a Suspense boundary for static rendering. */}
      <Suspense fallback={<div className="p-6"><Loading /></div>}>
        <TranslateWorkspace />
      </Suspense>
    </div>
  )
}
