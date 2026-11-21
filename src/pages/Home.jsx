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
      {/* 1. HERO SECTION (Design.md Section 5.1) */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-start overflow-hidden pt-20">
        {/* Background Image with warm grading */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1800&auto=format&fit=crop"
            alt="Warm jewelry atelier mood"
            className="w-full h-full object-cover object-center filter brightness-95"
            fetchpriority="high"
          />
          {/* Top dark scrim for header legibility & gentle left-to-right scrim (rgba(10,42,34,0.35) to transparent per Design.md 401) */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep/75 via-deep/40 to-deep/65 lg:bg-gradient-to-r lg:from-deep/85 lg:via-deep/45 lg:to-transparent" />
        </div>

        <div className="relative z-10 max-w-page mx-auto px-6 lg:px-12 py-24 w-full">
          <div className="max-w-2xl text-ivory">
            {/* Small Label with Gold Rule per Design.md 404 */}
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-12 bg-gold" />
              <span className="text-xs uppercase tracking-label text-champagne font-medium">
                Spring-Lit Craft &bull; 2026 Collection
              </span>
            </div>

            {/* MaskLines Headline: Cormorant 500, Hero size, Ivory, one italic word per Design.md 403 */}
            <MaskLines
              lines={['Pieces you’ll', 'reach for', 'every morning.']}
              className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.02] tracking-tight text-ivory mb-6"
              lineClassName="first:not-italic nth-2:italic"
            />

            <p className="font-sans text-base sm:text-lg text-ivory/80 max-w-lg mb-10 leading-relaxed font-light">
              Fine &amp; fashion jewelry crafted in warm 18k gold vermeil, natural baroque pearls, and heritage kundan. Made for slow mornings and luminous evenings.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <Link
                to="/shop"
                className="relative overflow-hidden bg-forest text-ivory px-8 py-4 text-xs uppercase tracking-label font-medium group text-center"
              >
                <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-ink">
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

      {/* 2. MARQUEE STRIP (Champagne Band, 48px per Design.md 5.1) */}
      <div className="bg-champagne text-ink py-3.5 overflow-hidden border-y border-hairline select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-sans tracking-label uppercase font-medium">
          <span>Handpicked Demi-Fine Pieces</span>
          <span>&bull;</span>
          <span>18k Gold Dipped &amp; Sterling Silver</span>
          <span>&bull;</span>
          <span>Complimentary Delivery Across Pakistan Over PKR {BRAND.shipping.freeThreshold.toLocaleString()}</span>
          <span>&bull;</span>
          <span>7-Day Effortless Returns</span>
          <span>&bull;</span>
          <span>Signature Suede Keepsake Packaging</span>
          <span>&bull;</span>
          <span>Handcrafted In Lahore Atelier</span>
          <span>&bull;</span>
        </div>
      </div>

      {/* 3. CATEGORIES ARCHIVE (Ivory: Asymmetric Editorial Layout per Design.md 5.1) */}
      <section className="py-20 lg:py-28 bg-ivory">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
            <div>
              <span className="text-xs uppercase tracking-label text-moss block mb-2">
                The Curated Archive
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest font-normal">
                Curated by <span className="italic">Silhouette</span>
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-label text-moss hover:text-forest transition-colors mt-4 sm:mt-0 inline-flex items-center gap-1.5 py-1"
            >
              Browse All Categories &rarr;
            </Link>
          </div>

          {/* Asymmetric Category Grid: One tall (rings), two wide (necklaces, earrings), two square (bracelets, sets) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
            {/* 1. Rings (Tall Tile - 4 cols desktop) */}
            <div className="lg:col-span-4 aspect-[4/5] sm:aspect-auto sm:row-span-2 relative group overflow-hidden bg-cream">
              <Link to="/shop?category=rings" className="block w-full h-full relative">
                <img
                  src={CATEGORIES[0]?.image}
                  alt={CATEGORIES[0]?.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-ivory">
                  <span className="text-[10px] uppercase tracking-label text-champagne block mb-1">
                    {CATEGORIES[0]?.count || 8} Pieces
                  </span>
                  <h3 className="font-display text-2xl lg:text-3xl font-medium">
                    {CATEGORIES[0]?.name}
                  </h3>
                </div>
              </Link>
            </div>

            {/* 2. Necklaces (Wide Tile - 8 cols desktop) */}
            <div className="lg:col-span-8 aspect-[16/9] sm:aspect-[2/1] relative group overflow-hidden bg-cream">
              <Link to="/shop?category=necklaces" className="block w-full h-full relative">
                <img
                  src={CATEGORIES[1]?.image}
                  alt={CATEGORIES[1]?.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-ivory">
                  <span className="text-[10px] uppercase tracking-label text-champagne block mb-1">
                    {CATEGORIES[1]?.count || 8} Pieces
                  </span>
                  <h3 className="font-display text-2xl lg:text-3xl font-medium">
                    {CATEGORIES[1]?.name}
                  </h3>
                </div>
              </Link>
            </div>

            {/* 3. Earrings (Wide Tile - 4 cols desktop) */}
            <div className="lg:col-span-4 aspect-square sm:aspect-[4/3] relative group overflow-hidden bg-cream">
              <Link to="/shop?category=earrings" className="block w-full h-full relative">
                <img
                  src={CATEGORIES[2]?.image}
                  alt={CATEGORIES[2]?.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-ivory">
                  <span className="text-[10px] uppercase tracking-label text-champagne block mb-1">
                    {CATEGORIES[2]?.count || 8} Pieces
                  </span>
                  <h3 className="font-display text-2xl font-medium">
                    {CATEGORIES[2]?.name}
                  </h3>
                </div>
              </Link>
            </div>

            {/* 4. Bracelets & Bangles (Square - 4 cols desktop) */}
            <div className="lg:col-span-4 aspect-square sm:aspect-[4/3] relative group overflow-hidden bg-cream">
              <Link to="/shop?category=bracelets" className="block w-full h-full relative">
                <img
                  src={CATEGORIES[3]?.image}
                  alt={CATEGORIES[3]?.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-ivory">
                  <span className="text-[10px] uppercase tracking-label text-champagne block mb-1">
                    {CATEGORIES[3]?.count || 6} Pieces
                  </span>
                  <h3 className="font-display text-2xl font-medium">
                    {CATEGORIES[3]?.name}
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS (Cream Background: Horizontal Snap Carousel per Design.md 5.1) */}
      <section className="bg-cream py-20 lg:py-28 border-y border-hairline">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-label text-moss block mb-1">
                Just Unveiled
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-forest font-normal">
                New Additions to the <span className="italic">Collection</span>
              </h2>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 border border-hairline flex items-center justify-center hover:border-forest text-ink hover:text-forest transition-colors bg-ivory"
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 border border-hairline flex items-center justify-center hover:border-forest text-ink hover:text-forest transition-colors bg-ivory"
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Snap Scroll Container */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-6 px-6 lg:-mx-12 lg:px-12"
          >
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="w-[260px] sm:w-[290px] flex-shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL SPLIT (Ivory: Large 7-col image with 80px overlapping card per Design.md 5.1) */}
      <section className="py-24 lg:py-32 bg-ivory">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Large Image (7 columns) */}
            <div className="lg:col-span-7 h-[420px] sm:h-[540px] lg:h-[620px] relative overflow-hidden bg-cream">
              <ImageReveal
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial jewelry closeup"
                className="w-full h-full"
              />
            </div>

            {/* Overlapping Text Card (80px overlap on desktop) */}
            <div className="lg:col-span-6 lg:-ml-20 mt-8 lg:mt-0 z-10">
              <Reveal delay={0.2}>
                <div className="bg-cream p-8 sm:p-12 lg:p-14 border border-hairline shadow-soft max-w-xl">
                  <span className="text-[11px] uppercase tracking-label text-moss block mb-2">
                    Our Philosophy
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl text-forest font-normal leading-tight mb-6">
                    Designed for <span className="italic">quiet mornings</span> and enduring confidence.
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-ink/80 leading-relaxed font-light mb-8">
                    We believe everyday jewelry shouldn't be fragile, nor should it lose its golden warmth after a summer afternoon. Each piece is cast in hypoallergenic metals and coated with resilient microscopic sealants.
                  </p>
                  <Link
                    to="/about"
                    className="relative inline-block overflow-hidden bg-forest text-ivory px-8 py-3.5 text-xs uppercase tracking-label font-medium group"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                      Explore Our Story &rarr;
                    </span>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BESTSELLERS (Ivory: 4-Up Grid per Design.md 5.1) */}
      <section className="py-20 lg:py-28 bg-ivory border-t border-hairline">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-label text-moss block mb-1">
              Most Adored
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest font-normal">
              The Atelier <span className="italic">Bestsellers</span>
            </h2>
            <p className="text-sm text-moss mt-3 font-light">
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
              className="relative inline-block overflow-hidden bg-forest text-ivory px-10 py-4 text-xs uppercase tracking-label font-medium group"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
              <span className="relative transition-colors duration-300 group-hover:text-ink">
                View Entire Collection
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. OCCASION TABS (Mist Band per Design.md 5.1 & 2.1) */}
      <section className="bg-mist py-20 lg:py-28 border-y border-hairline">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="text-center max-w-lg mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-label text-forest/70 block mb-1">
              Curated by Moment
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest font-normal">
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
                  className={`text-xs uppercase tracking-label font-medium transition-colors relative pb-3 ${isActive ? 'text-forest' : 'text-moss hover:text-forest'
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

      {/* 8. CRAFT AND CARE (Maroon Band: The one dark band per Design.md Section 5.1 & 2.1.1) */}
      <section className="bg-maroon text-ivory py-20 lg:py-28 border-y border-hairline/20">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="max-w-xl mb-16">
            <span className="text-[11px] uppercase tracking-label text-champagne block mb-2">
              The Standard
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ivory font-normal">
              Artisan Craft &amp; <span className="italic">Client Care</span>
            </h2>
          </div>

          {/* 4 Numbered Items per Design.md 5.1 (01 Materials, 02 Finish, 03 Packaging, 04 Returns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-t border-champagne/20 pt-12">
            <div>
              <span className="font-display text-2xl text-champagne block mb-3 font-medium">01</span>
              <h3 className="font-display text-xl text-ivory mb-2 font-semibold">Precious Materials</h3>
              <p className="font-sans text-sm text-ivory/75 leading-relaxed font-light">
                Recycled 925 sterling silver, surgical stainless cores, and genuine freshwater baroque pearls selected one by one.
              </p>
            </div>

            <div>
              <span className="font-display text-2xl text-champagne block mb-3 font-medium">02</span>
              <h3 className="font-display text-xl text-ivory mb-2 font-semibold">Gold Immersion</h3>
              <p className="font-sans text-sm text-ivory/75 leading-relaxed font-light">
                Thick micron gold plating treated with a protective anti-tarnish ceramic wash to endure warm weather and daily wear.
              </p>
            </div>

            <div>
              <span className="font-display text-2xl text-champagne block mb-3 font-medium">03</span>
              <h3 className="font-display text-xl text-ivory mb-2 font-semibold">Curated Packaging</h3>
              <p className="font-sans text-sm text-ivory/75 leading-relaxed font-light">
                Every piece arrives tucked in our bespoke suede keepsake pouch, ready for celebratory gifting.
              </p>
            </div>

            <div>
              <span className="font-display text-2xl text-champagne block mb-3 font-medium">04</span>
              <h3 className="font-display text-xl text-ivory mb-2 font-semibold">Gentle Returns</h3>
              <p className="font-sans text-sm text-ivory/75 leading-relaxed font-light">
                Enjoy 7 calendar days to try your jewelry in morning light. Return or exchange with effortless courier pickup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CLIENT REVIEWS (Cream Background: Big Pull-Quote with Gold Stars per Design.md 5.1) */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[11px] uppercase tracking-label text-moss block mb-4">
            Client Words
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentReviewIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Gold Star Ratings */}
              <div className="flex justify-center gap-1 text-gold">
                {[...Array(REVIEWS[currentReviewIndex]?.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Big Serif Pull Quote */}
              <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl text-forest italic font-normal leading-relaxed">
                "{REVIEWS[currentReviewIndex]?.text}"
              </blockquote>

              <div className="pt-2">
                <p className="font-sans text-xs uppercase tracking-label font-medium text-forest">
                  {REVIEWS[currentReviewIndex]?.author}
                </p>
                <p className="text-xs text-moss mt-0.5">
                  {REVIEWS[currentReviewIndex]?.location} &bull; Verified Client
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-10">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentReviewIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentReviewIndex === idx ? 'bg-gold w-6' : 'bg-hairline hover:bg-moss'
                  }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 10. SOCIAL GALLERY STRIP (Ivory: 5 Square Images per Design.md 5.1) */}
      <section className="py-20 bg-ivory border-t border-hairline">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <span className="text-[11px] uppercase tracking-label text-moss block mb-1">
              Follow Along
            </span>
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-2xl sm:text-3xl text-forest hover:text-emerald transition-colors inline-block"
            >
              @minhajewellers on Instagram
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
              <div key={i} className="aspect-square bg-cream overflow-hidden group relative">
                <img
                  src={imgUrl}
                  alt={`Minha Jewellers community story ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-luxe group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-ivory">
                  <span className="text-xs uppercase tracking-label font-medium">View</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
