'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

export function AnnouncementBar() {
  const { t } = useLang();
  const msgs = t.announce;
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    const tmr = setInterval(() => setI((v) => (v + 1) % msgs.length), 3500);
    return () => clearInterval(tmr);
  }, [msgs]);
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-9 items-center justify-center overflow-hidden bg-primary text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="px-4 font-oswald text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-foreground"
        >
          {msgs[i % msgs.length]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
