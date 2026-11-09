import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand';
import { ImageReveal, Reveal } from '../motion/primitives';

export default function About() {
  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory">
      {/* 1. Opening Statement */}
      <section className="max-w-page mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-label text-gold font-medium block mb-4">
            Our Origin &bull; Lahore Atelier
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-ink font-normal leading-[1.05]">
            Jewelry that feels like walking into a <span className="italic">quiet, sunlit showroom</span>.
          </h1>
          <p className="font-sans text-base sm:text-lg text-taupe mt-8 leading-relaxed font-light">
            Founded with a conviction that jewelry should not hide behind heavy glass cases or high markups. We create tactile, unhurried fine and fashion jewelry that brings quiet confidence to daily wear.
          </p>
        </div>
      </section>

      {/* 2. Story: Staggered Imagery + Text */}
      <section className="bg-cream py-20 lg:py-28 border-y border-hairline">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Staggered Images 6 cols */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6 items-end">
              <div className="aspect-[3/4] overflow-hidden bg-ivory border border-hairline shadow-soft">
                <ImageReveal
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
                  alt="Pearls in workshop"
                  className="w-full h-full"
                />
              </div>
              <div className="aspect-[4/5] overflow-hidden bg-ivory border border-hairline translate-y-6 sm:translate-y-10 shadow-soft">
                <ImageReveal
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
                  alt="Rings in natural light"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Story Text 6 cols */}
            <div className="lg:col-span-6 space-y-6 lg:pl-8">
              <span className="text-[11px] uppercase tracking-label text-taupe block">
                The Narrative
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal leading-snug">
                Crafted for genuine wear, not just <span className="italic">occasional display</span>.
              </h2>
              <p className="font-sans text-sm text-taupe leading-relaxed font-light">
                Jewelry in Pakistan has often been split between mass-produced trinkets that tarnish after two outings and heavy heritage gold locked in safety deposit vaults.
              </p>
              <p className="font-sans text-sm text-taupe leading-relaxed font-light">
                {BRAND.name} occupies the luminous middle: demi-fine jewelry made with thick 18k micron gold immersion, 925 silver cores, and hand-selected baroque pearls that withstand heat, humidity, and active days without losing their warm morning luster.
              </p>
              <div className="pt-2 text-xs uppercase tracking-label text-ink font-medium">
                Hand-finished in small batches &bull; Never mass-cast
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Values: Numbered Rows (PRD strict rule: Not Icon Cards) */}
      <section className="py-24 lg:py-32 max-w-page mx-auto px-6 lg:px-12">
        <div className="max-w-xl mb-16">
          <span className="text-[11px] uppercase tracking-label text-gold font-medium block mb-2">
            The Pillars
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
            Three principles that guide <span className="italic">every mold</span>.
          </h2>
        </div>

        <div className="divide-y divide-hairline border-y border-hairline">
          <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
            <span className="font-display text-3xl text-gold font-medium md:col-span-2">01</span>
            <h3 className="font-display text-2xl text-ink font-semibold md:col-span-4">Skin-Safe Metallurgy</h3>
            <p className="font-sans text-sm text-taupe font-light leading-relaxed md:col-span-6">
              100% of our earrings, cuffs, and rings are forged without nickel, lead, or cadmium. We employ surgical-grade stainless cores and 925 sterling silver posts so you never experience ear sensitivity or discoloration.
            </p>
          </div>

          <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
            <span className="font-display text-3xl text-gold font-medium md:col-span-2">02</span>
            <h3 className="font-display text-2xl text-ink font-semibold md:col-span-4">Organic Individuality</h3>
            <p className="font-sans text-sm text-taupe font-light leading-relaxed md:col-span-6">
              No two freshwater pearls or hand-cut kundan stones are identical. We celebrate subtle irregularities, organic curves, and natural textures over clinical symmetry.
            </p>
          </div>

          <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
            <span className="font-display text-3xl text-gold font-medium md:col-span-2">03</span>
            <h3 className="font-display text-2xl text-ink font-semibold md:col-span-4">Respectful Client Care</h3>
            <p className="font-sans text-sm text-taupe font-light leading-relaxed md:col-span-6">
              An unhurried 7-day exchange window, courteous local courier dispatch, and direct WhatsApp concierge access. We treat our clients like guests in our home.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Process Strip */}
      <section className="bg-noir text-ivory py-20 lg:py-24 border-y border-hairline/20">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="text-center max-w-lg mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-label text-champagne block mb-1">
              From Wax to Velvet
            </span>
            <h3 className="font-display text-3xl sm:text-4xl text-ivory font-normal">
              The Journey of a <span className="italic">Piece</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-zinc-900 overflow-hidden border border-champagne/20">
                <img
                  src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop"
                  alt="Metalsmithing"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display text-lg text-champagne block">Step I &bull; Sculpting &amp; Casting</span>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                Hand-carved wax prototypes translated into precise metal molds, ensuring exact dimensional balance.
              </p>
            </div>

            <div className="space-y-4">
              <div className="aspect-[4/3] bg-zinc-900 overflow-hidden border border-champagne/20">
                <img
                  src="https://images.unsplash.com/photo-1611591475824-340801a23864?q=80&w=600&auto=format&fit=crop"
                  alt="Polishing and plating"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display text-lg text-champagne block">Step II &bull; Micron Deposition</span>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                Submerged in 18k gold immersion baths, followed by an invisible anti-tarnish ceramic seal.
              </p>
            </div>

            <div className="space-y-4">
              <div className="aspect-[4/3] bg-zinc-900 overflow-hidden border border-champagne/20">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
                  alt="Velvet packaging"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display text-lg text-champagne block">Step III &bull; Velvet Enclosure</span>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                Polished by hand, settled in rigid cream keepsake packaging with bespoke suede travel pouch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Closing Blush CTA Band */}
      <section className="bg-blush/40 py-20 lg:py-28 text-center border-b border-hairline">
        <div className="max-w-xl mx-auto px-6">
          <span className="text-[11px] uppercase tracking-label text-taupe block mb-2">
            Begin Your Collection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal mb-8">
            Find the piece meant to <span className="italic">accompany you</span>.
          </h2>
          <Link
            to="/shop"
            className="relative inline-block overflow-hidden bg-ink text-ivory px-10 py-4 text-xs uppercase tracking-label font-medium group"
          >
            <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
            <span className="relative transition-colors duration-300 group-hover:text-ink">
              Shop All Pieces &rarr;
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

