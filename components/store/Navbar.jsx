'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, ShoppingBag, Menu, Instagram } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { useLang, LOCALES } from '@/lib/i18n';
import { LangSwitcher } from './LangSwitcher';
import { LOGO } from '@/lib/store-data';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const { count, setCartOpen, setSearchOpen } = useStore();
  const { t, locale, setLocale } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const overHero = pathname === '/';

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);

  const solid = scrolled || !overHero;
  const links = [
    { label: t.nav.shop, href: '/collections/all' },
    { label: t.nav.collections, href: '/#collections' },
    { label: t.nav.best, href: '/#bestsellers' },
    { label: t.nav.about, href: '/about' },
  ];

  return (
    <header className={`fixed inset-x-0 top-9 z-40 transition-all duration-300 ${solid ? 'border-b border-border bg-background/90 backdrop-blur-md' : 'border-b border-transparent bg-gradient-to-b from-black/70 to-transparent'}`}>
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger aria-label="Open menu"><Menu className="text-foreground" /></SheetTrigger>
            <SheetContent side="left" className="w-[82%] border-border bg-background">
              <img src={LOGO} alt="Capoeira is Life" className="mt-2 h-14 w-auto" />
              <div className="mt-6 flex flex-col">
                {links.map((l) => (
                  <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="border-b border-border py-4 font-oswald text-lg uppercase tracking-wide text-foreground">{l.label}</Link>
                ))}
                <a href="https://www.instagram.com/capoeira.is.life" target="_blank" rel="noreferrer" className="flex items-center gap-2 py-4 font-oswald text-lg uppercase tracking-wide text-foreground"><Instagram size={18} /> Instagram</a>
              </div>
              <div className="mt-6 flex gap-2">
                {LOCALES.map((l) => (
                  <button key={l.code} onClick={() => setLocale(l.code)} className={`rounded-sm border px-3 py-2 font-oswald text-xs uppercase tracking-widest transition ${locale === l.code ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground'}`}>{l.code}</button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="font-oswald text-[13px] font-medium uppercase tracking-widest text-foreground/80 transition hover:text-primary">{l.label}</Link>
          ))}
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Capoeira is Life home">
          <img src={LOGO} alt="Capoeira is Life" className="h-10 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] md:h-11" />
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block"><LangSwitcher /></div>
          <button aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="text-foreground transition hover:text-primary" size={20} />
          </button>
          <button aria-label="Open cart" onClick={() => setCartOpen(true)} className="relative">
            <ShoppingBag className="text-foreground transition hover:text-primary" size={20} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{count}</span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
