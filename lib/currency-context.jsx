'use client';

// Geolocation-based display currency. Detects the visitor's country (IP-based),
// picks a supported currency, fetches USD exchange rates, and formats prices.
// Display-only: checkout is always charged in USD.
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const SUPPORTED = ['USD', 'MXN', 'BRL', 'EUR'];

// MXN uses en-US locale so it renders an unambiguous "MX$" instead of the
// bare "$" that es-MX produces (easily mistaken for USD).
const CURRENCY_LOCALE = { USD: 'en-US', MXN: 'en-US', BRL: 'pt-BR', EUR: 'de-DE' };

const EURO_COUNTRIES = new Set([
  'AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
]);

function currencyForCountry(cc) {
  if (cc === 'MX') return 'MXN';
  if (cc === 'BR') return 'BRL';
  if (EURO_COUNTRIES.has(cc)) return 'EUR';
  return 'USD';
}

const FX_CACHE_KEY = 'cil_fx_v1';
const FX_TTL_MS = 12 * 60 * 60 * 1000; // 12h
const CURRENCY_KEY = 'cil_currency';

const CurrencyCtx = createContext({
  currency: 'USD',
  setCurrency: () => {},
  format: (n) => `$${Number(n).toFixed(2)}`,
  supported: SUPPORTED,
});

export const useCurrency = () => useContext(CurrencyCtx);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState('USD');
  const [rates, setRates] = useState(null); // { MXN: 18.1, BRL: 5.4, EUR: 0.92 }

  // Load exchange rates (cached in localStorage for 12h).
  useEffect(() => {
    let cancelled = false;
    async function loadRates() {
      try {
        const cached = JSON.parse(localStorage.getItem(FX_CACHE_KEY) || 'null');
        if (cached && Date.now() - cached.ts < FX_TTL_MS && cached.rates) {
          setRates(cached.rates);
          return;
        }
      } catch {}
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data?.rates) return;
        const slim = {};
        for (const c of SUPPORTED) if (data.rates[c]) slim[c] = data.rates[c];
        setRates(slim);
        try { localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ ts: Date.now(), rates: slim })); } catch {}
      } catch {}
    }
    loadRates();
    return () => { cancelled = true; };
  }, []);

  // Detect country -> currency, unless the visitor chose one already.
  useEffect(() => {
    let cancelled = false;
    try {
      const saved = localStorage.getItem(CURRENCY_KEY);
      if (saved && SUPPORTED.includes(saved)) {
        setCurrencyState(saved);
        return;
      }
    } catch {}
    async function detect() {
      try {
        const res = await fetch('https://api.country.is');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data?.country) return;
        setCurrencyState(currencyForCountry(data.country));
      } catch {}
    }
    detect();
    return () => { cancelled = true; };
  }, []);

  const setCurrency = useCallback((c) => {
    if (!SUPPORTED.includes(c)) return;
    setCurrencyState(c);
    try { localStorage.setItem(CURRENCY_KEY, c); } catch {}
  }, []);

  const format = useCallback((usd) => {
    const n = Number(usd) || 0;
    if (currency === 'USD' || !rates?.[currency]) {
      return `$${n.toFixed(2)}`;
    }
    const converted = n * rates[currency];
    try {
      return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(converted);
    } catch {
      return `${converted.toFixed(2)} ${currency}`;
    }
  }, [currency, rates]);

  const value = useMemo(
    () => ({ currency, setCurrency, format, supported: SUPPORTED }),
    [currency, setCurrency, format]
  );

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}
