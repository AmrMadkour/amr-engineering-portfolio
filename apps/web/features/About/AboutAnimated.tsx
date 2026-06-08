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
      <div className="mb-10">
        <motion.h2
          className="mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease, delay: 0.14 }}
        >
          {subtitle}
        </motion.p>
      </div>

      <div className="mx-auto max-w-4xl space-y-5 text-lg">
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
