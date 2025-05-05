'use client';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 filter blur-sm opacity-60"
      style={{ backgroundImage: "url('/original2.gif')" }}
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  );
}
