'use client';

// Client context that exposes the active product catalog to store components.
// Seeded from the server (Printful via ISR) in app/layout.js, and falls back to
// the static demo catalog in lib/store-data.js when Printful data is unavailable.
import { createContext, useContext } from 'react';
import { products as staticProducts, collections as staticCollections } from '@/lib/store-data';

const ProductsCtx = createContext({ products: staticProducts, collections: staticCollections });

export function ProductsProvider({ products, collections, children }) {
  const value = {
    products: products?.length ? products : staticProducts,
    collections: collections?.length ? collections : staticCollections,
  };
  return <ProductsCtx.Provider value={value}>{children}</ProductsCtx.Provider>;
}

export function useProducts() {
  return useContext(ProductsCtx);
}
