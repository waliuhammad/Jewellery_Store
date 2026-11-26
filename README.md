# Jewelora

**Timeless Beauty. Thoughtfully Chosen.**

The storefront and admin dashboard for Jewelora, a jewellery shop for customers in Pakistan. Prices are in PKR.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Firebase (Auth and Firestore), Cloudinary and Framer Motion.

---

## Contents

- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Firebase setup](#firebase-setup)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Pages](#pages)
- [Roles and security](#roles-and-security)
- [Store configuration](#store-configuration)
- [Design system](#design-system)
- [Build status](#build-status)
- [Troubleshooting](#troubleshooting)

---

## Quick start

Requires Node.js 20 or later.

```bash
npm install
cp .env.example .env.local     # then fill in the values (see below)
npm run dev                    # http://localhost:3000
```

The site runs without any keys. Pages that need the database show "store not connected" until the Firebase Admin keys are set.

## Environment variables

Every key goes in `.env.local`, which git ignores. `.env.example` lists them with empty values. A key left blank counts as not set.

| Variable | Where it's used | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Browser: sign-in | Firebase console › Project settings › Your apps › Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Browser | same |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Browser and server | same |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Browser | same |
| `FIREBASE_CLIENT_EMAIL` | **Server only** | Project settings › Service accounts › Generate new private key |
| `FIREBASE_PRIVATE_KEY` | **Server only** | same JSON file. Keep the `\n` line breaks, on one line |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Image URLs | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | **Server only**: signed uploads | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | **Server only** | Cloudinary dashboard |

Never prefix a server-only key with `NEXT_PUBLIC_`, because that exposes it to every visitor.

## Firebase setup

The Firebase project is set in `.firebaserc` (`jewelleryshop-527ae`). `firebase.json` points the CLI at the rules and index files.

For a new project, or to check an existing one:

1. **Sign-in:** in the Firebase console, open Authentication › Sign-in method and enable **Email/Password**.
2. **Database rules and indexes:**
   ```bash
   firebase login
   firebase deploy --only firestore:rules,firestore:indexes
   ```
3. **Category records:** creates Rings, Necklaces, Earrings, Bracelets and Jewellery Sets. It's safe to re-run and never overwrites edits made in the admin.
   ```bash
   node --env-file=.env.local scripts/setup-firebase.mjs
   ```
4. **First admin:** register on the site, then:
   ```bash
   node --env-file=.env.local scripts/set-role.mjs you@example.com admin
   ```
   That account must sign out and back in before the role takes effect.
5. **Before launch:** add the live domain under Authentication › Settings › Authorized domains.

### Firestore collections

| Collection | Contents | Who can write |
|---|---|---|
| `products` | Catalogue items (`status`: draft, active, archived) | Staff, through admin routes |
| `categories` | One record per category slug | Staff |
| `collections` | Curated and seasonal edits | Staff |
| `users` | Customer profiles and saved addresses | The customer (never their role) |
| `orders` | Orders created at checkout | Server only |
| `carts`, `wishlists` | Per-customer data | The customer |
| `settings` | Store content, such as `settings/about` | Admin |
| `enquiries` | Contact-form messages | Server only |
| `adminAuditLogs` | Record of staff actions | Server only |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | TypeScript, no output |
| `node --env-file=.env.local scripts/setup-firebase.mjs` | Create the category records |
| `node --env-file=.env.local scripts/set-role.mjs <email> <customer\|manager\|admin>` | Set a staff role |

> Don't run `npm run build` while `npm run dev` is running. Both write to `.next`, and the dev server breaks with "Cannot find module './vendor-chunks/…'". If that happens, stop the dev server, delete `.next` and start it again.

## Project structure

```
src/
  app/
    (store)/          Storefront pages (shared header, footer and cart)
    admin/            Admin dashboard (staff only)
    api/              Server routes: auth session, checkout, admin, Cloudinary signing
    not-found.tsx     Branded 404
  components/
    home/             Homepage sections
    layout/           Header, mega-menu, mobile nav, footer, announcement bar
    products/         Product card, grid, filters, pagination, wishlist button
    ui/               Button, Reveal (scroll animations), PageIntro, Accordion, EditorialImage
    …                 account, admin, auth, cart, checkout, personalized, legal
  config/site.ts      Store settings and feature switches (see below)
  lib/
    catalog/          Product, category and collection queries
    checkout/         Server-side pricing and order creation
    firebase/         Client and Admin SDK setup
    auth/             Session cookies, sign-in redirects
    validations/      Zod schemas for every form and API input
  middleware.ts       Sends signed-out visitors of /account and /admin to sign-in
  styles/globals.css  Design tokens and type scale
scripts/              Firebase setup and role scripts
firestore.rules       Database security rules
firestore.indexes.json
```

## Pages

**Shop:** `/`, `/shop` (search, category, price, material, stock and sort filters), `/categories/[slug]`, `/collections`, `/collections/[slug]`, `/products/[slug]`, `/search`

**Discover:** `/personalized`, `/gifts`, `/about`

**Customer:** `/cart`, `/checkout`, `/checkout/confirmation`, `/wishlist`, `/login`, `/register`, `/forgot-password`, `/account`, `/account/orders`, `/account/orders/[id]`, `/account/profile`, `/account/addresses`

**Help and policies:** `/contact`, `/faq`, `/jewellery-care`, `/shipping-delivery`, `/returns-refunds`, `/privacy-policy`, `/terms-conditions`

**Admin:** `/admin`, plus products, inventory, orders, categories, collections, brand content and enquiries

**Redirects:** the old `/privacy`, `/terms`, `/shipping` and `/returns` URLs redirect permanently to the new ones (in `next.config.mjs`). Signed-out visitors to `/account/*` or `/admin/*` go to `/login?next=<page>` and come back to that page after signing in.

## Roles and security

- **Roles:** `customer` (default), `manager` and `admin`. They're stored as Firebase custom claims, set only by `scripts/set-role.mjs`. Nothing in the browser can change a role.
- **Admin access:** checked three times: the middleware, the admin layout (verifies the session cookie on the server), and each admin API route (checks the role).
- **Sessions:** an httpOnly `__session` cookie, created on the server from the Firebase ID token.
- **Prices:** checkout re-reads prices and stock on the server. The cart's prices are never trusted.
- **Payments:** no payment provider is connected yet. Orders are saved as "awaiting payment" and no money is taken.
- **Firestore rules:** deny everything by default and open each collection deliberately (see `firestore.rules`).

## Store configuration

`src/config/site.ts` holds the store's text and settings. Anything the business hasn't confirmed stays switched off, so the site never promises something you don't offer.

| Setting | Effect |
|---|---|
| `announcements`, `hero`, `nav`, `categories` | Announcement bar, hero, menus and category list |
| `personalization.enabled` / `options` | Shows the engraving preview and homepage section. **Off by default** |
| `gifting.occasions` | Occasion tiles on `/gifts`, each linked to an active collection |
| `gifting.packaging` | Gift-packaging panel. Hidden while `null` |
| `testimonials` | Homepage testimonials. Hidden while empty; add only genuine customer quotes |
| `trustPoints` | Replaces the service links with confirmed promises |
| `editorial.*.imageUrl` | Editorial photos. Empty slots show a plain champagne panel |
| `weddingCollectionSlug` | Adds "Wedding Collection" to the Jewellery menu |
| `productInfo`, `checkout` | Shipping, returns and care text; shipping fee and tax rate |

The Our Story text and the homepage story and craftsmanship sections are edited in **Admin › Brand content** (`settings/about`). The policy pages contain bracketed placeholders, which must be replaced with the business's confirmed policies before launch.

## Design system

- **Colours:** Ivory `#F6F0E8` (main background), Champagne `#E9DED1`, Champagne Gold `#D8C1A0`, Antique Gold `#A98455`, Espresso `#49382F`, White. They're defined in `tailwind.config.ts` as hex values, which opacity utilities like `bg-espresso/50` need, and mirrored as CSS variables in `globals.css`.
- **Fonts:** Cormorant Garamond for headings, Manrope for body text and buttons, loaded with `next/font`.
- **Type scale:** `.text-display`, `.text-h1`, `.text-h2`, `.text-h3`, `.text-lead`, `.eyebrow`, `.accent` (italic gold).
- **Motion:** `Reveal` and `Stagger` handle scroll entrances, using the `ease-luxe` curve. All animation turns off for visitors who prefer reduced motion.

## Build status

The build follows a seven-stage plan.

| Stage | Scope | Status |
|---|---|---|
| 1 | Brand identity, design tokens, UI components | Done |
| 2 | Homepage and storefront page designs | Done |
| 3 | Shopping features: quick view, variants, zoom, recently viewed, bag drawer | Next |
| 4 | Firebase and Cloudinary integration | Firebase done; Cloudinary keys still needed |
| 5 | Auth, cart, checkout, orders (cart and wishlist synced to Firestore) | Partly done |
| 6 | Admin dashboard hardening | Partly done |
| 7 | Testing, SEO (structured data, sitemap), production readiness | To do |

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Store not connected" on shop pages | Set `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` in `.env.local`, then restart |
| Server log says "Firestore index products(status, createdAt) is missing" | `firebase deploy --only firestore:indexes`. The shop still works in the meantime, sorted in memory |
| `/admin` sends you back to the homepage | Your account has no staff role. Run `set-role.mjs`, then sign in again |
| Image uploads fail in the admin | Fill in the three Cloudinary keys |
| Build runs out of memory | Close other dev servers, or run `NODE_OPTIONS=--max-old-space-size=4096 npm run build` |
