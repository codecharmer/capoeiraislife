'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

export function MobileStickyShop() {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
          <Link href="/collections/all" className="block w-full rounded-sm bg-primary py-3.5 text-center font-oswald text-sm font-semibold uppercase tracking-widest text-primary-foreground">{t.stickyShop}</Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
