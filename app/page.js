import { Hero } from '@/components/store/sections/Hero';
import { SocialProof } from '@/components/store/sections/SocialProof';
import { Collections } from '@/components/store/sections/Collections';
import { BestSellers } from '@/components/store/sections/BestSellers';
import { Lifestyle } from '@/components/store/sections/Lifestyle';
import { InstagramFeed } from '@/components/store/sections/InstagramFeed';
import { Testimonials } from '@/components/store/sections/Testimonials';
import { Faq } from '@/components/store/sections/Faq';
import { Newsletter } from '@/components/store/sections/Newsletter';
import { MobileStickyShop } from '@/components/store/sections/MobileStickyShop';

function App() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Collections />
      <BestSellers />
      <Lifestyle />
      <InstagramFeed />
      <Testimonials />
      <Faq />
      <Newsletter />
      <MobileStickyShop />
    </>
  );
}

export default App;
