'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '@/lib/store-context';
import { useLang } from '@/lib/i18n';
import { useProducts } from '@/lib/products-context';
import { Search } from 'lucide-react';
import { formatPrice } from './ui-bits';

const popular = ['Hoodie', 'Berimbau', 'Tank', 'Tee'];

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useStore();
  const { t } = useLang();
  const { products } = useProducts();
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return products.filter((p) => p.title.toLowerCase().includes(s) || (t.cat[p.catSlug]?.name || '').toLowerCase().includes(s));
  }, [q, t]);

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="top-24 max-w-xl translate-y-0 gap-0 border-border bg-background p-0">
        <DialogTitle className="sr-only">{t.search.placeholder}</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={18} className="text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search.placeholder} className="w-full bg-transparent py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!q && (
            <div>
              <p className="mb-2 font-oswald text-xs uppercase tracking-widest text-muted-foreground">{t.search.popular}</p>
              <div className="flex flex-wrap gap-2">
                {popular.map((p) => (<button key={p} onClick={() => setQ(p)} className="rounded-full border border-border px-3 py-1 text-xs hover:border-primary hover:text-primary">{p}</button>))}
              </div>
            </div>
          )}
          {q && results.length === 0 && <p className="text-sm text-muted-foreground">{t.search.no} "{q}"</p>}
          <div className="space-y-2">
            {results.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 rounded-sm p-2 hover:bg-secondary">
                <img src={p.images[0]} className="h-14 w-12 rounded-sm object-cover" alt={p.title} />
                <div className="flex-1"><p className="font-oswald text-sm uppercase text-foreground">{p.title}</p><p className="text-xs text-muted-foreground">{t.cat[p.catSlug]?.name}</p></div>
                <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
