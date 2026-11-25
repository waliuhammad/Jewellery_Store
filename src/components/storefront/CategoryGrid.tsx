import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading" className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
      <h2 id="categories-heading" className="font-heading text-3xl text-ink sm:text-4xl">
        Shop by Category
      </h2>
      <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {siteConfig.categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/categories/${c.slug}`}
              className="group flex aspect-[4/5] items-end rounded-card border border-rose-border bg-blush p-4 transition-colors hover:border-rose"
            >
              <span className="font-heading text-xl text-ink group-hover:text-rose">{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
