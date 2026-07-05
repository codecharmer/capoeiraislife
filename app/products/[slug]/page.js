'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/lib/products-context';
import { useStore } from '@/lib/store-context';
import { useLang } from '@/lib/i18n';
import { Stars, formatPrice, badgeStyles } from '@/components/store/ui-bits';
import { ProductCard } from '@/components/store/ProductCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Truck, ShieldCheck, RefreshCw, Ruler, Minus, Plus, Check } from 'lucide-react';

const SIZE_GUIDE = [
  ['XS', '32-34', '26-28'], ['S', '35-37', '29-31'], ['M', '38-40', '32-34'],
  ['L', '41-43', '35-37'], ['XL', '44-46', '38-40'], ['XXL', '47-49', '41-43'],
];

function ProductPage() {
  const { slug } = useParams();
  const { t } = useLang();
  const { products } = useProducts();
  const product = products.find((p) => p.slug === slug);
  const { addToCart, setCartOpen, checkout } = useStore();
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product ? product.colors[0].name : null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-16 text-center">
        <h1 className="font-anton text-4xl uppercase text-foreground">{t.product.notFound}</h1>
        <Link href="/collections/all" className="rounded-sm bg-primary px-8 py-3 font-oswald uppercase tracking-widest text-primary-foreground">{t.product.shopAll}</Link>
      </div>
    );
  }

  const pc = t.pc[product.id] || { tagline: product.description || product.title, material: '', fit: '' };
  const pr = t.product;
  const sections = [
    { title: pr.sections.story, body: `${pc.tagline} ${pr.storySuffix}` },
    { title: pr.sections.features, list: pr.features },
    { title: pr.sections.materials, body: pc.material },
    { title: pr.sections.fit, body: pc.fit },
    { title: pr.sections.care, body: pr.care },
    { title: pr.sections.shipping, body: pr.shippingBody },
    { title: pr.sections.returns, body: pr.returnsBody },
  ];
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);
  const gallery = product.images.length > 1 ? product.images : [product.images[0], product.images[0]];
  const hasSizeChoice = product.sizes.length > 1;
  const sizeLabel = (s) => (s === 'One Size' ? t.oneSize : s);
  const defaultSizeLabel = sizeLabel(product.sizes[0]);

  const doAdd = (buyNow = false) => {
    const chosen = size || product.sizes[0];
    const variantId = product.variantIndex
      ? (product.variantIndex[`${color}|${chosen}`] || Object.values(product.variantIndex)[0] || null)
      : null;
    addToCart(product, { color, size: chosen, qty, variantId });
    if (buyNow) { setCartOpen(false); checkout(); }
  };

  const productSchema = {
    '@context': 'https://schema.org', '@type': 'Product', name: product.title, image: product.images,
    description: pc.tagline, brand: { '@type': 'Brand', name: 'Capoeira is Life' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews },
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
  };

  return (
    <div className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <div className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-primary">{pr.home}</Link> / <Link href="/collections/all" className="hover:text-primary">{pr.shop}</Link> / <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary">
              <img src={gallery[active]} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              {product.badge && (<span className={`absolute left-4 top-4 rounded-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${badgeStyles[product.badge] || 'bg-white text-black'}`}>{t.badges[product.badge]}</span>)}
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
              {gallery.map((src, i) => (
                <button key={i} onClick={() => setActive(i)} className={`h-24 w-20 shrink-0 overflow-hidden rounded-sm border-2 transition ${active === i ? 'border-primary' : 'border-transparent opacity-70'}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <h1 className="font-anton text-3xl uppercase text-foreground md:text-4xl">{product.title}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Stars rating={product.rating} size={16} />
              <span className="text-sm text-muted-foreground">{product.rating} · {product.reviews} {pr.reviews}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold text-foreground">{formatPrice(product.price)}</span>
              {product.compareAt && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>}
              {product.compareAt && <span className="rounded-sm bg-primary/15 px-2 py-1 text-xs font-semibold text-primary">{pr.save} {formatPrice(product.compareAt - product.price)}</span>}
            </div>

            <div className="mt-6">
              <p className="font-oswald text-xs uppercase tracking-widest text-muted-foreground">{pr.color}: <span className="text-foreground">{t.colors[color] || color}</span></p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)} title={t.colors[c.name] || c.name} className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${color === c.name ? 'border-primary' : 'border-border'}`}>
                    <span className="h-6 w-6 rounded-full border border-white/20" style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="font-oswald text-xs uppercase tracking-widest text-muted-foreground">{pr.size} {size && <span className="text-foreground">{sizeLabel(size)}</span>}</p>
                <Dialog>
                  <DialogTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Ruler size={13} /> {pr.sizeGuide}</DialogTrigger>
                  <DialogContent className="border-border bg-background">
                    <DialogHeader><DialogTitle className="font-oswald uppercase tracking-widest">{pr.guideTitle}</DialogTitle></DialogHeader>
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="py-2">{pr.gSize}</th><th>{pr.gChest}</th><th>{pr.gWaist}</th></tr></thead>
                      <tbody>
                        {SIZE_GUIDE.map((r) => (<tr key={r[0]} className="border-b border-border/50"><td className="py-2 font-medium">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>))}
                      </tbody>
                    </table>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`min-w-[3rem] rounded-sm border px-3 py-2.5 font-oswald text-sm uppercase transition ${size === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary'}`}>{sizeLabel(s)}</button>
                ))}
              </div>
              {hasSizeChoice && !size && <p className="mt-2 text-xs text-muted-foreground">{pr.selectSizePre} {defaultSizeLabel}{pr.selectSizePost}</p>}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <p className="font-oswald text-xs uppercase tracking-widest text-muted-foreground">{pr.qty}</p>
              <div className="flex items-center gap-4 rounded-sm border border-border px-3 py-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus size={16} /></button>
                <span className="w-5 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase"><Plus size={16} /></button>
              </div>
            </div>

            <div className="mt-6 hidden gap-3 md:flex">
              <button onClick={() => doAdd(false)} className="flex-1 rounded-sm border border-primary py-4 font-oswald text-sm font-semibold uppercase tracking-widest text-primary transition hover:bg-primary/10">{pr.add}</button>
              <button onClick={() => doAdd(true)} className="flex-1 rounded-sm bg-primary py-4 font-oswald text-sm font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110">{pr.buy}</button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-border py-4 text-center">
              <div className="flex flex-col items-center gap-1"><Truck size={18} className="text-primary" /><span className="text-[11px] text-muted-foreground">{pr.freeShip}</span></div>
              <div className="flex flex-col items-center gap-1"><RefreshCw size={18} className="text-primary" /><span className="text-[11px] text-muted-foreground">{pr.ret30}</span></div>
              <div className="flex flex-col items-center gap-1"><ShieldCheck size={18} className="text-primary" /><span className="text-[11px] text-muted-foreground">{pr.secure}</span></div>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Check size={15} className="text-primary" /> {pr.ships}</p>
            <div className="mt-3 flex items-center gap-2">
              {['VISA', 'MC', 'AMEX', 'PAYPAL'].map((p) => (<span key={p} className="rounded-sm border border-border px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground">{p}</span>))}
            </div>

            <Accordion type="single" collapsible defaultValue="item-0" className="mt-8 w-full">
              {sections.map((s, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="font-oswald text-sm uppercase tracking-wide hover:text-primary hover:no-underline">{s.title}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {s.list ? (
                      <ul className="space-y-1">{s.list.map((li, k) => (<li key={k} className="flex items-center gap-2"><Check size={14} className="text-primary" /> {li}</li>))}</ul>
                    ) : s.body}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-anton text-3xl uppercase text-foreground md:text-4xl">{pr.complete}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p, i) => (<ProductCard key={p.id} product={p} index={i} />))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="shrink-0"><p className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</p><p className="text-[10px] uppercase text-muted-foreground">{sizeLabel(size || product.sizes[0])}</p></div>
        <button onClick={() => doAdd(false)} className="flex-1 rounded-sm border border-primary py-3 font-oswald text-xs font-semibold uppercase tracking-widest text-primary">{t.cart.add}</button>
        <button onClick={() => doAdd(true)} className="flex-1 rounded-sm bg-primary py-3 font-oswald text-xs font-semibold uppercase tracking-widest text-primary-foreground">{pr.buy}</button>
      </div>
    </div>
  );
}

export default ProductPage;
