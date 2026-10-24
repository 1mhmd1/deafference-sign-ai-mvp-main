"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { Magnetic, popArrowIcon, popButtonSizes, popPrimaryButton } from "./ui/pop"

/** Closing invitation to open the live app; the last section of the landing page (copy in `t.landing.demo.cta*`). */
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
          className="glass-pop glow-border-pop flex flex-col items-center gap-3 rounded-3xl p-6 text-center sm:p-8"
        >
          <h2 id="live-app-cta-heading" className="text-base font-semibold text-black sm:text-lg">
            {copy.ctaTitle}
          </h2>
          <p className="max-w-md text-sm leading-6 text-black">{copy.ctaBody}</p>
          <Magnetic className="mt-2">
            <Link href={APP_ROUTES.translate} className={cn(popPrimaryButton, popButtonSizes.lg)}>
              {copy.ctaButton}
              <ArrowRight className={popArrowIcon} aria-hidden="true" />
            </Link>
          </Magnetic>
        </motion.div>
      </Container>
    </section>
  )
}
