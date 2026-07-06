'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { useLang } from '@/lib/i18n';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useProducts } from '@/lib/products-context';
import { useCurrency } from '@/lib/currency-context';

export function CartDrawer() {
  const { items, cartOpen, setCartOpen, updateQty, removeItem, subtotal, count, checkout, addToCart } = useStore();
  const { t } = useLang();
  const { products } = useProducts();
  const { format: formatPrice, currency } = useCurrency();
  const suggested = products.filter((p) => !items.find((i) => i.id === p.id)).slice(0, 2);
  const freeAt = 75;
  const remaining = Math.max(0, freeAt - subtotal);
  const sizeLabel = (s) => (s === 'One Size' ? t.oneSize : s);
  const colorLabel = (c) => t.colors[c] || c;

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col border-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-oswald uppercase tracking-widest text-foreground">{t.cart.title} ({count})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="text-muted-foreground" size={40} />
            <p className="text-muted-foreground">{t.cart.empty}</p>
            <button onClick={() => setCartOpen(false)} className="rounded-sm bg-primary px-6 py-3 font-oswald text-sm uppercase tracking-widest text-primary-foreground">{t.cart.continue}</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {remaining > 0 ? (
                <p className="mb-4 rounded-sm bg-secondary px-3 py-2 text-center text-xs text-muted-foreground">{t.cart.awayPre} <span className="text-primary">{formatPrice(remaining)}</span> {t.cart.awayPost}</p>
              ) : (
                <p className="mb-4 rounded-sm bg-primary/10 px-3 py-2 text-center text-xs text-primary">{t.cart.unlocked}</p>
              )}
              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.key} className="flex gap-3">
                    <img src={it.image} alt={it.title} className="h-24 w-20 rounded-sm object-cover" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link href={`/products/${it.slug}`} onClick={() => setCartOpen(false)} className="font-oswald text-sm uppercase text-foreground">{it.title}</Link>
                        <button onClick={() => removeItem(it.key)} aria-label="Remove item"><X size={16} className="text-muted-foreground hover:text-foreground" /></button>
                      </div>
                      <p className="text-xs text-muted-foreground">{colorLabel(it.color)} · {sizeLabel(it.size)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-sm border border-border px-2 py-1">
                          <button onClick={() => updateQty(it.key, it.qty - 1)} aria-label="Decrease"><Minus size={14} /></button>
                          <span className="w-4 text-center text-sm">{it.qty}</span>
                          <button onClick={() => updateQty(it.key, it.qty + 1)} aria-label="Increase"><Plus size={14} /></button>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(it.price * it.qty)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {suggested.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 font-oswald text-xs uppercase tracking-widest text-muted-foreground">{t.cart.alsoLike}</p>
                  <div className="space-y-3">
                    {suggested.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <img src={p.images[0]} className="h-14 w-12 rounded-sm object-cover" alt={p.title} />
                        <div className="flex-1"><p className="font-oswald text-xs uppercase text-foreground">{p.title}</p><p className="text-xs text-muted-foreground">{formatPrice(p.price)}</p></div>
                        <button onClick={() => addToCart(p)} className="rounded-sm border border-border px-3 py-1.5 text-xs uppercase tracking-wide hover:border-primary hover:text-primary">{t.cart.add}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border px-5 py-4">
              <div className="mb-3 flex justify-between text-sm"><span className="text-muted-foreground">{t.cart.subtotal}</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
              <button onClick={checkout} className="w-full rounded-sm bg-primary py-4 font-oswald text-sm font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110">{t.cart.checkout}</button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">{t.cart.taxes}{currency !== 'USD' ? ' · USD' : ''}</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
