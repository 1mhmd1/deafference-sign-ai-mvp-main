import { cn } from "@/lib/utils"

export function Container({
  className,
  fluid = false,
  as: Component = "div",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  as?: React.ElementType
  /** Span the full viewport width instead of capping at max-w-7xl. */
  fluid?: boolean
}) {
  return (
    <Component
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", fluid ? "max-w-none xl:px-12 2xl:px-16" : "max-w-7xl", className)}
      {...props}
    />
  )
}
