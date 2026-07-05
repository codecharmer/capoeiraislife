'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Reveal } from '../ui-bits';
import { useLang } from '@/lib/i18n';

export function Newsletter() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success(t.news.toastTitle, { description: t.news.toastDesc });
    setEmail('');
  };
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_45%)]" />
      <div className="relative mx-auto max-w-2xl px-4 text-center md:px-8">
        <Reveal>
          <h2 className="font-anton text-4xl uppercase md:text-5xl">{t.news.title}</h2>
          <p className="mt-3 text-black/70">{t.news.sub}</p>
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.news.placeholder} className="flex-1 rounded-sm border border-black/20 bg-white/70 px-4 py-3.5 text-sm text-black outline-none placeholder:text-black/50 focus:border-black" />
            <button className="rounded-sm bg-black px-8 py-3.5 font-oswald text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/80">{t.news.button}</button>
          </form>
          <p className="mt-3 text-xs text-black/60">{t.news.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}
