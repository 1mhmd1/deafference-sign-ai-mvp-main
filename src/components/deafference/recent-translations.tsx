"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/use-i18n"

export function RecentTranslations() {
  const { t } = useI18n()
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
    >
      <Card className="p-5 sm:p-6">
        <p className="text-sm font-bold tracking-[0.12em] text-[#1D4ED8] uppercase">
          {t.app.recent.eyebrow}
        </p>
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-background/60 px-4 py-8 text-sm text-muted-foreground">
          {t.app.recent.empty}
        </div>
      </Card>
    </motion.div>
  )
}
