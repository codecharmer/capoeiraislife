'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { toastStrings } from '@/lib/i18n';

const StoreCtx = createContext(null);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem('cil_cart');
      if (s) setItems(JSON.parse(s));
    } catch (e) {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem('cil_cart', JSON.stringify(items)); } catch (e) {}
    }
  }, [items, hydrated]);

  const addToCart = useCallback((product, opts = {}) => {
    const color = opts.color || product.colors?.[0]?.name;
    const size = opts.size || product.sizes?.[0];
    const qty = opts.qty || 1;
    const variantId = opts.variantId ?? product.variantIndex?.[`${color}|${size}`] ?? null;
    const key = `${product.id}-${color}-${size}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { key, id: product.id, slug: product.slug, title: product.title, price: product.price, image: product.images[0], color, size, qty, variantId }];
    });
    let lang = 'en';
    try { lang = localStorage.getItem('cil_lang') || 'en'; } catch (e) {}
    const s = toastStrings[lang] || toastStrings.en;
    toast.success(s.added(product.title));
    setCartOpen(true);
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))));
  }, []);

  const removeItem = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);

  // Creates a Stripe Checkout Session on the server and redirects to it.
  const checkout = useCallback(async () => {
    if (items.length === 0) return;
    let lang = 'en';
    try { lang = localStorage.getItem('cil_lang') || 'en'; } catch (e) {}
    const s = toastStrings[lang] || toastStrings.en;
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            title: i.title,
            price: i.price,
            qty: i.qty,
            image: i.image,
            color: i.color,
            size: i.size,
            variantId: i.variantId,
          })),
        }),
      });
      if (!res.ok) throw new Error(`checkout ${res.status}`);
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error('no checkout url');
    } catch (e) {
      toast.error(s.checkoutError || 'Checkout is not available right now. Please try again.');
    }
  }, [items]);

  const value = { items, cartOpen, setCartOpen, searchOpen, setSearchOpen, addToCart, updateQty, removeItem, clear, count, subtotal, checkout };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
