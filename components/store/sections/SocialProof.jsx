'use client';

import { Stars, Reveal } from '../ui-bits';
import { INSTAGRAM } from '@/lib/store-data';
import { useLang } from '@/lib/i18n';

export function SocialProof() {
  const { t } = useLang();
  return (
    <section className="border-y border-border bg-background py-12">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <Stars rating={5} size={18} />
          <p className="font-oswald text-lg uppercase tracking-wide text-foreground">{t.social.heading}</p>
          <p className="text-sm text-muted-foreground">{t.social.sub}</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-3 gap-2 md:grid-cols-6">
          {INSTAGRAM.slice(0, 6).map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-sm"><img src={src} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" alt="Community" /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
