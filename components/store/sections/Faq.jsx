'use client';

import { Reveal } from '../ui-bits';
import { useLang } from '@/lib/i18n';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Faq() {
  const { t } = useLang();
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 md:px-8">
      <Reveal className="mb-8 text-center">
        <p className="font-oswald text-xs font-semibold uppercase tracking-[0.3em] text-tropical">{t.faq.eyebrow}</p>
        <h2 className="mt-2 font-anton text-4xl uppercase text-foreground md:text-5xl">{t.faq.title}</h2>
      </Reveal>
      <Reveal>
        <Accordion type="single" collapsible className="w-full">
          {t.faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-oswald text-base uppercase tracking-wide hover:text-primary hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
