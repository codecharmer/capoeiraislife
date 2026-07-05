'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { HERO_IMAGE, LOGO } from '@/lib/store-data';
import { useLang } from '@/lib/i18n';

export function Hero() {
  const ref = useRef(null);
  const { t } = useLang();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={HERO_IMAGE} alt="Capoeira movement" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04101d] via-[#061626]/55 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,227,0,0.14),transparent_55%)]" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full blur-3xl glow-green opacity-60" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full blur-3xl glow-orange opacity-50" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="sr-only">Capoeira is Life</h1>
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="mb-6 font-oswald text-xs font-semibold uppercase tracking-[0.4em] text-tropical">{t.hero.eyebrow}</motion.span>
        <motion.img
          src={LOGO}
          alt="Capoeira is Life"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-[min(86vw,460px)] drop-shadow-[0_16px_50px_rgba(0,0,0,0.6)]"
        />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }} className="mt-4 max-w-md text-base text-white/85 md:text-lg">{t.hero.sub}</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }} className="mt-8 flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/collections/all" className="w-full rounded-sm bg-primary px-9 py-4 text-center font-oswald text-sm font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110 sm:w-auto">{t.hero.cta1}</Link>
          <Link href="/#bestsellers" className="w-full rounded-sm border border-white/40 px-9 py-4 text-center font-oswald text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto">{t.hero.cta2}</Link>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity }} className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60">
        <ChevronDown className="animate-bounce" />
      </motion.div>
    </section>
  );
}
