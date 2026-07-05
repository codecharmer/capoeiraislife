'use client';

import Link from 'next/link';
import { Reveal } from '@/components/store/ui-bits';
import { LIFE_1, LIFE_3, HERO_2, LOGO } from '@/lib/store-data';
import { useLang } from '@/lib/i18n';
import { Music, History, Users, Flame } from 'lucide-react';

const ICONS = [Music, History, Flame, Users];

function AboutPage() {
  const { t } = useLang();
  const a = t.about;
  return (
    <div className="pt-16">
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img src={HERO_2} alt="Capoeira" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <Reveal>
            <p className="font-oswald text-xs font-semibold uppercase tracking-[0.4em] text-tropical">{a.eyebrow}</p>
            <h1 className="mt-3 font-anton text-5xl uppercase text-white md:text-7xl">{a.h1}</h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
        <Reveal>
          <h2 className="font-anton text-3xl uppercase text-foreground md:text-4xl">{a.headline}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{a.lead1}</p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{a.lead2}</p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1400px] items-center gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
        <Reveal><div className="aspect-[4/5] overflow-hidden rounded-lg"><img src={LIFE_1} alt="Roda" className="h-full w-full object-cover" /></div></Reveal>
        <Reveal delay={0.1}><div className="aspect-[4/5] overflow-hidden rounded-lg"><img src={LIFE_3} alt="Movement" className="h-full w-full object-cover" /></div></Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-4">
          {a.values.map((v, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-lg border border-border bg-card p-6">
                  <Icon className="text-primary" size={26} />
                  <h3 className="mt-4 font-anton text-2xl uppercase text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-tropical-soft py-16">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full blur-3xl glow-green opacity-40" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full blur-3xl glow-gold opacity-30" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center">
          <img src={LOGO} alt="Capoeira is Life" className="h-40 w-auto" />
          <h2 className="font-anton text-3xl uppercase text-white md:text-4xl">{a.join}</h2>
          <Link href="/collections/all" className="rounded-sm bg-primary px-10 py-4 font-oswald text-sm font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110">{a.cta}</Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
