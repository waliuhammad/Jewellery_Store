import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES, OCCASIONS } from '../data/products';
import { BRAND } from '../config/brand';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [priceMax, setPriceMax] = useState(22000);
  const [selectedFinishes, setSelectedFinishes] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync route category parameter
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('all');
    }
  }, [category]);

  const finishOptions = ['18k Warm Gold', 'Rose Gold', 'Pure Silver', 'Pearl', 'Kundan', 'Emerald'];

  const toggleFinish = (finish) => {
    setSelectedFinishes((prev) =>
      prev.includes(finish) ? prev.filter((f) => f !== finish) : [...prev, finish]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceMax(22000);
    setSelectedFinishes([]);
    setSelectedOccasion('all');
    setInStockOnly(false);
    if (searchQuery) {
      setSearchParams({});
    }
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (priceMax < 22000 ? 1 : 0) +
    selectedFinishes.length +
    (selectedOccasion !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesMat = product.material.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesMat) return false;
      }

      // Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Price
      if (product.price > priceMax) {
        return false;
      }

      // Finishes / Materials
      if (selectedFinishes.length > 0) {
        const productString = `${product.material} ${product.finish} ${(product.finishes || []).join(' ')}`.toLowerCase();
        const hasMatch = selectedFinishes.some((fin) =>
          productString.includes(fin.toLowerCase())
        );
        if (!hasMatch) return false;
      }

      // Occasion
      if (selectedOccasion !== 'all') {
        if (!product.occasions || !product.occasions.includes(selectedOccasion)) {
          return false;
        }
      }

      // Stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'bestselling') return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      return 0;
    });
  }, [selectedCategory, priceMax, selectedFinishes, selectedOccasion, inStockOnly, sortBy, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Current Category Title
  const categoryTitle =
    selectedCategory === 'all'
      ? 'The Full Jewelry Archive'
      : CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Jewelry Collection';

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-label text-taupe mb-4 flex items-center gap-2">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          {selectedCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="text-ink font-medium">{categoryTitle}</span>
            </>
          )}
        </nav>

        {/* Header: Title + Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-hairline gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
              {categoryTitle}
            </h1>
            <p className="text-xs uppercase tracking-label text-taupe mt-2">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-label border border-hairline px-4 py-2.5 bg-ivory text-ink"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-label text-taupe">
              <span>Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-ink font-medium py-1.5 pl-2 pr-7 border-b border-hairline focus:outline-none focus:border-gold cursor-pointer uppercase text-xs"
                >
                  <option value="featured">Featured Curation</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="bestselling">Bestselling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-taupe" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="py-4 flex flex-wrap items-center gap-2 border-b border-hairline text-xs">
            <span className="text-taupe uppercase tracking-label text-[11px] mr-1">Active:</span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-cream border border-hairline px-3 py-1 text-ink">
                Category: {categoryTitle}
                <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3 text-taupe hover:text-ink" /></button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-cream border border-hairline px-3 py-1 text-ink">
                Search: "{searchQuery}"
                <button onClick={() => setSearchParams({})}><X className="w-3 h-3 text-taupe hover:text-ink" /></button>
              </span>
            )}

            {priceMax < 22000 && (
              <span className="inline-flex items-center gap-1.5 bg-cream border border-hairline px-3 py-1 text-ink">
                Under {BRAND.currency.format(priceMax)}
                <button onClick={() => setPriceMax(22000)}><X className="w-3 h-3 text-taupe hover:text-ink" /></button>
              </span>
            )}

            {selectedFinishes.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 bg-cream border border-hairline px-3 py-1 text-ink">
                {f}
                <button onClick={() => toggleFinish(f)}><X className="w-3 h-3 text-taupe hover:text-ink" /></button>
              </span>
            ))}

            {selectedOccasion !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-cream border border-hairline px-3 py-1 text-ink">
                {OCCASIONS.find((o) => o.id === selectedOccasion)?.name}
                <button onClick={() => setSelectedOccasion('all')}><X className="w-3 h-3 text-taupe hover:text-ink" /></button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 bg-cream border border-hairline px-3 py-1 text-ink">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 text-taupe hover:text-ink" /></button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-gold underline underline-offset-4 uppercase tracking-label text-[11px] ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10">
          {/* Desktop Filter Sidebar (260px sticky) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-28 self-start pr-4">
            {/* Category Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-label font-medium text-ink mb-3 pb-2 border-b border-hairline">
                Categories
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left py-1 transition-colors flex justify-between ${
                      selectedCategory === 'all' ? 'text-gold font-medium' : 'text-taupe hover:text-ink'
                    }`}
                  >
                    <span>All Jewelry</span>
                    <span>({PRODUCTS.length})</span>
                  </button>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left py-1 transition-colors flex justify-between ${
                        selectedCategory === cat.slug ? 'text-gold font-medium' : 'text-taupe hover:text-ink'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span>({cat.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-hairline">
                <h3 className="text-xs uppercase tracking-label font-medium text-ink">
                  Price Ceiling
                </h3>
                <span className="text-xs text-ink font-medium">
                  {BRAND.currency.format(priceMax)}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="22000"
                step="500"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-taupe mt-1">
                <span>PKR 2,000</span>
                <span>PKR 22,000</span>
              </div>
            </div>

            {/* Material & Finish Checkboxes */}
            <div>
              <h3 className="text-xs uppercase tracking-label font-medium text-ink mb-3 pb-2 border-b border-hairline">
                Material &amp; Finish
              </h3>
              <div className="space-y-2">
                {finishOptions.map((finish) => {
                  const isChecked = selectedFinishes.includes(finish);
                  return (
                    <label
                      key={finish}
                      className="flex items-center gap-2.5 text-xs text-taupe hover:text-ink cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFinish(finish)}
                        className="w-3.5 h-3.5 accent-gold rounded-none"
                      />
                      <span>{finish}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Occasion Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-label font-medium text-ink mb-3 pb-2 border-b border-hairline">
                Occasion
              </h3>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => setSelectedOccasion('all')}
                    className={`w-full text-left py-1 transition-colors ${
                      selectedOccasion === 'all' ? 'text-gold font-medium' : 'text-taupe hover:text-ink'
                    }`}
                  >
                    All Occasions
                  </button>
                </li>
                {OCCASIONS.map((occ) => (
                  <li key={occ.id}>
                    <button
                      onClick={() => setSelectedOccasion(occ.id)}
                      className={`w-full text-left py-1 transition-colors ${
                        selectedOccasion === occ.id ? 'text-gold font-medium' : 'text-taupe hover:text-ink'
                      }`}
                    >
                      {occ.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock Availability */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs text-ink cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-3.5 h-3.5 accent-gold rounded-none"
                />
                <span>Ready to dispatch (in stock only)</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area (9 cols on desktop) */}
          <main className="lg:col-span-9">
            {displayedProducts.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-hairline p-12 bg-cream/40">
                <p className="font-display text-2xl md:text-3xl text-ink mb-3">
                  No pieces match your selected filters
                </p>
                <p className="text-sm text-taupe max-w-md mx-auto mb-8 font-light">
                  Try widening your price range, clearing specific material preferences, or browsing all categories.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="relative overflow-hidden bg-ink text-ivory px-8 py-3.5 text-xs uppercase tracking-label group"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                  <span className="relative transition-colors duration-300 group-hover:text-ink">
                    Reset All Filters
                  </span>
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
                >
                  {displayedProducts.map((product, index) => {
                    // Editorial Interruption Tile after 4th product
                    if (index === 4) {
                      return (
                        <React.Fragment key="editorial-break">
                          <div className="col-span-2 md:col-span-3 bg-cream p-8 sm:p-12 border border-hairline flex flex-col md:flex-row items-center justify-between gap-6 my-4">
                            <div className="max-w-md">
                              <span className="text-[10px] uppercase tracking-label text-gold font-medium block mb-1">
                                Atelier Note
                              </span>
                              <h3 className="font-display text-2xl sm:text-3xl text-ink leading-snug">
                                Designed to be layered, mixed, and worn <span className="italic">every day</span>.
                              </h3>
                              <p className="text-xs text-taupe mt-2 font-light">
                                All our pieces are engineered with uniform warm-gold and sterling undertones so any two items pair seamlessly together.
                              </p>
                            </div>
                            <Link
                              to="/about"
                              className="text-xs uppercase tracking-label font-medium text-ink hover:text-gold underline underline-offset-4 flex-shrink-0"
                            >
                              Read About Our Materials &rarr;
                            </Link>
                          </div>
                          <ProductCard product={product} />
                        </React.Fragment>
                      );
                    }
                    return <ProductCard key={product.id} product={product} />;
                  })}
                </motion.div>

                {/* Load More Button */}
                {visibleCount < filteredProducts.length && (
                  <div className="mt-16 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 4)}
                      className="relative overflow-hidden bg-transparent border border-ink text-ink px-10 py-4 text-xs uppercase tracking-label font-medium hover:bg-blush transition-colors"
                    >
                      Load More Pieces ({filteredProducts.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-ivory border-t border-hairline shadow-soft flex flex-col z-10 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                <h3 className="font-display text-2xl text-ink">Filter Pieces</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 text-taupe hover:text-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Options */}
              <div className="space-y-6 pb-20">
                {/* Categories */}
                <div>
                  <h4 className="text-xs uppercase tracking-label font-medium text-ink mb-3">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1.5 text-xs uppercase tracking-label border ${
                        selectedCategory === 'all' ? 'bg-ink text-ivory border-ink' : 'border-hairline text-ink'
                      }`}
                    >
                      All
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`px-3 py-1.5 text-xs uppercase tracking-label border ${
                          selectedCategory === cat.slug ? 'bg-ink text-ivory border-ink' : 'border-hairline text-ink'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs uppercase tracking-label font-medium text-ink">Max Price</h4>
                    <span className="text-xs font-medium text-ink">{BRAND.currency.format(priceMax)}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="22000"
                    step="500"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-gold"
                  />
                </div>

                {/* Materials */}
                <div>
                  <h4 className="text-xs uppercase tracking-label font-medium text-ink mb-3">Materials</h4>
                  <div className="flex flex-wrap gap-2">
                    {finishOptions.map((f) => (
                      <button
                        key={f}
                        onClick={() => toggleFinish(f)}
                        className={`px-3 py-1.5 text-xs border ${
                          selectedFinishes.includes(f) ? 'bg-ink text-ivory border-ink' : 'border-hairline text-ink'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Apply Button */}
              <div className="fixed bottom-0 inset-x-0 p-4 bg-ivory border-t border-hairline flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 text-xs uppercase tracking-label border border-hairline text-ink"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 text-xs uppercase tracking-label bg-ink text-ivory font-medium"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

