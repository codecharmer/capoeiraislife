import './globals.css';
import { Inter, Oswald, Anton } from 'next/font/google';
import { Providers } from './providers';
import { LangProvider } from '@/lib/i18n';
import { StoreProvider } from '@/lib/store-context';
import { ProductsProvider } from '@/lib/products-context';
import { getPrintfulCatalog } from '@/lib/printful';
import { Navbar } from '@/components/store/Navbar';
import { Footer } from '@/components/store/Footer';
import { AnnouncementBar } from '@/components/store/AnnouncementBar';
import { CartDrawer } from '@/components/store/CartDrawer';
import { SearchDialog } from '@/components/store/SearchDialog';
import { Toaster } from '@/components/ui/sonner';
import { LOGO } from '@/lib/store-data';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', weight: ['400', '500', '600', '700'], display: 'swap' });
const anton = Anton({ subsets: ['latin'], variable: '--font-anton', weight: '400', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://capoeira-drc.preview.emergentagent.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Capoeira is Life — Wear the Culture. Live the Movement.', template: '%s | Capoeira is Life' },
  description: 'Premium Capoeira lifestyle apparel. T-shirts, hoodies, tanks and accessories for capoeiristas worldwide. Wear the culture. Live the movement.',
  keywords: ['Capoeira', 'Capoeira apparel', 'Brazilian martial art clothing', 'capoeira hoodie', 'capoeira t-shirt', 'roda'],
  icons: { icon: LOGO, apple: LOGO },
  openGraph: { title: 'Capoeira is Life — Wear the Culture. Live the Movement.', description: 'Premium Capoeira lifestyle apparel for capoeiristas worldwide.', url: SITE_URL, siteName: 'Capoeira is Life', images: [{ url: LOGO, width: 1080, height: 1080 }], type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Capoeira is Life', description: 'Wear the culture. Live the movement.', images: [LOGO] },
};

const orgSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Capoeira is Life', url: SITE_URL, logo: LOGO, sameAs: ['https://www.instagram.com/capoeira.is.life', 'https://facebook.com'] };

// Re-fetch the Printful catalog at most every 10 minutes (ISR).
export const revalidate = 600;

export default async function RootLayout({ children }) {
  const catalog = await getPrintfulCatalog();
  return (
    <html lang="en" className={`dark ${inter.variable} ${oswald.variable} ${anton.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);' }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <LangProvider>
            <ProductsProvider products={catalog?.products} collections={catalog?.collections}>
              <StoreProvider>
                <AnnouncementBar />
                <Navbar />
                <main className="pt-9">{children}</main>
                <Footer />
                <CartDrawer />
                <SearchDialog />
                <Toaster position="top-center" theme="dark" richColors />
              </StoreProvider>
            </ProductsProvider>
          </LangProvider>
        </Providers>
      </body>
    </html>
  );
}
