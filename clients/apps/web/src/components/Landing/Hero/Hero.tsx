'use client'

import GetStartedButton from '@/components/Auth/GetStartedButton'
import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
export const Hero = ({ className }: { className?: string }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  }

  return (
    <motion.div
      className={twMerge(
        'dark:border-polar-800 relative flex flex-col items-center justify-center gap-12 overflow-hidden rounded-3xl px-12 py-16 text-center md:py-24 dark:border',
        className,
      )}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: 'url(/assets/landing/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: '50% 70%',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <motion.h1
        className="text-balance text-5xl !leading-tight tracking-tight text-white md:px-0 md:text-7xl dark:text-white"
        variants={itemVariants}
      >
        Infraestrutura de pagamento para o século 21
      </motion.h1>
      <motion.p
        className="text-pretty text-2xl !leading-tight text-white md:px-0 md:text-3xl"
        variants={itemVariants}
      >
        A maneira moderna de vender seus produtos SaaS e digitais
      </motion.p>
      <motion.div
        className="flex flex-row items-center gap-x-4"
        variants={itemVariants}
      >
        <GetStartedButton
          size="lg"
          text="Começar"
          className="rounded-full bg-white font-medium text-black hover:bg-gray-100 dark:bg-white dark:text-black"
        />
      </motion.div>
    </motion.div>
  )
}
