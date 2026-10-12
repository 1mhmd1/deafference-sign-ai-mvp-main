"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Container } from "@/components/shared/container"

export function ScenarioGrid() {
  return (
    <section
      id="use-cases"
      aria-labelledby="scenarios-heading"
      className="border-y border-white/5 bg-[#0B0F19] py-24 sm:py-28"
    >
      <Container fluid>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FFC107]/40 bg-[#FFC107]/15 px-3 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#FFC107] uppercase">
            In every place. Every day.
          </span>
          <h2 id="scenarios-heading" className="mt-5 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            Where Deafference matters most.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Seven everyday environments where a missing interpreter shouldn&apos;t mean a missed
            conversation — Healthcare, Hospitality, Education, Workplaces, Services &amp; Public, Travel,
            and Emergencies.
          </p>
        </motion.div>

        {/* The full reference illustration — your logo composited in place of the
            placeholder "D" — spinning continuously as the whole scenario section. */}
        <div className="mt-12 flex justify-center overflow-visible py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="relative aspect-[1672/941] w-full"
          >
            <Image
              src="/scenarios-hub.png"
              alt="Where Deafference matters: Healthcare, Hospitality, Education, Workplaces, Services & Public, Travel, and Emergencies"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
