'use client'

import { motion } from 'framer-motion'

interface AboutAnimatedProps {
  title: string
  subtitle: string
  paragraphs: string[]
}

const ease = [0.22, 1, 0.36, 1] as const

export function AboutAnimated({ title, subtitle, paragraphs }: AboutAnimatedProps) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease }}
        className="mb-10"
      >
        <h2 className="mb-2">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </motion.div>

      <div className="mx-auto max-w-3xl space-y-5">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease, delay: i * 0.12 }}
          >
            {p}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
