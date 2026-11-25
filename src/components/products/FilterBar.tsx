import { siteConfig } from '@/config/site';

type Current = {
  q?: string;
  category?: string;
  material?: string;
  availability?: string;
  min?: string;
  max?: string;
  sort?: string;
  featured?: string;
};

/** Plain GET form: works without JavaScript and keeps filters in the URL (shareable, back-button safe). */
export function FilterBar({ current, showCategory = true }: { current: Current; showCategory?: boolean }) {
  const field = 'w-full rounded-button border border-rose-border bg-card px-3 py-2 text-sm focus:border-rose focus:outline-none';
  return (
    <form method="get" role="search" aria-label="Filter products" className="grid gap-3 md:grid-cols-6">
      <div className="md:col-span-2">
        <label htmlFor="q" className="sr-only">Search by name</label>
        <input id="q" name="q" type="search" defaultValue={current.q} placeholder="Search by name" className={field} />
      </div>

      {showCategory && (
        <div>
          <label htmlFor="category" className="sr-only">Category</label>
          <select id="category" name="category" defaultValue={current.category ?? ''} className={field}>
            <option value="">All categories</option>
            {siteConfig.categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="material" className="sr-only">Material</label>
        <select id="material" name="material" defaultValue={current.material ?? ''} className={field}>
          <option value="">All materials</option>
          {siteConfig.materials.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="availability" className="sr-only">Availability</label>
        <select id="availability" name="availability" defaultValue={current.availability ?? ''} className={field}>
          <option value="">All pieces</option>
          <option value="in-stock">In stock only</option>
        </select>
      </div>

      <div>
        <label htmlFor="sort" className="sr-only">Sort</label>
        <select id="sort" name="sort" defaultValue={current.sort ?? 'newest'} className={field}>
          <option value="newest">Newest</option>
          <option value="popular">Most popular</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div>
        <label htmlFor="min" className="sr-only">Minimum price</label>
        <input id="min" name="min" type="number" min={0} inputMode="numeric" defaultValue={current.min} placeholder="Min price" className={field} />
      </div>

      <div>
        <label htmlFor="max" className="sr-only">Maximum price</label>
        <input id="max" name="max" type="number" min={0} inputMode="numeric" defaultValue={current.max} placeholder="Max price" className={field} />
      </div>

      {current.featured === 'true' && <input type="hidden" name="featured" value="true" />}

      <div className="flex gap-3 md:col-span-4">
        <button type="submit" className="rounded-button bg-espresso px-5 py-2 text-sm text-white hover:bg-ink/90">Apply</button>
        <a href="?" className="rounded-button px-3 py-2 text-sm text-ink underline-offset-4 hover:underline">Clear</a>
      </div>
    </form>
  );
}
