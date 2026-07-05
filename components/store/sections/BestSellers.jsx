'use client';

import { products } from '@/lib/store-data';
import { ProductCard } from '../ProductCard';
import { Reveal } from '../ui-bits';
import { useLang } from '@/lib/i18n';

export function BestSellers() {
  const { t } = useLang();
  const best = products.slice(0, 8);
  return (
    <section id="bestsellers" className="relative mx-auto max-w-[1400px] overflow-hidden px-4 py-20 md:px-8">
      <div className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full blur-3xl glow-gold opacity-25" />
      <Reveal className="mb-10 text-center">
        <p className="font-oswald text-xs font-semibold uppercase tracking-[0.3em] text-tropical">{t.best.eyebrow}</p>
        <h2 className="mt-2 font-anton text-4xl uppercase text-foreground md:text-5xl">{t.best.title}</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {best.map((p, i) => (<ProductCard key={p.id} product={p} index={i} />))}
      </div>
    </section>
  );
}
