'use client';

import { useEffect, useState } from 'react';
import { INSTAGRAM } from '@/lib/store-data';
import { Reveal } from '../ui-bits';
import { useLang } from '@/lib/i18n';
import { Instagram, Play } from 'lucide-react';

// Behold.so JSON feed (public, safe for the browser). Override with NEXT_PUBLIC_BEHOLD_FEED_ID in .env if needed.
const FEED_ID = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID || 'tShEY2Z3oGeAXJ9obsVd';
const PROFILE = 'https://www.instagram.com/capoeira.is.life';

export function InstagramFeed() {
  const { t } = useLang();
  const fallback = INSTAGRAM.map((src, i) => ({ id: `f${i}`, src, permalink: PROFILE, video: false, caption: '' }));
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    if (!FEED_ID) return;
    let active = true;
    fetch(`https://feeds.behold.so/${FEED_ID}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const posts = Array.isArray(data) ? data : (data.posts || []);
        if (!active || !posts.length) return;
        const mapped = posts
          .slice(0, 12)
          .map((p) => ({
            id: p.id || p.permalink,
            src: p?.sizes?.medium?.mediaUrl || p?.sizes?.large?.mediaUrl || p?.sizes?.full?.mediaUrl || p.thumbnailUrl || p.mediaUrl,
            permalink: p.permalink || PROFILE,
            caption: p.caption || '',
            video: p.mediaType === 'VIDEO',
          }))
          .filter((p) => p.src);
        if (mapped.length) setItems(mapped);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
      <Reveal className="mb-8 text-center">
        <p className="font-oswald text-xs font-semibold uppercase tracking-[0.3em] text-tropical">{t.insta.eyebrow}</p>
        <h2 className="mt-2 font-anton text-4xl uppercase text-foreground md:text-5xl">{t.insta.title}</h2>
      </Reveal>
      <div className="grid grid-cols-3 gap-1 md:grid-cols-6">
        {items.map((it) => (
          <a key={it.id} href={it.permalink} target="_blank" rel="noreferrer" title={it.caption} className="group relative aspect-square overflow-hidden">
            <img src={it.src} loading="lazy" alt={it.caption || 'Instagram post'} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            {it.video && (
              <span className="absolute right-2 top-2 text-white drop-shadow"><Play size={16} className="fill-white" /></span>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"><Instagram className="text-white" size={24} /></div>
          </a>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a href={PROFILE} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-sm border border-border px-8 py-3 font-oswald text-sm uppercase tracking-widest hover:border-primary hover:text-primary"><Instagram size={18} /> {t.insta.follow}</a>
      </div>
    </section>
  );
}
