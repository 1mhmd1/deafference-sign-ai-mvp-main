import { cn } from "@/lib/utils"

/**
 * Deafference wordmark on a transparent background: navy lettering in light mode,
 * light-grey lettering in dark mode (two rasters, since an image can't re-tint its ink). Both are lazy, so only
 * the one the theme shows is downloaded.
 */
export function Logo({ className }: { className?: string }) {
  const size = "h-8 w-auto object-contain sm:h-9"
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img src="/deafference-logo-transparent.webp" width={596} height={275} loading="lazy" decoding="async" alt="Deafference" className={cn(size, "dark:hidden")} />
      <img src="/deafference-logo-transparent-dark.webp" width={596} height={275} loading="lazy" decoding="async" alt="Deafference" className={cn(size, "hidden dark:block")} />
    </span>
  )
}
