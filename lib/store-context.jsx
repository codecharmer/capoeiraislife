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
    const key = `${product.id}-${color}-${size}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { key, id: product.id, slug: product.slug, title: product.title, price: product.price, image: product.images[0], color, size, qty }];
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

  // === INTEGRATION POINT ===
  // Wire this to your existing Stripe / Printful checkout endpoint.
  const checkout = useCallback(() => {
    if (items.length === 0) return;
    toast.message('Checkout ready to connect', {
      description: 'Plug your existing Stripe checkout endpoint into checkout() in store-context.jsx.',
    });
  }, [items]);

  const value = { items, cartOpen, setCartOpen, searchOpen, setSearchOpen, addToCart, updateQty, removeItem, clear, count, subtotal, checkout };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
