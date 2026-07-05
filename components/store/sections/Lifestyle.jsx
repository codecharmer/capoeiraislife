'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LIFE_1 } from '@/lib/store-data';
import { Reveal } from '../ui-bits';
import { useLang } from '@/lib/i18n';

export function Lifestyle() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-tropical-soft py-24">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full blur-3xl glow-green opacity-50" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full blur-3xl glow-gold opacity-40" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 md:grid-cols-2 md:px-8">
        <Reveal className="order-2 md:order-1">
          <p className="font-oswald text-xs uppercase tracking-[0.3em] text-primary">{t.lifestyle.eyebrow}</p>
          <h2 className="mt-3 font-anton text-4xl uppercase leading-none text-white md:text-6xl">{t.lifestyle.titleA}<br />{t.lifestyle.titleB}</h2>
          <div className="mt-6 space-y-2">
            {t.lifestyle.lines.map((l, i) => (
              <motion.p key={l} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="text-xl text-white/80 md:text-2xl">{l}</motion.p>
            ))}
            <p className="pt-2 font-anton text-2xl uppercase text-tropical md:text-3xl">{t.lifestyle.closing}</p>
          </div>
          <Link href="/about" className="mt-8 inline-block rounded-sm bg-primary px-9 py-4 font-oswald text-sm font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110">{t.lifestyle.cta}</Link>
        </Reveal>
        <Reveal className="order-1 md:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <img src={LIFE_1} alt="Capoeira roda" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
