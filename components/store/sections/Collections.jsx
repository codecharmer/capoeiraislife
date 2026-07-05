'use client';

import Link from 'next/link';
import { collections } from '@/lib/store-data';
import { Reveal } from '../ui-bits';
import { useLang } from '@/lib/i18n';
import { ArrowUpRight } from 'lucide-react';

export function Collections() {
  const { t } = useLang();
  return (
    <section id="collections" className="relative mx-auto max-w-[1400px] overflow-hidden px-4 py-20 md:px-8">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full blur-3xl glow-green opacity-30" />
      <Reveal className="mb-10 flex items-end justify-between">
        <div>
          <p className="font-oswald text-xs font-semibold uppercase tracking-[0.3em] text-tropical">{t.collections.eyebrow}</p>
          <h2 className="mt-2 font-anton text-4xl uppercase text-foreground md:text-5xl">{t.collections.title}</h2>
        </div>
        <Link href="/collections/all" className="hidden font-oswald text-sm uppercase tracking-widest text-muted-foreground hover:text-primary md:block">{t.collections.viewAll}</Link>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {collections.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.05} className={i === 0 ? 'col-span-2 md:col-span-1' : ''}>
            <Link href={`/collections/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-md">
              <img src={c.image} alt={t.cat[c.slug].name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/70">{t.cat[c.slug].tagline}</p>
                <div className="flex items-center justify-between">
                  <h3 className="font-oswald text-lg uppercase text-white">{t.cat[c.slug].name}</h3>
                  <ArrowUpRight className="text-primary opacity-0 transition group-hover:opacity-100" size={18} />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
