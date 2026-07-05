'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';

export function Reveal({ children, delay = 0, y = 26, className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stars({ rating = 5, size = 14, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} className={i < Math.round(rating) ? 'fill-primary text-primary' : 'text-white/25'} />
      ))}
    </span>
  );
}

export const formatPrice = (n) => `$${Number(n).toFixed(2)}`;

export const badgeStyles = {
  'Best Seller': 'bg-primary text-primary-foreground',
  'New Arrival': 'bg-white text-black',
  'Limited Drop': 'bg-[#1f6f4f] text-white',
  'Almost Gone': 'bg-red-600 text-white',
};
