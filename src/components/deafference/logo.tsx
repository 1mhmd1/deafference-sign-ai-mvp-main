import { cn } from "@/lib/utils"

/**
 * Deafference wordmark on a transparent background: navy lettering in light mode,
 * light-grey lettering in dark mode (two rasters, since an image can't re-tint its ink).
 */
export function Logo({ className }: { className?: string }) {
  const size = "h-8 w-auto object-contain sm:h-9"
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img src="/deafference-logo-transparent.png" alt="Deafference" className={cn(size, "dark:hidden")} />
      <img src="/deafference-logo-transparent-dark.png" alt="Deafference" className={cn(size, "hidden dark:block")} />
    </span>
  )
}
