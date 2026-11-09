import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Sparkles, Shield, Package, RotateCcw } from 'lucide-react';
import { PRODUCTS, CATEGORIES, OCCASIONS } from '../data/products';
import { REVIEWS } from '../data/reviews';
import { BRAND } from '../config/brand';
import ProductCard from '../components/ProductCard';
import { Reveal, MaskLines, ImageReveal } from '../motion/primitives';

export default function Home() {
  const [activeOccasion, setActiveOccasion] = useState('everyday');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const carouselRef = useRef(null);

  const newArrivals = PRODUCTS.filter((p) => p.isNew || p.badge === 'NEW');
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller || p.badge === 'BESTSELLER').slice(0, 4);
  const occasionProducts = PRODUCTS.filter((p) => p.occasions && p.occasions.includes(activeOccasion)).slice(0, 4);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % REVIEWS.length);
  };
  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <div className="overflow-hidden bg-ivory">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-start overflow-hidden pt-20">
        {/* Background Image with warm grading */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1800&auto=format&fit=crop"
            alt="Warm jewelry atelier mood"
            className="w-full h-full object-cover object-center filter brightness-95"
            fetchpriority="high"
          />
          {/* Top dark scrim for header visibility & gentle left gradient for editorial text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/35 to-noir/60 lg:bg-gradient-to-r lg:from-noir/80 lg:via-noir/45 lg:to-transparent" />
        </div>

        <div className="relative z-10 max-w-page mx-auto px-6 lg:px-12 py-24 w-full">
          <div className="max-w-2xl text-ivory">
            {/* Small Label with Gold Rule */}
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-10 bg-gold" />
              <span className="text-xs uppercase tracking-label text-champagne font-medium">
                Sunlit Radiance &bull; 2026 Collection
              </span>
            </div>

            {/* MaskLines Headline */}
            <MaskLines
              lines={['Pieces you’ll', 'reach for', 'every morning.']}
              className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.02] tracking-tight text-ivory mb-6"
            />

            <p className="font-sans text-base sm:text-lg text-ivory/80 max-w-lg mb-10 leading-relaxed font-light">
              Fine &amp; fashion jewelry crafted in warm 18k gold vermeil, natural baroque pearls, and heritage kundan. Made for slow mornings and luminous evenings.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <Link
                to="/shop"
                className="relative overflow-hidden bg-ivory text-ink px-8 py-4 text-xs uppercase tracking-label font-medium group text-center hover:bg-champagne transition-colors"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Shop the Collection <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <Link
                to="/about"
                className="text-ivory/90 hover:text-champagne transition-colors text-xs uppercase tracking-label font-medium underline underline-offset-8 text-center sm:text-left py-2"
              >
                Our Story &amp; Craft &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Cue indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory/70 flex flex-col items-center gap-2 pointer-events-none hidden sm:flex">
          <span className="text-[10px] uppercase tracking-label">Scroll to explore</span>
          <div className="w-[1px] h-8 bg-ivory/40 animate-pulse" />
        </div>
      </section>

      {/* 2. MARQUEE STRIP (Champagne Band) */}
      <div className="bg-champagne text-ink py-3.5 overflow-hidden border-y border-hairline select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-sans tracking-label uppercase font-medium">
          <span>Handpicked Demi-Fine Pieces</span>
          <span>&bull;</span>
          <span>Complimentary Delivery over PKR 5,000</span>
          <span>&bull;</span>
          <span>7-Day Return &amp; Exchange Guarantee</span>
          <span>&bull;</span>
          <span>Cash on Delivery Across Pakistan</span>
          <span>&bull;</span>
          <span>100% Hypoallergenic &amp; Lead Free</span>
          <span>&bull;</span>
          <span>Handpicked Demi-Fine Pieces</span>
          <span>&bull;</span>
          <span>Complimentary Delivery over PKR 5,000</span>
          <span>&bull;</span>
          <span>7-Day Return &amp; Exchange Guarantee</span>
          <span>&bull;</span>
          <span>Cash on Delivery Across Pakistan</span>
          <span>&bull;</span>
          <span>100% Hypoallergenic &amp; Lead Free</span>
        </div>
      </div>

      {/* 3. SHOP BY CATEGORY (Asymmetric Editorial Grid) */}
      <section className="py-20 lg:py-28 max-w-page mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-label text-taupe block mb-1">
              Curated Categories
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
              Explore by <span className="italic">Silhouette</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-label font-medium text-ink hover:text-gold transition-colors mt-4 md:mt-0 flex items-center gap-1.5"
          >
            All Collections <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Asymmetric Category Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tile 1: Rings (Tall 5-col on desktop) */}
          <Link
            to="/shop/rings"
            className="md:col-span-5 relative group overflow-hidden bg-cream aspect-[4/5] flex items-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=900&auto=format&fit=crop"
              alt="Rings category"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/20 to-transparent" />
            <div className="relative z-10 text-ivory flex justify-between items-end w-full">
              <div>
                <span className="text-[10px] uppercase tracking-label text-champagne block mb-1">
                  8 Designs
                </span>
                <h3 className="font-display text-3xl font-medium">Rings &amp; Bands</h3>
              </div>
              <span className="w-9 h-9 rounded-full border border-ivory/40 flex items-center justify-center group-hover:bg-ivory group-hover:text-ink transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Right column: 7-col split into 4 tiles */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tile 2: Necklaces */}
            <Link
              to="/shop/necklaces"
              className="relative group overflow-hidden bg-cream aspect-square flex items-end p-6"
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
                alt="Necklaces category"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/20 to-transparent" />
              <div className="relative z-10 text-ivory">
                <span className="text-[10px] uppercase tracking-label text-champagne block mb-1">
                  Collar &amp; Pendants
                </span>
                <h3 className="font-display text-2xl font-medium">Necklaces</h3>
              </div>
            </Link>

            {/* Tile 3: Earrings */}
            <Link
              to="/shop/earrings"
              className="relative group overflow-hidden bg-cream aspect-square flex items-end p-6"
            >
              <img
                src="https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
                alt="Earrings category"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/20 to-transparent" />
              <div className="relative z-10 text-ivory">
                <span className="text-[10px] uppercase tracking-label text-champagne block mb-1">
                  Huggies &amp; Drops
                </span>
                <h3 className="font-display text-2xl font-medium">Earrings</h3>
              </div>
            </Link>

            {/* Tile 4: Bracelets */}
            <Link
              to="/shop/bracelets"
              className="relative group overflow-hidden bg-cream aspect-square flex items-end p-6"
            >
              <img
                src="https://images.unsplash.com/photo-1611591475824-340801a23864?q=80&w=800&auto=format&fit=crop"
                alt="Bracelets category"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/20 to-transparent" />
              <div className="relative z-10 text-ivory">
                <span className="text-[10px] uppercase tracking-label text-champagne block mb-1">
                  Cuffs &amp; Tennis
                </span>
                <h3 className="font-display text-2xl font-medium">Bracelets</h3>
              </div>
            </Link>

            {/* Tile 5: Sets */}
            <Link
              to="/shop/sets"
              className="relative group overflow-hidden bg-cream aspect-square flex items-end p-6"
            >
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
                alt="Sets category"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/20 to-transparent" />
              <div className="relative z-10 text-ivory">
                <span className="text-[10px] uppercase tracking-label text-champagne block mb-1">
                  Heritage Sets
                </span>
                <h3 className="font-display text-2xl font-medium">Bridal &amp; Sets</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS (Horizontal Carousel with snap) */}
      <section className="bg-cream py-20 lg:py-28 border-y border-hairline">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[11px] uppercase tracking-label text-taupe block mb-1">
                Just Arrived
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal">
                New In the <span className="italic">Atelier</span>
              </h2>
            </div>
            {/* Carousel navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 border border-hairline rounded-full flex items-center justify-center hover:bg-ivory hover:border-gold transition-colors text-ink"
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 border border-hairline rounded-full flex items-center justify-center hover:bg-ivory hover:border-gold transition-colors text-ink"
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4"
          >
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL SPLIT (Large image + overlapping text card) */}
      <section className="py-24 lg:py-32 max-w-page mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          {/* Large image 7 cols */}
          <div className="lg:col-span-7 relative h-[480px] sm:h-[600px] overflow-hidden bg-cream">
            <ImageReveal
              src="https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=1200&auto=format&fit=crop"
              alt="Editorial model wearing Aurelle Jewels"
              className="w-full h-full"
            />
          </div>

          {/* Overlapping Text Card 6 cols */}
          <div className="lg:col-span-5 lg:-ml-16 z-10 bg-ivory p-8 sm:p-12 border border-hairline shadow-soft">
            <span className="text-[11px] uppercase tracking-label text-gold font-medium block mb-3">
              01 &bull; The Philosophy
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal leading-snug mb-5">
              Sensory, intimate, and sculpted for <span className="italic">daily grace</span>.
            </h2>
            <p className="font-sans text-sm text-taupe leading-relaxed mb-6 font-light">
              We reject the cold glass cases of traditional jewelry stores. Every Aurelle piece is weighed for real movement: heavy enough to feel genuine, light enough to wear from a morning cappuccino through late night laughter.
            </p>
            <div className="space-y-3 pt-2 pb-6 border-y border-hairline text-xs font-sans text-ink">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Heavy 18k and 22k gold immersion plating</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Anti-tarnish transparent ceramic sealed finish</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Shipped in our signature velvet-cushioned boxes</span>
              </div>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-medium text-ink hover:text-gold transition-colors pt-6"
            >
              Discover Our Atelier Story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. BESTSELLERS (4-column Grid) */}
      <section className="py-20 lg:py-28 bg-ivory border-t border-hairline">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-label text-taupe block mb-1">
              Most Loved
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
              Signature <span className="italic">Bestsellers</span>
            </h2>
            <p className="text-sm text-taupe mt-3 font-light">
              The everyday icons that have earned permanent residency on dressing tables nationwide.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/shop"
              className="relative inline-block overflow-hidden bg-ink text-ivory px-10 py-4 text-xs uppercase tracking-label font-medium group"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
              <span className="relative transition-colors duration-300 group-hover:text-ink">
                View Entire Collection
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. OCCASION TABS (Blush Band) */}
      <section className="bg-blush/40 py-20 lg:py-28 border-y border-hairline">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="text-center max-w-lg mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-label text-taupe block mb-1">
              Curated by Moment
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal">
              Jewelry for <span className="italic">Every Chapter</span>
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center gap-6 sm:gap-10 border-b border-hairline pb-4 mb-12">
            {OCCASIONS.map((occ) => {
              const isActive = activeOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => setActiveOccasion(occ.id)}
                  className={`text-xs uppercase tracking-label font-medium transition-colors relative pb-3 ${
                    isActive ? 'text-ink' : 'text-taupe hover:text-ink'
                  }`}
                >
                  {occ.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeOccasionTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Occasion Products Row with Crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOccasion}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {occasionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 8. CRAFT AND CARE (Dark Noir Band with 4 Numbered Items) */}
      <section className="bg-noir text-ivory py-20 lg:py-28 border-y border-hairline/20">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="max-w-xl mb-16">
            <span className="text-[11px] uppercase tracking-label text-champagne block mb-2">
              The Standard
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ivory font-normal">
              Artisan Craft &amp; <span className="italic">Client Care</span>
            </h2>
          </div>

          {/* 4 Numbered Items (Not Icon Cards per PRD strict rules) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-t border-champagne/15 pt-12">
            <div>
              <span className="font-display text-2xl text-champagne block mb-3 font-medium">01</span>
              <h3 className="font-display text-xl text-ivory mb-2 font-semibold">Precious Materials</h3>
              <p className="font-sans text-sm text-ivory/70 leading-relaxed font-light">
                Recycled 925 sterling silver, surgical stainless cores, and genuine freshwater baroque pearls selected one by one.
              </p>
            </div>
            <div>
              <span className="font-display text-2xl text-champagne block mb-3 font-medium">02</span>
              <h3 className="font-display text-xl text-ivory mb-2 font-semibold">Micron Vermeil Finish</h3>
              <p className="font-sans text-sm text-ivory/70 leading-relaxed font-light">
                Thick 18k and 22k gold immersion sealed with a microscopic anti-tarnish ceramic coat for enduring daily luster.
              </p>
            </div>
            <div>
              <span className="font-display text-2xl text-champagne block mb-3 font-medium">03</span>
              <h3 className="font-display text-xl text-ivory mb-2 font-semibold">Velvet Keepsake Box</h3>
              <p className="font-sans text-sm text-ivory/70 leading-relaxed font-light">
                Every order arrives encased in our signature rigid cream box with a custom microfiber travel pouch and polishing cloth.
              </p>
            </div>
            <div>
              <span className="font-display text-2xl text-champagne block mb-3 font-medium">04</span>
              <h3 className="font-display text-xl text-ivory mb-2 font-semibold">Unhurried 7-Day Returns</h3>
              <p className="font-sans text-sm text-ivory/70 leading-relaxed font-light">
                Try your pieces at home in your own lighting. If anything does not suit your style, our team arranges immediate exchange.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REVIEWS (Big Pull-Quote Rotator) */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-1.5 mb-6 text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gold text-gold" />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentReviewIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl text-ink font-normal leading-relaxed italic mb-8 max-w-3xl mx-auto">
                &ldquo;{REVIEWS[currentReviewIndex].quote}&rdquo;
              </blockquote>

              <div className="text-sm">
                <span className="font-medium text-ink tracking-wide block">
                  {REVIEWS[currentReviewIndex].author} &bull; {REVIEWS[currentReviewIndex].city}
                </span>
                <span className="text-xs text-taupe mt-0.5 block">
                  Purchased {REVIEWS[currentReviewIndex].product}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots navigation */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentReviewIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  idx === currentReviewIndex ? 'w-8 bg-gold' : 'w-2 bg-hairline hover:bg-taupe'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 10. INSTAGRAM GALLERY STRIP */}
      <section className="py-20 lg:py-24 bg-ivory">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-[11px] uppercase tracking-label text-taupe block mb-1">
                @aurellejewels
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-ink font-normal">
                Worn in the <span className="italic">Wild</span>
              </h3>
            </div>
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-label text-ink hover:text-gold transition-colors underline underline-offset-4 mt-2 sm:mt-0"
            >
              Follow on Instagram &rarr;
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1611591475824-340801a23864?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
            ].map((imgUrl, i) => (
              <a
                key={i}
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-cream block"
              >
                <img
                  src={imgUrl}
                  alt={`Aurelle client moment ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-luxe group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-noir/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-ivory">
                  <span className="text-xs uppercase tracking-label font-medium bg-ivory text-ink px-3 py-1.5 shadow-sm">
                    View
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

