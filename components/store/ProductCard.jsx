'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { useLang } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency-context';
import { Stars, badgeStyles } from './ui-bits';

export function ProductCard({ product, index = 0 }) {
  const { addToCart } = useStore();
  const { t } = useLang();
  const { format: formatPrice } = useCurrency();
  const [hover, setHover] = useState(false);
  const img2 = product.images[1] || product.images[0];
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: (index % 4) * 0.06 }} className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-secondary" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <img src={product.images[0]} alt={product.title} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${hover ? 'scale-105 opacity-0' : 'scale-100 opacity-100'}`} />
          <img src={img2} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${hover ? 'scale-105 opacity-100' : 'opacity-0'}`} />
          {product.badge && (
            <span className={`absolute left-3 top-3 rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${badgeStyles[product.badge] || 'bg-white text-black'}`}>{t.badges[product.badge]}</span>
          )}
          <button aria-label="Quick add" onClick={(e) => { e.preventDefault(); addToCart(product); }} className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-all duration-300 hover:bg-primary group-hover:translate-y-0 group-hover:opacity-100">
            <Plus size={18} />
          </button>
        </div>
      </Link>
      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-2">
          <Stars rating={product.rating} size={12} />
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-oswald text-sm font-medium uppercase tracking-wide text-foreground">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.compareAt && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>}
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.map((c) => (<span key={c.name} title={t.colors[c.name] || c.name} className="h-3.5 w-3.5 rounded-full border border-white/20" style={{ background: c.hex }} />))}
        </div>
      </div>
    </motion.div>
  );
}
