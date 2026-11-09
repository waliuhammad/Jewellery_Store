import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Minus,
  Plus,
  Share2,
  Check,
  Shield,
  RotateCcw,
  Truck,
  MessageCircle,
  Star,
  ChevronDown,
  Ruler,
  X,
  CreditCard,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { BRAND } from '../config/brand';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  // States
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(
    product.finishes ? product.finishes[0] : product.finish
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Zoom on desktop
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  // Accordion open states
  const [openAccordion, setOpenAccordion] = useState('details');

  // Sticky mobile bar
  const mainCtaRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setSelectedFinish(product.finishes ? product.finishes[0] : product.finish);
    setSelectedSize(product.sizes ? product.sizes[0] : 'Standard');
    setQuantity(1);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!mainCtaRef.current) return;
      const rect = mainCtaRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos({ x: 0, y: 0, show: false });
  };

  const handleAddToCart = () => {
    addToCart(
      product,
      { finish: selectedFinish, size: selectedSize },
      quantity,
      true
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const isSaved = isInWishlist(product.id);

  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? '' : name);
  };

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  // WhatsApp order URL
  const whatsappMessage = encodeURIComponent(
    `Hello Aurelle Jewels, I would like to order "${product.name}" (${selectedFinish}, ${selectedSize}) priced at ${BRAND.currency.format(product.price)}. Please share delivery details.`
  );
  const whatsappUrl = `https://wa.me/${BRAND.contact.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-label text-taupe mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          <span>/</span>
          <Link to={`/shop/${product.category}`} className="hover:text-ink capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ink font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Gallery Column (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails (Vertical on desktop) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 flex-shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 md:w-20 md:h-24 overflow-hidden border transition-all flex-shrink-0 bg-cream ${
                    selectedImage === idx
                      ? 'border-ink opacity-100'
                      : 'border-hairline opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Interactive Image with Lens Zoom */}
            <div
              className="relative flex-1 aspect-[4/5] bg-cream overflow-hidden border border-hairline cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover select-none"
              />

              {/* Magnified zoom layer on desktop hover */}
              {zoomPos.show && (
                <div
                  className="hidden lg:block absolute inset-0 pointer-events-none bg-no-repeat z-20"
                  style={{
                    backgroundImage: `url(${product.images[selectedImage]})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '220%',
                  }}
                />
              )}

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-label font-medium px-3 py-1 bg-ivory text-ink border border-hairline">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Sticky Info Panel (5 cols on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-label text-taupe block mb-1">
                Aurelle &bull; {product.category}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-gold text-gold'
                          : 'fill-hairline text-hairline'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-ink font-medium">{product.rating}</span>
                <span className="text-taupe">({product.reviewCount} verified reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-2xl sm:text-3xl font-medium text-ink">
                  {BRAND.currency.format(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="font-sans text-sm text-taupe line-through">
                    {BRAND.currency.format(product.compareAtPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-[11px] uppercase tracking-label font-medium px-2 py-0.5 bg-rose text-ivory">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
            </div>

            {/* Short Tagline / Description */}
            <p className="font-sans text-sm text-taupe leading-relaxed font-light">
              {product.description}
            </p>

            <div className="pt-2 border-t border-hairline space-y-5">
              {/* Finish Selector */}
              {product.finishes && product.finishes.length > 0 && (
                <div>
                  <div className="flex justify-between text-xs uppercase tracking-label mb-2">
                    <span className="text-ink font-medium">Luster &amp; Finish</span>
                    <span className="text-taupe">{selectedFinish}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.finishes.map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFinish(f)}
                        className={`px-4 py-2 text-xs border transition-colors ${
                          selectedFinish === f
                            ? 'border-ink bg-cream font-medium text-ink'
                            : 'border-hairline text-taupe hover:text-ink'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs uppercase tracking-label mb-2">
                    <span className="text-ink font-medium">Size</span>
                    <button
                      onClick={() => setIsSizeModalOpen(true)}
                      className="text-gold underline flex items-center gap-1 hover:text-ink"
                    >
                      <Ruler className="w-3 h-3" /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 text-xs border transition-colors ${
                          selectedSize === s
                            ? 'border-ink bg-cream font-medium text-ink'
                            : 'border-hairline text-taupe hover:text-ink'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Actions */}
              <div className="pt-2 space-y-3" ref={mainCtaRef}>
                <div className="flex gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-hairline bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-3 text-taupe hover:text-ink transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-sans text-sm font-medium text-ink min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-3 text-taupe hover:text-ink transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Bag Primary Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 relative overflow-hidden py-4 text-xs uppercase tracking-label font-medium transition-all group flex items-center justify-center gap-2 ${
                      isAdded ? 'bg-sage text-ivory' : 'bg-ink text-ivory'
                    }`}
                  >
                    {!isAdded && (
                      <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                    )}
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                      {isAdded ? 'Added to Bag &bull; Opening' : 'Add to Bag'}
                    </span>
                    {isAdded && <Check className="w-4 h-4 text-ivory relative z-10" />}
                  </button>

                  {/* Wishlist Toggle Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-4 border transition-colors flex items-center justify-center ${
                      isSaved ? 'border-rose bg-blush/30 text-rose' : 'border-hairline hover:border-ink text-ink'
                    }`}
                    aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose text-rose' : ''}`} strokeWidth={1.5} />
                  </button>
                </div>

                {/* WhatsApp Order Link */}
                <div className="text-center pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-label text-taupe hover:text-ink underline underline-offset-4"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-sage" /> Order or inquire on WhatsApp &rarr;
                  </a>
                </div>
              </div>

              {/* Trust Row */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-hairline text-center text-[11px] text-taupe">
                <div className="flex flex-col items-center gap-1.5 p-2">
                  <RotateCcw className="w-4 h-4 text-gold" strokeWidth={1.4} />
                  <span>7-Day Easy Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2">
                  <Truck className="w-4 h-4 text-gold" strokeWidth={1.4} />
                  <span>2-3 Days Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2">
                  <Shield className="w-4 h-4 text-gold" strokeWidth={1.4} />
                  <span>Non-Tarnish Finish</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="divide-y divide-hairline border-b border-hairline text-xs">
                {/* Accordion 1: Details & Materials */}
                <div>
                  <button
                    onClick={() => toggleAccordion('details')}
                    className="w-full py-4 flex items-center justify-between text-ink font-medium uppercase tracking-label text-left"
                  >
                    <span>Details &amp; Materials</span>
                    <ChevronDown
                      className={`w-4 h-4 text-taupe transition-transform duration-300 ${
                        openAccordion === 'details' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'details' && (
                    <div className="pb-4 text-taupe space-y-2 font-light leading-relaxed">
                      <p><strong className="font-medium text-ink">Material Core:</strong> {product.material}</p>
                      <p><strong className="font-medium text-ink">Luster:</strong> {product.finish}</p>
                      <ul className="list-disc pl-4 space-y-1 pt-1">
                        {product.details?.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Care Guide */}
                <div>
                  <button
                    onClick={() => toggleAccordion('care')}
                    className="w-full py-4 flex items-center justify-between text-ink font-medium uppercase tracking-label text-left"
                  >
                    <span>Care &amp; Storage</span>
                    <ChevronDown
                      className={`w-4 h-4 text-taupe transition-transform duration-300 ${
                        openAccordion === 'care' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'care' && (
                    <div className="pb-4 text-taupe space-y-2 font-light leading-relaxed">
                      <p>{product.care}</p>
                      <p>Always apply perfumes, creams, and hair sprays before putting on your jewelry.</p>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Shipping & Delivery */}
                <div>
                  <button
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full py-4 flex items-center justify-between text-ink font-medium uppercase tracking-label text-left"
                  >
                    <span>Shipping &amp; COD Terms</span>
                    <ChevronDown
                      className={`w-4 h-4 text-taupe transition-transform duration-300 ${
                        openAccordion === 'shipping' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="pb-4 text-taupe space-y-2 font-light leading-relaxed">
                      <p>
                        Free delivery across Pakistan on orders of PKR 5,000 or above. Standard delivery fee is PKR 250 for orders below threshold.
                      </p>
                      <p>
                        Cash on Delivery, Bank Transfer, and JazzCash/Easypaisa are supported. Prepaid orders enjoy an extra 5% discount at checkout.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 pt-16 border-t border-hairline">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-label text-taupe block mb-1">
                Client Experiences
              </span>
              <h2 className="font-display text-3xl text-ink font-normal">
                Reviews ({product.reviewCount})
              </h2>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="mt-4 sm:mt-0 text-xs uppercase tracking-label border border-hairline px-6 py-2.5 hover:bg-cream text-ink transition-colors"
            >
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-cream p-6 border border-hairline">
              <div className="flex items-center gap-1 text-gold mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <h4 className="font-display text-lg text-ink font-semibold mb-2">
                &ldquo;Even more radiant in person&rdquo;
              </h4>
              <p className="text-xs text-taupe leading-relaxed font-light mb-4">
                The finish matches my real 22k gold jewelry flawlessly. The packaging is pure luxury and delivery was prompt to Clifton, Karachi.
              </p>
              <span className="text-[11px] text-ink font-medium block">
                Alizeh Khan &bull; Verified Buyer &bull; Karachi
              </span>
            </div>

            <div className="bg-cream p-6 border border-hairline">
              <div className="flex items-center gap-1 text-gold mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <h4 className="font-display text-lg text-ink font-semibold mb-2">
                &ldquo;Comfortable for all-day wear&rdquo;
              </h4>
              <p className="text-xs text-taupe leading-relaxed font-light mb-4">
                I have sensitive skin and usually react to fashion jewelry within hours. Aurelle's hypoallergenic plating caused zero irritation. Highly recommended!
              </p>
              <span className="text-[11px] text-ink font-medium block">
                Hina Mansoor &bull; Verified Buyer &bull; Lahore
              </span>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-hairline">
            <div className="text-center mb-12">
              <span className="text-[11px] uppercase tracking-label text-taupe block mb-1">
                Curated Companions
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal">
                You May Also <span className="italic">Love</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add to Bag Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-ivory/95 backdrop-blur-md border-t border-hairline p-4 shadow-soft flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-display text-sm text-ink line-clamp-1">{product.name}</p>
              <p className="text-xs font-sans font-medium text-ink">
                {BRAND.currency.format(product.price)}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-ink text-ivory px-6 py-3 text-xs uppercase tracking-label font-medium hover:bg-gold hover:text-ink transition-colors flex-shrink-0"
            >
              Add to Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeModalOpen(false)}
              className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg bg-ivory p-6 sm:p-8 border border-hairline shadow-soft"
            >
              <div className="flex justify-between items-center pb-4 border-b border-hairline mb-6">
                <h3 className="font-display text-2xl text-ink">Ring Sizing Chart</h3>
                <button onClick={() => setIsSizeModalOpen(false)} className="text-taupe hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 text-xs text-taupe">
                <p>
                  To find your size, wrap a string or strip of paper around the base of your finger. Mark where the ends meet and measure the millimeters.
                </p>
                <div className="border border-hairline divide-y divide-hairline">
                  <div className="grid grid-cols-3 p-2.5 font-medium text-ink bg-cream text-[11px] uppercase tracking-label">
                    <span>US Size</span>
                    <span>Inside Diameter</span>
                    <span>Circumference</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-medium text-ink">Size 6</span>
                    <span>16.5 mm</span>
                    <span>51.8 mm</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-medium text-ink">Size 7</span>
                    <span>17.3 mm</span>
                    <span>54.4 mm</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-medium text-ink">Size 8</span>
                    <span>18.1 mm</span>
                    <span>56.9 mm</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-medium text-ink">Size 9</span>
                    <span>18.9 mm</span>
                    <span>59.5 mm</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg bg-ivory p-6 sm:p-8 border border-hairline shadow-soft"
            >
              <div className="flex justify-between items-center pb-4 border-b border-hairline mb-6">
                <h3 className="font-display text-2xl text-ink">Write a Review</h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="text-taupe hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Thank you for sharing your experience. Your review is pending brief moderation.', 'success');
                  setIsReviewModalOpen(false);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-taupe uppercase tracking-label mb-1">Your Rating</label>
                  <div className="flex gap-1 text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold cursor-pointer" />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-taupe uppercase tracking-label mb-1">Your Name</label>
                  <input required type="text" className="input-luxe" placeholder="e.g. Ayla Malik" />
                </div>
                <div>
                  <label className="block text-taupe uppercase tracking-label mb-1">City</label>
                  <input required type="text" className="input-luxe" placeholder="e.g. Lahore, Pakistan" />
                </div>
                <div>
                  <label className="block text-taupe uppercase tracking-label mb-1">Review</label>
                  <textarea required rows={3} className="input-luxe" placeholder="Tell us how the piece wears, feels, and catches light..." />
                </div>
                <button
                  type="submit"
                  className="w-full bg-ink text-ivory py-3.5 uppercase tracking-label font-medium hover:bg-gold hover:text-ink transition-colors mt-4"
                >
                  Submit Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

