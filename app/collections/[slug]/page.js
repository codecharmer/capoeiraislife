'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/lib/products-context';
import { ProductCard } from '@/components/store/ProductCard';
import { useLang } from '@/lib/i18n';

function CollectionPage() {
  const { slug } = useParams();
  const { t } = useLang();
  const { products, collections } = useProducts();
  const col = collections.find((c) => c.slug === slug);
  const isAll = slug === 'all';
  const title = isAll ? t.collPage.all : (t.cat[slug] ? t.cat[slug].name : 'Collection');
  const list = isAll ? products : products.filter((p) => p.catSlug === slug);

  return (
    <div className="pt-16">
      <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
        <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-primary">{t.collPage.home}</Link> / <span className="text-foreground">{title}</span>
        </div>
        <h1 className="font-anton text-5xl uppercase text-foreground md:text-6xl">{title}</h1>
        <p className="mt-2 text-muted-foreground">{list.length} {list.length === 1 ? t.collPage.product : t.collPage.products}</p>
        {list.length === 0 ? (
          <p className="mt-10 text-muted-foreground">{t.collPage.soon}</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {list.map((p, i) => (<ProductCard key={p.id} product={p} index={i} />))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CollectionPage;
