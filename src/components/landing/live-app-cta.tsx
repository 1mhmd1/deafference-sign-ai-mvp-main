"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { Magnetic, popArrowIcon, popButtonSizes, popPrimaryButton } from "./ui/pop"

/**
 * Closing invitation to open the app; the last section of the landing page (copy in `t.landing.demo.cta*`).
 * The preview is a real screenshot of /translate (public/app-preview-translate.webp), and the copy says
 * plainly that the app is an early preview.
 */
export function LiveAppCta() {
  const { t } = useI18n()
  const copy = t.landing.demo

  return (
    <section aria-labelledby="live-app-cta-heading" className="relative py-16 sm:py-20">
      <Container fluid>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-pop glow-border-pop grid items-center gap-8 overflow-hidden rounded-3xl p-6 sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
        >
          <div className="text-center lg:text-start">
            <h2 id="live-app-cta-heading" className="text-3xl font-bold tracking-tight text-balance text-black sm:text-4xl">
              {copy.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-7 text-black lg:mx-0">{copy.ctaBody}</p>
            <Magnetic className="mt-7">
              <Link href={APP_ROUTES.translate} className={cn(popPrimaryButton, popButtonSizes.lg)}>
                {copy.ctaButton}
                <ArrowRight className={popArrowIcon} aria-hidden="true" />
              </Link>
            </Magnetic>
          </div>

          {/* The app in a simple browser frame. */}
          <figure className="m-0 overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgba(94,15,69,0.55)] ring-1 ring-black/8">
            <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-black/6 bg-[#f6f1ee] px-3 py-2">
              <div className="size-2.5 rounded-full bg-[#F5B400]" />
              <div className="size-2.5 rounded-full bg-[#EE4B1C]" />
              <div className="size-2.5 rounded-full bg-[#B01030]" />
            </div>
            <img
              src="/app-preview-translate.webp"
              alt={copy.ctaImageAlt}
              width={1120}
              height={630}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </figure>
        </motion.div>
      </Container>
    </section>
  )
}
