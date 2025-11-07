"use client";

import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @component SectionHeading
 * @description Анімований заголовок секції
 */
export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("text-2xl font-bold mb-6", className)}
    >
      {children}
    </motion.h2>
  );
}
