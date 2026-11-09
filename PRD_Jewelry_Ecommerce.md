# Product Requirements Document (PRD)

## Fine & Fashion Jewelry E-Commerce Website

| | |
|---|---|
| **Working brand name** | *Aurelle Jewels* (placeholder, replace everywhere using one config constant) |
| **Document version** | 1.0 |
| **Date** | 8 November 2026 |
| **Document type** | PRD for AI-assisted ("vibe") development |
| **Target market** | Pakistan first, with room to expand internationally |
| **Stack** | React.js, Tailwind CSS, Node.js (Express), Firebase (Auth, Firestore, Storage) |

---

## 0. How to Use This Document with an AI Coding Tool

1. Feed this PRD to your AI coding tool **one section at a time**, not all at once. Follow the build order in Section 16.
2. Always paste **Section 6 (Design System)** and **Section 7 (Anti-"AI-look" Rules)** with every UI prompt. They are what keeps the site from looking generic.
3. Treat every value in this document (hex codes, fonts, timings, route names, collection names) as a **requirement**, not a suggestion.
4. Keep all brand text, colors, contact details and social links in a single `src/config/brand.js` file so the placeholder name can be replaced in one place.

---

## 1. Product Overview

### 1.1 Vision
An online jewelry boutique that feels like walking into a quiet, beautifully lit showroom: warm, editorial and unhurried, with every product shown like it matters.

### 1.2 Problem Statement
Jewelry is an emotional, trust-heavy purchase. Shoppers judge the brand by how the site looks and feels before they judge the product. In Pakistan there are extra frictions: heavy reliance on Cash on Delivery (COD), high return-to-origin rates, and Stripe/PayPal not being available for local merchants. A generic template-looking store loses trust immediately.

### 1.3 Solution
A custom-built, fast, animated storefront with an editorial design language, local payment options (COD, mobile wallets, bank transfer), order tracking, wishlist and accounts, backed by a secure Node.js API and Firebase.

### 1.4 Goals and Success Metrics

| Goal | Metric | Target (first 90 days) |
|---|---|---|
| Premium first impression | Bounce rate on home page | Below 45% |
| Fast experience | Largest Contentful Paint (mobile, 4G) | Under 2.5 s |
| Conversion | Visitor-to-order rate | 1.5% or higher |
| Smooth checkout | Checkout completion rate | 55% or higher |
| Repeat business | Returning customers | 20% or higher |
| Accessibility | Lighthouse accessibility score | 90 or higher |

### 1.5 Target Users

| Persona | Description | Needs |
|---|---|---|
| **Everyday Buyer (primary)** | Women 20-40, mostly mobile, buys artificial/fashion and demi-fine pieces for daily wear | Fast browsing, clear prices in PKR, COD, easy returns |
| **Gift Giver** | Men and women buying for spouse, sister, friend | Gift filters (by price/occasion), gift packaging option, delivery estimates |
| **Occasion / Bridal Shopper** | Shopping for weddings and festive events | Sets/collections, larger imagery, size and material detail |

---

## 2. Scope

### 2.1 In Scope (MVP)
- Public storefront with the pages listed in Section 9
- Product catalog with categories, filters, search and sorting
- Cart (drawer + page), wishlist, guest and registered checkout
- User authentication and account area (profile, addresses, orders)
- Order placement, order tracking by order ID + phone/email
- Payments: Cash on Delivery, bank transfer with receipt upload, mobile wallet (see Section 11.5)
- Transactional emails (order confirmation, status updates)
- Contact form, newsletter signup, FAQ, Privacy Policy
- Full animation system (Section 10)
- SEO basics, responsive design, accessibility

### 2.2 Explicitly Out of Scope
- **Admin panel link in the footer.** The reference screenshot shows an "Admin Panel" link in the footer. It must **not** appear anywhere on the public site.
- Virtual try-on, AR, AI chatbot, live gold-rate ticker, resale marketplace
- Multi-vendor marketplace, mobile apps

### 2.3 Assumption to Confirm
Products still need to be added somehow. For the MVP, use a **seed script and the Firebase Console** to manage products. A private admin dashboard (not linked from the public site) is listed as **Phase 2** in Section 16. If you want it removed entirely, say so and the product data will be managed through the console only.

---

## 3. Market and Design Research Summary

Findings from web research, translated into product decisions.

| Insight | Decision in this PRD |
|---|---|
| Jewelry sites in 2026 are moving from "online catalog" toward a "digital luxury experience", with editorial layouts, large photography and restrained color | Editorial layouts, large imagery, limited palette (Section 6) |
| Luxury sites rely on generous whitespace, one focal point per screen, smooth parallax, subtle hover states and cinematic page transitions. Animation should feel intentional, not decorative | Animation system with strict timing and purpose rules (Section 10) |
| Serif display fonts dominate the luxury space; Cormorant Garamond and Playfair Display, paired with a clean sans such as Montserrat, are common free options | Typography choice in Section 6.2 (same family of pairing as your reference site, which uses a serif wordmark with a clean sans body) |
| Luxury palettes use few colors and deep tones; champagne, ivory, charcoal and rose gold are timeless staples. Blush with warm neutrals suits an approachable "everyday luxury" audience | Palette in Section 6.1: ivory, champagne, blush, rose gold, antique gold, warm charcoal |
| Informational content ranks well, so pages beyond product pages matter | Journal/guides placeholder, size and care guides, FAQ (Section 9) |
| Skeleton screens that preview layout while images load make content feel intentional | Gold-tinted skeleton loaders (Section 10) |
| In Pakistan, around seven in ten online shoppers still use COD, and COD return rates are commonly cited at 25-30% or more. Mobile wallets (JazzCash, Easypaisa) matter, and redirect-heavy checkout hurts conversion. Stripe is not available to Pakistani merchants, and gateways typically require business registration and a business bank account | COD plus prepaid options with an incentive, local gateway or aggregator, minimal-step checkout, COD confirmation step (Section 11.5) |

*Note: payment statistics come from payment-provider blogs, which have a commercial interest. Treat them as directional, and verify current gateway terms before signing up.*

---

## 4. Information Architecture

```
Home (/)
Shop (/shop)
  ├─ Category pages (/shop/rings, /shop/necklaces, /shop/earrings, /shop/bracelets, /shop/sets)
  └─ Product detail (/product/:slug)
About (/about)
Contact (/contact)
Login / Register (/login, /register, /forgot-password)
Wishlist (/wishlist)
Cart (/cart)  +  Cart drawer (global)
Checkout (/checkout)  →  Order success (/order-success/:orderId)
Account (/account)  →  Orders, Addresses, Profile
Track Order (/track-order)
FAQs (/faqs)
Privacy Policy (/privacy-policy)
Terms and Returns (/terms)   [linked from checkout and FAQ]
404 (*)
```

---

## 5. Global Layout (from the Reference Screenshot)

The screenshot defines the header and footer structure. Reproduce the **structure and content**, but apply the new brand design from Section 6. Do not copy the reference site's look.

### 5.1 Header

**Desktop layout (left to right):**
- **Left:** Brand wordmark in uppercase serif with wide letter spacing
- **Right:** Nav links: **Home, Shop, About, Contact, Login**, then a **wishlist heart icon** and a **shopping bag icon** (with item count badge)

**Behavior and states:**
- Active link shows a thin gold underline that animates in from the left.
- Header is **sticky**, hides when scrolling down and returns when scrolling up.
- On the home hero, header is transparent with light text; after scrolling 80px it becomes ivory with a hairline bottom border and a soft backdrop blur.
- Heart and bag show a count badge when above zero. The badge does a small bounce when the count changes.
- **Login** changes to the user's first name (opening a small dropdown: My Orders, Profile, Logout) when signed in.
- **Mobile (below 1024px):** wordmark left; heart, bag and menu icons right. Menu opens a full-height slide-in panel with large serif links, staggered reveal, and contact info at the bottom.
- Optional slim announcement bar above the header (dismissible): e.g. "Free delivery on orders above PKR X". Value is configurable.

### 5.2 Footer

Dark warm-charcoal background with ivory text. Four columns on desktop, stacked accordions or clean stacked blocks on mobile.

| Column | Content |
|---|---|
| **Brand** | Wordmark + short brand sentence (e.g. a line about curating pieces that reflect the wearer's own story). Social icons below. |
| **Quick Links** | Home, Shop, About Us, Contact |
| **Support** | FAQs, Track Order, Privacy Policy |
| **Contact Info** | Icon + address (placeholder: *Shop/Office address, City, Pakistan*), phone, email. Each is a tappable link (`tel:` and `mailto:`). |

**Footer bottom bar:** hairline divider, then "© 2026 [Brand]. All rights reserved." centered.

**Extras:**
- Newsletter signup row above the columns (single email input + button, inline success state).
- **Circular "scroll to top" button** at the bottom right (as in the screenshot), appearing after 400px of scroll, with a thin gold progress ring that fills as the user scrolls.
- Link hover: gold underline draws from left to right.
- **No "Admin Panel" link.**

---

## 6. Design System

### 6.1 Color Palette: "Champagne and Rose"

A warm, light, romantic palette: ivory and champagne surfaces, blush and rose-gold accents, antique gold for fine details, and a warm charcoal for text and the footer. Gold appears sparingly, like real jewelry on a plain surface.

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background (primary) | **Pearl Ivory** | `#FBF8F3` | Page background |
| Surface (alt) | **Warm Cream** | `#F5EEE4` | Alternate sections, cards |
| Surface (accent) | **Champagne** | `#E7D3B5` | Highlight sections, tags, borders |
| Soft accent | **Dusty Blush** | `#F1DDD6` | Soft backgrounds, hover fills, badges |
| Signature accent | **Rose Gold** | `#C98C7A` | Links on hover, icons, sale tags, focus accents |
| Detail accent | **Antique Gold** | `#B8924A` | Hairlines, underlines, stars, decorative detail |
| Text (primary) | **Warm Ink** | `#2B2522` | Headings, body, primary buttons |
| Text (secondary) | **Taupe** | `#6E625A` | Secondary text (contrast-safe on ivory) |
| Dark surface | **Espresso Noir** | `#1C1917` | Footer, dark sections |
| Border | **Hairline** | `#E4D9CB` | 1px dividers |
| Success | **Sage** | `#6F8F72` | Success states |
| Error | **Garnet** | `#A33B3B` | Errors, out of stock |

**Color rules:**
- Use **two dominant colors plus a neutral** on any screen: usually Ivory and Ink, with one accent (Rose Gold or Antique Gold).
- **Antique Gold and Rose Gold are decorative accents.** Do not use them for body text on ivory, because contrast is too low for small text.
- Primary button: Ink background, Ivory text. Hover: background transitions to Antique Gold with Ink text.
- Secondary button: transparent, 1px Ink border; hover fills with Dusty Blush.
- **No purple, no blue-purple gradients, no neon.** If a gradient is used, it must be a subtle ivory-to-cream or champagne-to-blush wash.

**Tailwind config (`tailwind.config.js` excerpt):**

```js
theme: {
  extend: {
    colors: {
      ivory: '#FBF8F3',
      cream: '#F5EEE4',
      champagne: '#E7D3B5',
      blush: '#F1DDD6',
      rose: '#C98C7A',
      gold: '#B8924A',
      ink: '#2B2522',
      taupe: '#6E625A',
      noir: '#1C1917',
      hairline: '#E4D9CB',
      sage: '#6F8F72',
      garnet: '#A33B3B',
    },
    fontFamily: {
      display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      sans: ['Montserrat', 'system-ui', 'sans-serif'],
    },
    letterSpacing: { wordmark: '0.18em', label: '0.14em' },
    transitionTimingFunction: { luxe: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  },
}
```

### 6.2 Typography

| Use | Font | Weight | Notes |
|---|---|---|---|
| Wordmark and display headings | **Cormorant Garamond** (Google Fonts) | 500-600 | Wordmark uppercase with wide tracking (`0.18em`) |
| Body, UI, buttons, prices | **Montserrat** (Google Fonts) | 400, 500 | Clean, readable at small sizes |
| Small labels (e.g. "NEW IN") | Montserrat | 500 | Uppercase, `0.14em` tracking, 11-12px |
| Editorial accents | Cormorant Garamond *italic* | 400 | Used for one emphasized word in a heading |

**Type scale (desktop / mobile):**
- Hero heading: 80-96px / 44-52px, line-height 1.0-1.05
- H1: 56px / 38px; H2: 40px / 30px; H3: 28px / 22px
- Body: 16px / 15px, line-height 1.7
- Small/caption: 13px

Load fonts with `display=swap` and preload the two primary weights.

### 6.3 Spacing, Grid and Shape
- Container: max width 1280px, side padding 24px (mobile) / 48px (desktop)
- Section vertical padding: 96-140px desktop, 64-80px mobile. **Generous whitespace is mandatory.**
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Border radius: **0 to 2px for cards, images and buttons (sharp, refined).** Use fully round only for icon buttons, badges and the scroll-top button. Do **not** put large rounded corners on everything.
- Borders: 1px hairlines instead of heavy drop shadows. If a shadow is used: `0 12px 40px rgba(43,37,34,0.08)`.

### 6.4 Imagery and Iconography
- **Photography direction:** soft natural light, neutral textured backdrops (linen, stone, plaster), close-up macro detail, plus lifestyle shots on real people. Consistent crop ratios: product cards 4:5, hero 16:9 desktop and 4:5 mobile.
- Each product needs: 1 clean front shot, 1 detail shot, 1 on-model shot, optional video.
- Convert all images to **WebP/AVIF**, use `srcset`, lazy load below the fold, always set width/height to avoid layout shift.
- **Icons:** one consistent thin-stroke set (Lucide at 1.25-1.5px stroke, or Phosphor Light). Never mix icon styles. **No emoji as icons.**
- Include a payment-icons row, trust badges (e.g. "Easy 7-day returns", "Secure packaging") as simple line icons with small captions.

### 6.5 Core Components

| Component | Spec |
|---|---|
| **Button** | Uppercase Montserrat 12-13px, tracking `0.14em`, padding 16px 32px, no radius |
| **Product Card** | 4:5 image, second image on hover (crossfade), name in serif, price in sans, heart button top right, "Quick Add" bar slides up on hover (desktop), always-visible small add button on mobile |
| **Badge** | Small uppercase label: NEW, BESTSELLER, SALE (Rose Gold), LOW STOCK |
| **Input** | Bottom-border-only style, floating label, gold focus line |
| **Cart Drawer** | Slides from right, 420px wide, item list, quantity steppers, subtotal, "Checkout" button |
| **Toast** | Small ivory card with hairline border, bottom center, auto-dismiss 3s |
| **Breadcrumbs** | Small uppercase taupe text |
| **Skeleton** | Cream block with a slow champagne shimmer |
| **Modal / Quick View** | Fade and slight upward scale, focus-trapped |

---

## 7. Anti-"AI-Look" Rules (Must Follow)

The site must look **art-directed**, not auto-generated. These are hard rules.

**Do NOT:**
- Use purple/indigo gradients, glowing blobs, glassmorphism everywhere, or gradient text
- Use Inter/Roboto/system fonts as the visual identity
- Build the home page as the generic stack: centered hero with two buttons, then three identical icon cards, then testimonials, then pricing-style grid
- Make every card the same rounded-2xl box with the same drop shadow
- Use emoji or stock "sparkle" icons as decoration
- Use placeholder copy like "Lorem ipsum", "Elevate your style", "Unleash", "Seamless", "Discover the magic"
- Center-align everything. Vary alignment.
- Use identical animation on every element (the "everything fades up 20px" pattern)

**DO:**
- Use **asymmetric, editorial layouts**: offset images, overlapping image and text blocks, a large image beside a narrow text column, occasional full-bleed bands
- Use **oversized serif headlines** with one italic word for emphasis
- Use hairline borders, small-caps labels with wide tracking, and numbered or captioned details (e.g. "01 / Craft")
- Write **real, specific, warm brand copy** (short sentences, concrete detail: materials, plating, care, how a piece feels)
- Use real photography direction (Section 6.4). If photos are not ready, use warm solid-color placeholders with the product name, never gray boxes or random stock.
- Vary section backgrounds (ivory, cream, champagne, one dark band) for rhythm
- Keep motion purposeful and different per context (Section 10)
- Add small crafted details: a custom gold underline, a thin rule beside labels, a small ornament divider, custom focus states, a custom 404

**Review checkpoint:** before finishing any page, check: does this look like a boutique designed by a person with a point of view, or like a template? If template, revise.

---

## 8. Brand Voice (for All Copy)

- **Tone:** warm, confident, quietly elegant. Never pushy or hyped.
- **Style:** short sentences, sensory and specific. Mention material, finish, wear and care.
- **Examples:**
  - Hero: "Pieces you'll reach for every morning."
  - Newsletter: "New arrivals, first. No noise."
  - Empty wishlist: "Nothing saved yet. Tap the heart on anything you love."
  - Order success: "Thank you. Your order is being wrapped with care."
- All copy lives in content files or CMS-style JSON, not hard-coded across components.

---

## 9. Page Specifications

### 9.1 Home (`/`)

Sections in order (vary layout and background on each):

1. **Hero:** full-bleed image or short looped video (muted, under 6 MB, poster image), large serif headline with a masked line-by-line reveal, one primary CTA ("Shop the Collection") and a quiet text link. Slow image scale (1.08 to 1.0) on load. Scroll cue at bottom.
2. **Marquee strip:** thin slow-scrolling band (e.g. "Handpicked pieces · Easy returns · Delivery across Pakistan"), champagne background.
3. **Shop by Category:** asymmetric grid of 4-5 large category tiles with different sizes; hover reveals a slow zoom and an arrow.
4. **New Arrivals:** horizontal scroll-snap carousel of product cards with drag support and arrow buttons.
5. **Editorial Split:** large lifestyle image on one side, text block on the other overlapping the image edge; a short brand story and link to About.
6. **Bestsellers:** 4-column product grid.
7. **Gift Guide / Shop by Occasion:** tabs (Everyday, Gifting, Festive and Bridal) switching a product row with a crossfade.
8. **Craft and Care Band (dark):** 3-4 short items with numbered labels, not icon cards: e.g. "01 Materials", "02 Finish", "03 Packaging", "04 Returns".
9. **Reviews:** large pull-quote style rotator with customer name, product and city; star rating in gold.
10. **Instagram-style gallery strip** (static images linking to the social profile).
11. **Newsletter** (also present in footer; use only one prominent instance per page).

### 9.2 Shop (`/shop`, `/shop/:category`)
- Page title (serif), result count, breadcrumb.
- **Filters** (left sidebar on desktop, bottom-sheet on mobile): category, price range slider (PKR), material/finish (gold-plated, silver, rose-gold plated, stainless steel, pearl, stone, etc.), color, occasion, availability. Active filters shown as removable chips.
- **Sort:** Newest, Price low to high, Price high to low, Bestselling.
- **Search:** header search overlay with instant suggestions (debounced 250 ms).
- **Grid:** 4 columns desktop, 3 tablet, 2 mobile. Pagination with "Load more" (default) and URL query params preserved.
- **Empty state:** friendly message and suggested categories.
- Skeleton loaders while fetching.

### 9.3 Product Detail (`/product/:slug`)
- **Gallery:** large main image with thumbnails; desktop hover-zoom (lens or pan zoom); mobile swipeable with dots; optional video slide.
- **Info panel (sticky on desktop):** name (serif), price (PKR), compare-at price and discount badge, star rating and review count, short description, material and finish, **variant selectors** (size for rings/bangles, length for chains, color/finish) with out-of-stock variants struck through, quantity stepper, **Add to Bag** (primary), **Save to Wishlist** (heart), **Order on WhatsApp** (secondary text link).
- **Trust row:** easy returns, secure packaging, delivery estimate (by city), payment options icons.
- **Accordions:** Details and Materials, Care Guide, Size Guide (opens modal with ring/bangle size chart), Shipping and Returns.
- **Reviews:** summary bar, list, "Write a review" (logged-in verified buyers).
- **You May Also Like:** 4 related products.
- **Sticky mobile add-to-bag bar** appears when the main button scrolls out of view.
- JSON-LD `Product` schema for SEO.

### 9.4 Wishlist (`/wishlist`)
- Grid of saved items with "Move to Bag" and remove. Guests stored in `localStorage`; logged-in users synced to Firestore. Merge guest wishlist into account on login.
- Empty state with a short line and a link to the shop.

### 9.5 Cart (Drawer and `/cart`)
- Line items: image, name, variant, price, quantity stepper, remove.
- Subtotal, estimated shipping, free-shipping progress bar ("PKR X away from free delivery").
- Order note and gift-wrap checkbox (configurable fee).
- Coupon code field (basic version in MVP).
- Persist in `localStorage`; sync to Firestore for logged-in users.

### 9.6 Checkout (`/checkout`)
Single-page, three collapsible steps; guest checkout allowed.
1. **Contact and Delivery:** name, phone (Pakistani format validation), email (optional), address, city (dropdown), province, postal code (optional), delivery notes. Logged-in users can pick a saved address.
2. **Shipping Method:** standard (flat rate, configurable), free above threshold.
3. **Payment:**
   - Cash on Delivery (with a confirmation step; see Section 11.5)
   - Bank Transfer (show account details, upload receipt)
   - Mobile Wallet (JazzCash / Easypaisa) through an aggregator or direct integration
   - Optional incentive: small discount for prepaid methods
- Order summary panel (sticky on desktop). Terms and Returns checkbox.
- Inline validation, clear error messages, no page reloads.
- After placing: redirect to **Order Success**.

### 9.7 Order Success (`/order-success/:orderId`)
Order number, summary, payment instructions if bank transfer/wallet pending, estimated delivery, a "Track Order" link, and a subtle animated check mark (gold line draw). Confirmation email sent.

### 9.8 Track Order (`/track-order`)
- Form: **Order ID + phone number (or email)**.
- Result: vertical timeline (Placed → Confirmed → Packed → Shipped → Out for delivery → Delivered) with timestamps, courier name and tracking number/link when available. Cancelled and returned states handled.

### 9.9 Login, Register, Forgot Password
- Split-screen layout: image on one side, form on the other (stacked on mobile).
- Methods: email/password and Google sign-in (Firebase Auth). Optional phone OTP in Phase 2.
- Validation, show/hide password, friendly error messages, "forgot password" email flow.

### 9.10 Account (`/account`)
Tabs: **Orders** (list and detail, reorder, cancel if still pending), **Addresses** (add/edit/delete, set default), **Profile** (name, phone, change password), **Wishlist** shortcut.

### 9.11 About (`/about`)
Editorial page: opening statement in large serif type, brand story with staggered images, values (numbered, not icon cards), process/craft section, small team or founder note, closing CTA to Shop. Parallax on key images.

### 9.12 Contact (`/contact`)
Left: form (name, email, phone, subject, message) with success state. Right: contact details (address, phone, email, business hours), social links, and an embedded map (privacy-friendly, lazy-loaded). A "Chat on WhatsApp" button.

### 9.13 FAQs (`/faqs`)
Accordion grouped by topic: Orders and Delivery, Payments, Returns and Exchanges, Product Care and Materials, Sizing. Searchable. Smooth height animation.

### 9.14 Privacy Policy (`/privacy-policy`) and Terms (`/terms`)
Clean long-form text layout with a table of contents. Content must be reviewed before launch (see Section 17).

### 9.15 404
Branded, with a short line and links to Shop and Home. A small animated detail (e.g. a drawn ring).

---

## 10. Animation and Motion Specification

**Libraries:** **Framer Motion** for component/route animation; optional **Lenis** for smooth scrolling; optional **GSAP + ScrollTrigger** only for the hero and parallax if needed. Keep total animation JS lean.

### 10.1 Principles
1. **Purposeful:** every animation either guides attention, confirms an action or adds polish. Remove any that does none of these.
2. **Slow and soft:** luxury feels unhurried.
3. **Varied by context:** no single effect repeated everywhere.
4. **Performance first:** animate only `transform` and `opacity`. Avoid animating width, height or box-shadow on large elements. Target 60 fps on mid-range Android.
5. **Accessible:** respect `prefers-reduced-motion` (replace motion with simple opacity fades or nothing).

### 10.2 Timing Tokens

| Token | Value |
|---|---|
| Micro (hover, press) | 200-300 ms |
| Standard (reveals, drawers) | 500-700 ms |
| Hero / page entrance | 800-1100 ms |
| Easing (default) | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Stagger step | 60-100 ms |

### 10.3 Animation Catalog

| Area | Animation |
|---|---|
| **Page load** | Short branded preloader (wordmark fades in, thin gold line draws), under 1.2 s, shown only on first visit per session |
| **Route transitions** | Fade plus 12px upward shift on enter; quick fade on exit (about 250 ms) |
| **Header** | Hides on scroll down, returns on scroll up; transparent to ivory transition; active link underline draws left to right |
| **Hero** | Headline revealed line by line using masked text (text slides up from behind a clip); background image slow scale-down; scroll cue gently loops |
| **Scroll reveals** | Sections fade and rise 24px with stagger on first entry only (`once: true`). **Alternate between fade-up, clip-path image reveals and horizontal slides** so it doesn't feel repetitive |
| **Image reveals** | Clip-path wipe (inset from bottom) with slight scale-down of the image inside |
| **Parallax** | Subtle (8-12%) on hero, About and editorial images. Disabled on mobile if it hurts performance |
| **Marquee** | Continuous slow horizontal loop; pauses on hover |
| **Product card** | Hover: second image crossfade, 1.04 scale, "Quick Add" bar slides up; heart does a small pop and fills with Rose Gold on tap |
| **Add to bag** | Button text swaps to "Added" with a check; product thumbnail briefly flies toward the bag icon; bag badge bounces; cart drawer opens |
| **Cart drawer** | Slides from right (500 ms) with backdrop fade; items stagger in |
| **Quantity stepper** | Number rolls vertically on change |
| **Filters and sorting** | Product grid cross-fades; items re-stagger using layout animations |
| **Accordions** | Animated height with a rotating plus/minus icon |
| **Buttons** | Fill sweeps in from the left on hover (color transition, no heavy effects) |
| **Links (footer/nav)** | Underline draws in on hover |
| **Form inputs** | Floating labels, gold focus line expands from center |
| **Toasts** | Slide up and fade, auto-dismiss |
| **Skeletons** | Slow champagne shimmer, then content crossfades in |
| **Order success** | SVG check mark draws itself in gold, followed by a soft fade of the summary |
| **Scroll-to-top button** | Fades in after 400px; progress ring fills with scroll; click smooth-scrolls up |
| **Numbers / stats** | Count-up only if a stats band is used, triggered once on view |
| **Custom cursor (desktop, optional)** | Small ring that grows over product images ("View"); disabled on touch and reduced motion |

### 10.4 Performance Guardrails
- Lazy-load heavy animation code and below-the-fold media.
- No autoplay video with sound; hero video under 6 MB with poster fallback; disable video on data-saver and slow connections.
- Test on a low-end Android device; if frame drops occur, simplify parallax first.

---

## 11. Functional Requirements

### 11.1 Authentication
- Firebase Auth: email/password, Google. Email verification optional but recommended before reviews.
- Session handled via Firebase ID tokens; backend verifies tokens with the Admin SDK.
- Role stored in custom claims (`customer`, `admin`). Admin role used by Phase 2 dashboard and secured server-side only.

### 11.2 Catalog and Search
- Products belong to one category, support tags, variants (size, length, finish) and per-variant stock.
- Search by name, tag, category. Use Firestore queries with a normalized `searchKeywords` array for MVP; consider Algolia/Typesense later.
- Slug-based URLs; unique slugs enforced.

### 11.3 Cart and Wishlist
- Guest: `localStorage`. Logged-in: Firestore (`carts/{uid}`, `wishlists/{uid}`), merged on login.
- Prices and stock are **always revalidated on the server** at checkout. Never trust client prices.

### 11.4 Orders
- Created **only** through the Node API (client cannot write to `orders` directly).
- Order number format: `AJ-YYMMDD-XXXX`.
- Status flow: `pending` → `confirmed` → `packed` → `shipped` → `out_for_delivery` → `delivered`; side states: `cancelled`, `returned`, `payment_pending`, `payment_failed`.
- Stock decremented in a Firestore transaction on order creation; restored on cancellation.
- Email notifications at: placed, confirmed, shipped (with tracking), delivered.

### 11.5 Payments (Pakistan)
- **Cash on Delivery:** default method. To reduce fake/refused orders: phone number validation, optional confirmation call/WhatsApp message, and a small incentive for prepaid options.
- **Bank Transfer:** show account details at checkout and on the success page; customer uploads a receipt image (stored in Firebase Storage); order stays `payment_pending` until verified.
- **Mobile Wallets (JazzCash, Easypaisa) and cards:** integrate through a local gateway or aggregator that offers a single API for wallets, cards and bank transfers. Prefer an **on-site (non-redirect)** flow where available, since redirects hurt conversion. Handle server-to-server **webhooks** to confirm payments; never trust the browser redirect alone.
- Stripe and PayPal are **not** viable for a Pakistani merchant account. Do not build around them.
- Merchant onboarding usually needs business registration, an NTN and a business bank account. Start this paperwork early, because approval can delay launch.
- Payment logic sits behind a `PaymentProvider` interface so gateways can be swapped.

### 11.6 Shipping
- Flat rate plus free-shipping threshold, configurable in `settings`.
- Delivery estimate by city (simple lookup table).
- Courier tracking number and link stored per order (manual entry in MVP; courier API integration later).

### 11.7 Reviews
- Verified buyers only; star rating, title, text, optional photos; moderated before publishing (Phase 2 dashboard, or console in MVP).

### 11.8 Contact and Newsletter
- Contact messages stored in Firestore and emailed to the store owner; rate-limited and protected with a honeypot field or reCAPTCHA/Turnstile.
- Newsletter emails stored with consent and timestamp; double opt-in recommended.

### 11.9 Notifications and Email
- Transactional email via Nodemailer with an SMTP provider, or a service such as Resend/SendGrid. Branded HTML templates using the palette.

---

## 12. Technical Architecture

### 12.1 Overview

```
 React (Vite) SPA  ──►  Node.js / Express API  ──►  Firebase Admin SDK
 Tailwind, Framer          (REST, JWT verify)         ├─ Firestore (data)
 Motion                          │                    ├─ Auth (users)
        │                        │                    └─ Storage (images, receipts)
        └── Firebase client SDK (Auth, read-only public catalog)
                                 │
                                 └─► Payment gateway webhooks, Email service
```

| Layer | Technology | Notes |
|---|---|---|
| Frontend | **React.js (Vite)**, React Router, Tailwind CSS, Framer Motion | Code-split by route; React Query (TanStack Query) for data fetching and caching |
| State | Context API or Zustand | Cart, wishlist, auth, UI state |
| Forms | React Hook Form + Zod | Shared validation schemas where possible |
| Backend | **Node.js + Express** | REST API, input validation (Zod/Joi), `helmet`, CORS allow-list, rate limiting |
| Database | **Firebase Firestore** | Denormalize for read speed; composite indexes defined in `firestore.indexes.json` |
| Auth | **Firebase Authentication** | ID token verified on every protected API call |
| File storage | **Firebase Storage** (receipts, product images) | Verify current plan requirements for Storage before relying on it; Cloudinary is a good alternative for optimized product images |
| Hosting | Frontend on Firebase Hosting, Vercel or Netlify; API on Render, Railway, a VPS, or Cloud Run | Confirm Firebase pricing and plan limits at build time |
| Email | Nodemailer/Resend/SendGrid | Branded templates |

### 12.2 Suggested Folder Structure

```
/client
  /src
    /assets          (fonts, svgs, images)
    /components
      /layout        (Header, Footer, MobileMenu, AnnouncementBar, ScrollTop)
      /ui            (Button, Input, Badge, Modal, Toast, Skeleton, Accordion)
      /product       (ProductCard, Gallery, VariantPicker, QuickView)
      /cart          (CartDrawer, CartItem, QuantityStepper)
      /motion        (Reveal, MaskText, ImageReveal, Marquee, PageTransition)
    /pages           (Home, Shop, Product, Wishlist, Cart, Checkout, OrderSuccess,
                      TrackOrder, Login, Register, Account, About, Contact, FAQs,
                      Privacy, Terms, NotFound)
    /hooks           /context   /services   /utils
    /config          (brand.js, routes.js)
    /content         (copy.json, faqs.json)
/server
  /src
    /routes          (products, orders, payments, auth, contact, newsletter, reviews)
    /controllers     /middleware (auth, validate, rateLimit, error)
    /services        (payments/, email/, orders/)
    /config          (firebaseAdmin.js)
    /utils
  /scripts           (seedProducts.js)
firestore.rules   storage.rules   firestore.indexes.json
```

### 12.3 Firestore Data Model

**`products/{productId}`**
```
name, slug, description, shortDescription,
categoryId, tags[], material, finish, occasion[],
price, compareAtPrice, currency: "PKR",
images[{url, alt, order}], videoUrl,
variants[{id, label, sku, stock, priceOverride?}],
isActive, isFeatured, isNew, isBestseller,
ratingAverage, ratingCount, searchKeywords[],
createdAt, updatedAt
```
**`categories/{categoryId}`**: name, slug, image, order, isActive

**`users/{uid}`**: name, email, phone, role, createdAt
- subcollection **`addresses/{id}`**: label, fullName, phone, line1, city, province, postalCode, isDefault

**`carts/{uid}`** and **`wishlists/{uid}`**: items[], updatedAt

**`orders/{orderId}`**
```
orderNumber, userId (nullable for guests),
customer{name, phone, email}, shippingAddress{...},
items[{productId, name, variantLabel, price, qty, image}],
subtotal, shippingFee, discount, giftWrapFee, total,
paymentMethod, paymentStatus, paymentRef, receiptUrl,
status, statusHistory[{status, at, note}],
courier{name, trackingNumber, trackingUrl},
notes, createdAt, updatedAt
```
**`reviews/{id}`**: productId, userId, rating, title, body, images[], status, createdAt

**`contactMessages/{id}`**, **`newsletter/{id}`**, **`coupons/{code}`**, **`settings/store`** (shipping rates, free-shipping threshold, announcement text, bank details, contact info)

### 12.4 API Endpoints (REST, prefix `/api/v1`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/products` | Public | List with filters, sort, pagination |
| GET | `/products/:slug` | Public | Product detail |
| GET | `/categories` | Public | Category list |
| GET | `/search?q=` | Public | Search suggestions |
| POST | `/cart/validate` | Public | Re-price and stock-check a cart |
| POST | `/orders` | Public/User | Create order (server computes totals) |
| GET | `/orders/track` | Public | Track by order ID and phone/email |
| GET | `/orders/me` | User | List own orders |
| POST | `/orders/:id/cancel` | User | Cancel if still pending |
| POST | `/orders/:id/receipt` | Public/User | Attach bank transfer receipt |
| POST | `/payments/initiate` | Public/User | Start wallet/card payment |
| POST | `/payments/webhook` | Gateway | Confirm payment (signature verified) |
| POST | `/reviews` | User | Create review (verified buyers) |
| POST | `/contact` | Public | Contact form |
| POST | `/newsletter` | Public | Subscribe |
| GET/PUT | `/me`, `/me/addresses` | User | Profile and addresses |

Standard response shape: `{ success, data, error: { code, message } }`.

### 12.5 Security Requirements
- **Firestore rules:** public read for active products/categories; **no client writes** to `orders`, `products`, `settings`; users can only read/write their own `users`, `carts`, `wishlists`.
- All order totals computed on the server from database prices.
- Validate and sanitize all input; rate limit auth, contact, newsletter and order endpoints.
- `helmet`, strict CORS, HTTPS only, secure environment variable handling (`.env` never committed).
- Verify payment webhook signatures; make order creation idempotent.
- Receipt uploads restricted by type (JPG, PNG, PDF) and size (max 5 MB).
- Protect against spam on forms (honeypot or Turnstile).
- Never expose the Firebase Admin credentials to the client.

---

## 13. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Performance** | LCP under 2.5 s, CLS under 0.1, INP under 200 ms on mobile 4G. Route-based code splitting; images in WebP/AVIF; fonts preloaded |
| **Responsive** | Mobile-first. Breakpoints: 360, 640, 768, 1024, 1280, 1536. Test on small Android phones |
| **Accessibility** | WCAG 2.1 AA: keyboard navigation, visible focus states, alt text, labelled forms, color contrast, focus-trapped modals/drawers, reduced-motion support |
| **SEO** | Unique titles/meta per page, Open Graph tags, `Product` and `BreadcrumbList` JSON-LD, sitemap.xml, robots.txt, clean slugs. Note: a pure client-rendered SPA is weaker for SEO; consider pre-rendering key pages or moving to a framework with SSR/SSG later |
| **Browser support** | Latest two versions of Chrome, Safari, Firefox, Edge; Android Chrome; iOS Safari |
| **Analytics** | Google Analytics 4 or Plausible; Meta Pixel optional; track view item, add to cart, begin checkout, purchase |
| **Reliability** | Error boundaries, friendly error pages, API retry on safe GETs, logging for server errors |
| **Legal** | Cookie notice if analytics/ads are used; privacy policy and terms reviewed before launch |

---

## 14. Content Requirements (Client to Provide)
- Brand name, logo (SVG), tagline and brand story
- 30+ products at launch with professional photos (3+ per product) and accurate details: material, plating/finish, dimensions, weight, care instructions
- Size guide data (ring sizes, bangle sizes, chain lengths)
- Shipping rates, delivery times, return and exchange policy
- Bank and wallet account details for payments
- Business address, phone, email, WhatsApp number, social links
- FAQ answers, About page copy, policy texts

---

## 15. Quality Checklist (Definition of Done per Page)

- [ ] Matches the palette and fonts in Section 6, with no stray colors
- [ ] Passes the Anti-"AI-look" rules in Section 7
- [ ] Layout is not a generic template stack; has editorial asymmetry
- [ ] Animations follow Section 10 and respect reduced motion
- [ ] Looks right at 360px, 768px and 1440px widths
- [ ] Keyboard accessible with visible focus
- [ ] Loading, empty and error states designed
- [ ] No lorem ipsum or placeholder text left
- [ ] Lighthouse mobile: Performance 85+, Accessibility 90+, SEO 90+
- [ ] No "Admin Panel" link visible anywhere on the public site

---

## 16. Roadmap and Build Order

### Phase 0: Setup (Day 1-2)
1. Create the Vite React app, install Tailwind, Framer Motion, React Router, TanStack Query.
2. Add the Tailwind theme (Section 6.1), Google Fonts, `brand.js` config.
3. Create the Firebase project; set up Auth, Firestore, Storage; add the Node/Express server with the Admin SDK.

### Phase 1: Foundation and Brand Shell (Week 1)
4. Build UI primitives (Section 6.5) and motion helpers (`Reveal`, `MaskText`, `ImageReveal`, `PageTransition`).
5. Build **Header and Footer** exactly per Section 5, including the mobile menu and scroll-to-top button.
6. Build **Home** page (Section 9.1) with static content.

### Phase 2: Catalog (Week 2)
7. Seed products with the script; build Shop with filters/sort/search, and Product Detail.
8. Build the wishlist and cart drawer, with the add-to-bag animation.

### Phase 3: Accounts and Checkout (Week 3)
9. Auth pages and Account area.
10. Checkout, order creation API (server-side pricing, stock transaction), order success.
11. COD and bank transfer first; then the wallet/card gateway integration.
12. Track Order and transactional emails.

### Phase 4: Content Pages and Polish (Week 4)
13. About, Contact, FAQs, Privacy Policy, Terms, 404.
14. Reviews, newsletter, SEO, analytics.
15. Performance, accessibility and cross-device testing; final animation tuning.

### Phase 5: Launch
16. Security review of Firestore rules and API; load-test checkout; configure domain, SSL, email domain (SPF/DKIM); soft launch and monitor.

### Phase 2 Product Backlog (Post-launch)
- Private admin dashboard (not linked on the public site): products, orders, customers, reviews, coupons, settings
- Phone OTP login, abandoned cart emails, advanced coupons and gift cards
- Courier API integration (live tracking and label creation)
- Better search (Algolia/Typesense), recently viewed, product recommendations
- Multi-currency and international shipping, Urdu language option
- SSR/SSG for stronger SEO (e.g. migrate storefront to Next.js)

---

## 17. Risks and Open Questions

| Risk / Question | Mitigation / Owner |
|---|---|
| Payment gateway approval takes time and needs business documents | Start onboarding in week 1; launch with COD and bank transfer first |
| High COD refusal rate | Prepaid incentive, order confirmation message/call, phone validation |
| Client-rendered SPA is weaker for SEO | Pre-render key pages, strong meta tags, plan SSR/SSG migration |
| Photography quality drives the premium feel | Shoot or source consistent, high-quality images before launch; use placeholders in the interim |
| Firebase plan/pricing limits for Storage and function use | Check current Firebase pricing before launch; consider Cloudinary for images |
| Legal text (privacy, terms, returns) | Have a qualified professional review before launch |
| Final brand name, logo and domain | Client to confirm; all references come from `brand.js` |
| Admin dashboard required at launch? | Confirm. Default assumption: Phase 2, products managed via console and seed script |

---

## 18. Research Sources

- Jewelry e-commerce design trends and best practices (2026): jewelexperts.blogspot.com, 4spotconsulting.com, gemfind.com, krishaweb.com, leadgenapp.io, immerss.live
- Luxury and jewelry color palettes: blendnow.com (luxury palettes), madegooddesigns.com (champagne shades), branvas.com (jewelry brand design guide), piktochart.com (rose gold and champagne palettes), inspoai.io (luxury color trends)
- Typography for luxury and jewelry sites: font-pairing guides citing Cormorant Garamond, Playfair Display and Montserrat on Google Fonts; muffingroup.com (luxury website motion and design principles)
- Pakistan payments: simpaisa.com (COD, wallets and gateway guidance), WordPress.org plugin listing for manual JazzCash/Easypaisa payments, Shopify Community thread on JazzCash/Easypaisa, oscar.pk (local e-commerce platform considerations)

*Statistics and gateway details change often. Re-verify them before making commercial commitments.*

---
*End of document.*
