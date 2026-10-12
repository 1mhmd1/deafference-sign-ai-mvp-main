import { cn } from "@/lib/utils"

/** The landing navbar's Deafference wordmark: dark ink on the light theme, light ink on dark. Decorative — label the wrapping link. */
export function Wordmark({ className }: { className?: string }) {
  const size = cn("h-10 w-auto sm:h-12", className)
  return (
    <>
      <img src="/deafference-wordmark.png" alt="" className={cn(size, "dark:hidden")} />
      <img src="/deafference-wordmark-dark.png" alt="" className={cn(size, "hidden dark:block")} />
    </>
  )
}
