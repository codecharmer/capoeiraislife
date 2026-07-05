'use client';

import Link from 'next/link';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { LOGO } from '@/lib/store-data';
import { useLang } from '@/lib/i18n';

export function Footer() {
  const { t } = useLang();
  const cols = [
    { title: t.footer.shop, links: [[t.cat['t-shirts'].name, '/collections/t-shirts'], [t.cat.hoodies.name, '/collections/hoodies'], [t.cat['tank-tops'].name, '/collections/tank-tops'], [t.cat.accessories.name, '/collections/accessories']] },
    { title: t.footer.company, links: [[t.footer.about, '/about'], [t.footer.bestSellers, '/#bestsellers'], ['Instagram', 'https://www.instagram.com/capoeira.is.life'], [t.footer.contact, '/about']] },
    { title: t.footer.support, links: [[t.footer.shipping, '/#faq'], [t.footer.returns, '/#faq'], [t.footer.sizing, '/#faq'], [t.footer.faq, '/#faq']] },
  ];
  return (
    <footer className="border-t border-border bg-black">
      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <img src={LOGO} alt="Capoeira is Life" className="h-24 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t.footer.tagline}</p>
            <div className="mt-4 flex gap-3">
              <a href="https://www.instagram.com/capoeira.is.life" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary"><Instagram size={16} /></a>
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary"><Facebook size={16} /></a>
              <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary"><Youtube size={16} /></a>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-oswald text-sm uppercase tracking-widest text-foreground">{c.title}</h4>
              <ul className="mt-4 space-y-2">
                {c.links.map(([label, href]) => (<li key={label}><Link href={href} className="text-sm text-muted-foreground transition hover:text-primary">{label}</Link></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Capoeira is Life. {t.footer.rights}</p>
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'AMEX', 'PAYPAL'].map((p) => (<span key={p} className="rounded-sm border border-border px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground">{p}</span>))}
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/about" className="hover:text-primary">{t.footer.privacy}</Link>
            <Link href="/about" className="hover:text-primary">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
