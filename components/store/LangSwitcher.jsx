'use client';

import { Globe, Check } from 'lucide-react';
import { useLang, LOCALES } from '@/lib/i18n';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function LangSwitcher() {
  const { locale, setLocale } = useLang();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Change language" className="flex items-center gap-1 text-foreground transition hover:text-primary">
        <Globe size={19} />
        <span className="font-oswald text-xs font-semibold uppercase tracking-widest">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[9rem] border-border bg-popover">
        {LOCALES.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => setLocale(l.code)} className="flex cursor-pointer items-center justify-between font-oswald text-sm uppercase tracking-wide">
            {l.label}
            {locale === l.code && <Check size={14} className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
