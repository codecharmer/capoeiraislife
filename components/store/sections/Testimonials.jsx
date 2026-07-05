'use client';

import { useRef } from 'react';
import { testimonials } from '@/lib/store-data';
import { Stars, Reveal } from '../ui-bits';
import { useLang } from '@/lib/i18n';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export function Testimonials() {
  const { t } = useLang();
  const ref = useRef(null);
  const scroll = (d) => ref.current && ref.current.scrollBy({ left: d * 340, behavior: 'smooth' });
  return (
    <section className="relative overflow-hidden bg-tropical-soft py-20">
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl glow-green opacity-40" />
      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-oswald text-xs font-semibold uppercase tracking-[0.3em] text-tropical">{t.tst.eyebrow}</p>
            <h2 className="mt-2 font-anton text-4xl uppercase text-white md:text-5xl">{t.tst.title}</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button onClick={() => scroll(-1)} aria-label="Previous" className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-white hover:border-primary hover:text-primary"><ChevronLeft size={18} /></button>
            <button onClick={() => scroll(1)} aria-label="Next" className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-white hover:border-primary hover:text-primary"><ChevronRight size={18} /></button>
          </div>
        </Reveal>
        <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
          {testimonials.map((tm) => (
            <div key={tm.id} className="min-w-[300px] max-w-[320px] snap-start rounded-lg border border-border bg-card p-6">
              <Quote className="text-primary" size={24} />
              <p className="mt-4 text-sm leading-relaxed text-white/80">{t.reviews[tm.id]}</p>
              <Stars rating={tm.rating} size={14} className="mt-4" />
              <div className="mt-4 flex items-center gap-3">
                <img src={tm.image} alt={tm.name} className="h-11 w-11 rounded-full object-cover" />
                <div><p className="font-oswald text-sm uppercase text-white">{tm.name}</p><p className="text-xs text-muted-foreground">{tm.flag} {tm.country}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
