"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/use-i18n"

export function TipsCard() {
  const { t } = useI18n()
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.14 }}
    >
      <Card className="p-5 sm:p-6">
        <p className="text-sm font-bold tracking-[0.12em] text-[#1D4ED8] uppercase">
          {t.app.tips.eyebrow}
        </p>
        <ul className="mt-4 space-y-3">
          {t.app.tips.items.map((tip) => (
            <li key={tip} className="flex items-start gap-3 text-sm text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden="true" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  )
}
