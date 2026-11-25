import { Hero } from '@/components/storefront/Hero';
import { CollectionDiscovery } from '@/components/home/CollectionDiscovery';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { BrandStory } from '@/components/home/BrandStory';
import { PersonalizedFeature } from '@/components/home/PersonalizedFeature';
import { GiftingFeature } from '@/components/home/GiftingFeature';
import { Craftsmanship } from '@/components/home/Craftsmanship';
import { Testimonials } from '@/components/home/Testimonials';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { ServiceStrip } from '@/components/home/ServiceStrip';
import { listActiveCategories, listActiveProducts } from '@/lib/catalog/repository';
import { getAboutContent } from '@/lib/content/about';
import type { Product } from '@/types/catalog';

// Rebuilt at most every five minutes so new products and content show up without a deploy.
export const revalidate = 300;

async function loadHome() {
  try {
    const [featured, popular, newest, categories, about] = await Promise.all([
      listActiveProducts({ sort: 'newest', featured: true }),
      listActiveProducts({ sort: 'popular' }),
      listActiveProducts({ sort: 'newest' }),
      listActiveCategories(),
      getAboutContent(),
    ]);
    // Signature edit: pieces the team has featured, otherwise the best sellers by units sold.
    const signature: Product[] = featured.data.length > 0 ? featured.data : popular.data.filter((p) => p.soldCount > 0);
    return { configured: newest.configured, signature, newest: newest.data, categories: categories.data, about };
  } catch (err) {
    console.error('[home] catalogue unavailable', err);
    return { configured: false, signature: [], newest: [], categories: [], about: await getAboutContent() };
  }
}

export default async function HomePage() {
  const { configured, signature, newest, categories, about } = await loadHome();

  return (
    <>
      <Hero />
      <CollectionDiscovery categories={categories} />
      <ProductShowcase
        id="signature-heading"
        layout="editorial"
        eyebrow="Bestsellers"
        title="The Signature"
        accent="Edit."
        intro="A considered edit, for everyday wear and life's milestones alike."
        products={signature}
        configured={configured}
        viewAll={{ label: 'View all', href: '/shop?sort=popular' }}
      />
      <ProductShowcase
        id="new-heading"
        layout="rail"
        eyebrow="Just In"
        title="New"
        accent="Arrivals."
        products={newest}
        configured={configured}
        viewAll={{ label: 'Shop new arrivals', href: '/shop?sort=newest' }}
      />
      <BrandStory about={about} />
      <PersonalizedFeature />
      <GiftingFeature />
      <Craftsmanship about={about} />
      <Testimonials />
      <NewsletterSection />
      <ServiceStrip />
    </>
  );
}
