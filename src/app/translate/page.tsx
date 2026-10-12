import { Suspense } from "react"
import { Loading } from "@/components/shared/loading"
import { TranslateWorkspace } from "@/components/deafference/translate-workspace"

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
