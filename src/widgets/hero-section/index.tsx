"use client";

import { motion, Variants } from "motion/react";

// Анімації для hero секції
const heroVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.4,
    },
  },
};

/**
 * @widget HeroSection
 * @description Головна секція з анімованим заголовком та підзаголовком
 */
export function HeroSection() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={heroVariants}
      className="mb-16 text-center"
    >
      <motion.h1
        variants={headingVariants}
        className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
      >
        Техніка Apple
      </motion.h1>
      <motion.p
        variants={subtitleVariants}
        className="text-xl text-muted-foreground max-w-2xl mx-auto"
      >
        Оригінальні продукти Apple з офіційною гарантією
      </motion.p>
    </motion.section>
  );
}
