# Design.md

## Design System and UI Specification: Aurelle Jewels

| | |
|---|---|
| **Companion to** | `PRD_Jewelry_Ecommerce.md` (v1.0) |
| **Version** | 1.0 |
| **Date** | 8 November 2026 |
| **Stack** | React (Vite), Tailwind CSS, Framer Motion |
| **Brand name** | *Aurelle Jewels* is a placeholder. Read it from `src/config/brand.js`, never hard-code it. |

> **For the AI coding tool:** this file is the single source of truth for how the site looks and moves. Every value here is a requirement. If something is not specified, choose the option that is calmer, lighter and more spacious, never the busier one.

---

## 1. Design Concept

### 1.1 One-line idea
**"A quiet, sunlit boutique."** Warm light, soft textures, slow movement, and jewelry treated like the only thing in the room.

### 1.2 Three design pillars

| Pillar | Meaning in practice |
|---|---|
| **Editorial** | Layouts feel like a printed lookbook: large images, offset text, big serif headlines, captions and numbered labels. |
| **Restrained** | Few colors, lots of space, hairline borders instead of heavy shadows. Gold appears like real jewelry: small and precious. |
| **Unhurried** | Motion is slow, soft and purposeful. Nothing bounces, flashes or competes for attention. |

### 1.3 Mood words
Warm, romantic, tactile, calm, confident, personal.

### 1.4 Not this
Techy, neon, glassy, gradient-heavy, playful-cartoonish, cluttered discount-store, or "AI template".

---

## 2. Design Tokens

### 2.1 Color

| Token | Name | Hex | Use |
|---|---|---|---|
| `--c-ivory` | Pearl Ivory | `#FBF8F3` | Default page background |
| `--c-cream` | Warm Cream | `#F5EEE4` | Alternate sections, input fills, skeleton base |
| `--c-champagne` | Champagne | `#E7D3B5` | Highlight bands, marquee, tags, borders on dark |
| `--c-blush` | Dusty Blush | `#F1DDD6` | Soft backgrounds, hover fills, gift sections |
| `--c-rose` | Rose Gold | `#C98C7A` | Icon accents, sale badge, hover accent, selection color |
| `--c-gold` | Antique Gold | `#B8924A` | Hairlines, underlines, star ratings, progress ring |
| `--c-ink` | Warm Ink | `#2B2522` | Headings, body text, primary button |
| `--c-taupe` | Taupe | `#6E625A` | Secondary text, captions, placeholders |
| `--c-noir` | Espresso Noir | `#1C1917` | Footer, dark band sections |
| `--c-hairline` | Hairline | `#E4D9CB` | 1px dividers and borders on light backgrounds |
| `--c-sage` | Sage | `#6F8F72` | Success |
| `--c-garnet` | Garnet | `#A33B3B` | Error, out of stock |

```css
:root {
  --c-ivory: #FBF8F3;
  --c-cream: #F5EEE4;
  --c-champagne: #E7D3B5;
  --c-blush: #F1DDD6;
  --c-rose: #C98C7A;
  --c-gold: #B8924A;
  --c-ink: #2B2522;
  --c-taupe: #6E625A;
  --c-noir: #1C1917;
  --c-hairline: #E4D9CB;
  --c-sage: #6F8F72;
  --c-garnet: #A33B3B;

  --ease-luxe: cubic-bezier(0.22, 1, 0.36, 1);
  --shadow-soft: 0 12px 40px rgba(43, 37, 34, 0.08);
}

::selection { background: var(--c-blush); color: var(--c-ink); }
html { background: var(--c-ivory); color: var(--c-ink); }
```

### 2.2 Color pairing and contrast rules

| Text on background | Allowed? | Notes |
|---|---|---|
| Ink on Ivory / Cream / Champagne / Blush | Yes | Main reading pairs |
| Taupe on Ivory / Cream | Yes | Secondary text only, 13px or larger |
| Ivory on Noir | Yes | Footer and dark bands. Use ivory at 100% for headings, 75-80% opacity for body links |
| Ivory on Ink | Yes | Primary button |
| Ink on Gold | Yes | Primary button hover state |
| **Gold or Rose Gold as small text on Ivory** | **No** | Contrast is too low. Use them for lines, icons, large display text (24px+) and fills only |
| Ivory on Garnet | Yes | Error and out-of-stock badges |

**Dominance rule:** on any screen, **60%** neutral (Ivory/Cream), **30%** Ink or Noir, **10%** accent (Gold, Rose, Blush, Champagne).

**Gradients:** only a very soft Ivory-to-Cream or Champagne-to-Blush wash behind a section. No gradient text. No purple, blue or neon anywhere.

### 2.3 Typography

| Role | Font (Google Fonts) | Weights | Case and tracking |
|---|---|---|---|
| Wordmark | Cormorant Garamond | 600 | UPPERCASE, `letter-spacing: 0.18em` |
| Display and headings | Cormorant Garamond | 500, 600 (+ italic 400 for emphasis) | Sentence case |
| Body, UI, prices | Montserrat | 400, 500 | Sentence case |
| Labels, buttons, nav | Montserrat | 500 | UPPERCASE, `letter-spacing: 0.14em`, 11-13px |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500&display=swap" rel="stylesheet">
```

**Type scale**

| Style | Desktop | Mobile | Line height | Font |
|---|---|---|---|---|
| Hero | 88px | 46px | 1.02 | Cormorant 500 |
| H1 | 56px | 38px | 1.08 | Cormorant 500 |
| H2 | 40px | 30px | 1.15 | Cormorant 500 |
| H3 | 28px | 22px | 1.2 | Cormorant 600 |
| Product name | 22px | 19px | 1.25 | Cormorant 600 |
| Body | 16px | 15px | 1.7 | Montserrat 400 |
| Small / caption | 13px | 13px | 1.6 | Montserrat 400, Taupe |
| Label / button | 12px | 12px | 1.2 | Montserrat 500, uppercase |
| Price | 15-16px | 15px | 1 | Montserrat 500 |

**Emphasis technique:** in big headlines, set **one word** in *Cormorant italic* (e.g. "Pieces you'll *reach for* every morning"). Never italicize whole headings.

**Text measure:** body paragraphs max 62 characters wide (`max-w-prose` or about 540px). Headlines can run wider.

### 2.4 Spacing

Base unit 4px. Scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160`.

| Context | Value |
|---|---|
| Section padding (desktop) | 112-140px top and bottom |
| Section padding (mobile) | 64-80px |
| Container max-width | 1280px |
| Container side padding | 24px mobile, 48px desktop |
| Grid gap (products) | 24px mobile, 32px desktop |
| Heading to body gap | 20-24px |

### 2.5 Shape, borders, elevation

| Element | Rule |
|---|---|
| Cards, images, buttons, inputs | Radius `0` (or max `2px`). Sharp edges feel refined. |
| Icon buttons, badges, scroll-to-top | Fully round (`rounded-full`) |
| Borders | 1px `--c-hairline`. On dark: `rgba(231,211,181,0.18)` |
| Shadows | Mostly none. Only for floating layers (drawer, dropdown, modal): `--shadow-soft` |
| Dividers | 1px hairline, or a short 48px x 1px gold rule beside labels |

### 2.6 Tailwind configuration

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF8F3', cream: '#F5EEE4', champagne: '#E7D3B5',
        blush: '#F1DDD6', rose: '#C98C7A', gold: '#B8924A',
        ink: '#2B2522', taupe: '#6E625A', noir: '#1C1917',
        hairline: '#E4D9CB', sage: '#6F8F72', garnet: '#A33B3B',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { wordmark: '0.18em', label: '0.14em' },
      transitionTimingFunction: { luxe: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      maxWidth: { page: '1280px' },
      boxShadow: { soft: '0 12px 40px rgba(43,37,34,0.08)' },
    },
  },
};
```

---

## 3. Layout System

### 3.1 Grid
- Desktop: 12-column grid, 32px gutter, 1280px max container.
- Tablet: 8 columns. Mobile: 4 columns, 16px gutter.
- **Break the grid on purpose:** editorial sections may offset an image by one or two columns, or bleed to the viewport edge.

### 3.2 Breakpoints

| Name | Min width | Notes |
|---|---|---|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablet portrait, 3-column product grid |
| `lg` | 1024px | Desktop nav appears |
| `xl` | 1280px | Full container |
| `2xl` | 1536px | Container stays 1280px, more whitespace |

Design **mobile first**. Most visitors will arrive on small Android and iPhone screens.

### 3.3 Section rhythm
Alternate backgrounds so the page has a beat: Ivory, Cream, Ivory, Champagne or Blush band, Ivory, **one** Noir band, Ivory. Never more than one dark band per page apart from the footer.

---

## 4. Global Components

### 4.1 Header

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [optional announcement bar: "Free delivery above PKR X"]        dismiss ✕│
├──────────────────────────────────────────────────────────────────────────┤
│ AURELLE JEWELS            Home  Shop  About  Contact  Login    ♡   👜(2) │
└──────────────────────────────────────────────────────────────────────────┘
(icons are thin-stroke SVG, not emoji; shown here as placeholders only)
```

| Property | Spec |
|---|---|
| Height | 80px desktop, 64px mobile |
| Wordmark | Cormorant 600, 22-24px, uppercase, `tracking-wordmark` |
| Nav links | Montserrat 500, 13px, uppercase, `tracking-label`, 40px gap |
| Active link | 1px gold underline, 6px below text |
| Hover | Underline draws left to right over 300ms; text stays Ink |
| Icons | Lucide, 22px, stroke 1.4, Ink; wishlist and bag with count badge (16px circle, Ink bg, Ivory text 10px) |
| On hero (top of page) | Transparent bg, Ivory text and icons (hero image needs a subtle dark scrim behind the top 160px) |
| After scroll over 80px | Ivory bg at 92% opacity, `backdrop-blur-md`, bottom 1px hairline |
| Scroll behavior | Slides up out of view when scrolling down, slides back on scroll up (translateY, 400ms, `luxe`) |
| Logged in | "Login" becomes the first name with a small dropdown (My Orders, Profile, Logout) |

**Mobile menu (below 1024px):** hamburger opens a full-height Ivory panel sliding in from the right. Links are large Cormorant 36px, revealed with a 70ms stagger. Bottom of the panel shows phone, email and social icons. Close icon top right. Body scroll locked while open.

### 4.2 Footer

```
┌──────────────────────────────────────────────────────────────────────────────┐ (Noir bg)
│  Newsletter row:  "New arrivals, first."          [ email           ] [JOIN]   │
│ ───────────────────────────────────────────────────────────────────────────── │
│  AURELLE JEWELS        QUICK LINKS     SUPPORT           CONTACT INFO          │
│  Short brand line      Home            FAQs              ⌖ Address line 1      │
│  about pieces that     Shop            Track Order         City, Pakistan      │
│  reflect the wearer.   About Us        Privacy Policy    ✆ 03XX XXXXXXX        │
│  (social icons)        Contact                           ✉ info@domain.com     │
│ ───────────────────────────────────────────────────────────────────────────── │
│              © 2026 Aurelle Jewels. All rights reserved.            ( ↑ )      │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Property | Spec |
|---|---|
| Background | `--c-noir` |
| Padding | 96px top, 48px bottom (desktop); 64px / 32px (mobile) |
| Column layout | `grid-cols-[1.4fr_1fr_1fr_1.4fr]` desktop; 2 columns tablet; stacked mobile |
| Column headings | Cormorant 600, 20px, Ivory |
| Links | Montserrat 400, 15px, Ivory at 75% opacity; hover to 100% with gold underline drawing in |
| Contact icons | 18px thin-stroke, Champagne color |
| Contact items | `tel:` and `mailto:` links; address links to map |
| Bottom bar | 1px divider `rgba(231,211,181,0.18)`, copyright centered, 13px, Ivory 60% |
| Scroll-to-top | 56px circle, fixed 32px from right and bottom; fill `--c-ink` at 90% with 1px champagne border; up-arrow icon in Ivory; **gold progress ring** (SVG stroke) fills with scroll; appears after 400px scroll |
| **Excluded** | **No "Admin Panel" link.** |

### 4.3 Buttons

| Variant | Default | Hover | Active/Focus |
|---|---|---|---|
| **Primary** | Ink bg, Ivory text | Gold bg sweeps in from the left (300ms), text turns Ink | 2px gold focus ring, 3px offset |
| **Secondary** | Transparent, 1px Ink border, Ink text | Blush fill sweeps in | Same focus ring |
| **Ghost / text link** | Ink text with 1px underline | Underline turns Rose Gold, arrow slides 4px right | Same focus ring |
| **On dark** | Ivory bg, Ink text | Champagne bg | Champagne focus ring |

Common: uppercase Montserrat 500, 12px, `tracking-label`, padding `16px 32px`, min height 48px (touch target), radius 0, loading state replaces label with a thin spinner line. Disabled: 40% opacity, no hover.

```jsx
// Button sweep pattern
<button className="relative overflow-hidden bg-ink text-ivory px-8 py-4 text-xs uppercase tracking-label group">
  <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
  <span className="relative transition-colors duration-300 group-hover:text-ink">Add to bag</span>
</button>
```

### 4.4 Inputs and forms
- **Style:** bottom border only (1px hairline), transparent or Cream background, 52px tall.
- **Floating label:** sits as placeholder, shrinks to 11px uppercase label on focus or when filled.
- **Focus:** a gold 1px line expands from the center outward under the field (300ms).
- **Error:** Garnet border and a 13px message under the field with a small icon; message region uses `aria-live="polite"`.
- **Select, checkbox, radio:** custom styled to match: square checkbox with gold check; radio as a small Ink dot in a hairline circle.
- **Variant pickers (size, finish):** square swatch buttons, 44px, hairline border; selected gets a 1.5px Ink border; unavailable shows a diagonal line through and 40% opacity. Color/finish swatches are circles with a thin ring when selected.

### 4.5 Product card

```
┌───────────────────┐
│ NEW            ♡  │   image 4:5, Cream placeholder while loading
│                   │   hover: second image crossfades, scale 1.04
│                   │
│ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │   "QUICK ADD" bar slides up on hover (desktop)
└───────────────────┘
 Pearl Drop Necklace       (Cormorant 600, 22px)
 Gold plated · 18 in       (Montserrat 13px Taupe)
 PKR 3,450   PKR 4,200     (price Ink, compare-at Taupe struck through)
```

| Property | Spec |
|---|---|
| Image ratio | 4:5, `object-cover` |
| Badges | Top left, uppercase 10px, Ivory bg, Ink text, 1px hairline; SALE uses Rose Gold bg with Ink text; Low stock uses Blush |
| Heart | Top right, 36px round, Ivory at 85% bg; fills Rose Gold with a small scale pop on toggle |
| Hover (desktop) | Second image crossfade 500ms, slow scale 1.04, Quick Add bar slides up (translateY 100% to 0) |
| Mobile | No hover effects; small round "+" button bottom right of the image |
| Sold out | Image at 60% opacity, "Sold out" Garnet label, no quick add |
| Border | None. The image is the card. No box, no shadow. |

### 4.6 Cart drawer
- 440px wide on desktop, full width on mobile, slides from right (500ms `luxe`), backdrop `rgba(28,25,23,0.45)`.
- Header: "Your Bag (n)" in Cormorant 28px and a close icon.
- Free-shipping progress: thin 2px gold bar on a hairline track with a short sentence.
- Line items: 80x100px image, name (serif), variant (Taupe), quantity stepper, price, remove link. Hairline between items.
- Footer (sticky): subtotal, small note "Shipping and taxes at checkout", primary "Checkout" button full width, text link "View bag".
- Empty state: short line, "Continue shopping" button.

### 4.7 Other components

| Component | Spec |
|---|---|
| **Toast** | Bottom center, Ivory bg, 1px hairline, `shadow-soft`, 14px text, 3s auto-dismiss, slides up 16px and fades |
| **Accordion** | Row with 1px hairline top and bottom, label uppercase 13px, plus/minus icon rotates, height animates |
| **Modal / Quick view** | Backdrop Noir 50%, panel Ivory, fades and scales from 0.98, focus trap, closes on Esc |
| **Breadcrumbs** | 12px uppercase taupe, separated by a thin slash |
| **Tabs** | Uppercase labels, 1px gold underline slides between active tabs |
| **Rating stars** | 14px Gold filled stars (decorative; always paired with numeric text) |
| **Skeleton** | Cream block with a slow champagne shimmer (1.8s loop); mirrors the real layout |
| **Badge row** | Small caps text with a 1px gold dot separator |
| **Divider ornament** | A 48px gold hairline, or a tiny diamond between two hairlines, used sparingly |

---

## 5. Page Layouts

> Wireframes are structural guides. Imagery is described by intent. Apply Sections 2 and 4 for all styling.

### 5.1 Home

```
HERO (full bleed, 100vh, min 640px)
┌──────────────────────────────────────────────────────────────┐
│ [header transparent over image]                              │
│                                                              │
│  SPRING-LIT CRAFT (label, gold rule)                         │
│  Pieces you'll                                               │
│  reach for                    (image: model, soft window     │
│  every morning.                light, warm backdrop)         │
│  [SHOP THE COLLECTION]   Our story →                         │
│                                                    ↓ scroll  │
└──────────────────────────────────────────────────────────────┘
MARQUEE (Champagne band, 48px): Handpicked pieces · Easy returns · Delivery across Pakistan ·
CATEGORIES (Ivory) — asymmetric: one tall tile (rings), two wide (necklaces, earrings),
                     one square (bracelets), one square (sets)
NEW ARRIVALS (Cream) — heading left, "View all →" right; horizontal drag carousel, snap
EDITORIAL SPLIT (Ivory) — large image 7 cols; text card overlaps image edge by 80px
BESTSELLERS (Ivory) — 4-up grid
OCCASION TABS (Blush) — Everyday | Gifting | Festive and Bridal; row crossfades
CRAFT AND CARE (Noir band) — 4 numbered items in a row: 01 Materials, 02 Finish, 03 Packaging, 04 Returns
REVIEWS (Cream) — one big pull-quote at a time, serif italic, name + city, gold stars
GALLERY STRIP (Ivory) — 5 square images linking to social
FOOTER
```

**Hero specifics**
- Desktop: image fills; left-aligned text block in left 5 columns; a 160px dark scrim gradient at the top for header legibility and a gentle left-to-right scrim (`rgba(28,25,23,0.35)` to transparent) for text contrast.
- Mobile: image 4:5 at the top with text beneath on Ivory, or text over image at bottom with the same scrim; CTA full width.
- Headline: Cormorant 500, Hero size, Ivory, one italic word.
- Label above headline: uppercase 12px Champagne with a 48px gold rule.

### 5.2 Shop

```
Breadcrumb
Title (Cormorant H1)  +  result count            Sort ▾   [Filters] (mobile)
─────────────────────────────────────────────────────────────────────
Filters (260px, sticky)      │  Product grid  4-up (3 tablet, 2 mobile)
 Category                    │  ┌──┐ ┌──┐ ┌──┐ ┌──┐
 Price (range)               │  └──┘ └──┘ └──┘ └──┘
 Material / finish           │  Active filter chips above grid
 Color, Occasion             │  "Load more" button centered below
 Availability                │
```

- Filter groups collapse with accordion animation; mobile filters open as a bottom sheet (slides up, 85% height).
- Optional one **editorial interruption tile** inside the grid (a wide image with a short line of copy) every 8-12 products to break monotony.
- Empty results: short friendly line, "Clear filters" link, suggested categories.

### 5.3 Product detail

```
Breadcrumb
┌─────────────────────────────┬──────────────────────────────┐
│ Thumbs │   MAIN IMAGE       │ Label: NEW                   │
│ (vert) │   (hover zoom)     │ Product name (Cormorant H1)  │
│        │                    │ ★★★★★ 4.8 (23 reviews)       │
│        │                    │ PKR 3,450   PKR 4,200 -18%   │
│        │                    │ Short description            │
│        │                    │ Finish: ◯ ◯ ◯                │
│        │                    │ Size:  [6][7][8][9]  Size guide│
│        │                    │ Qty [- 1 +]                  │
│        │                    │ [ADD TO BAG]  (primary, full)│
│        │                    │ [♡ Save]   Order on WhatsApp │
│        │                    │ ─ trust row (3 small items)  │
│        │                    │ ▸ Details  ▸ Care  ▸ Shipping│
└─────────────────────────────┴──────────────────────────────┘
Reviews  →  You may also like (4-up)
```

- Info column is `sticky top-28` on desktop.
- Mobile: gallery is a swipe carousel with dots; the info stack follows; a **sticky bottom bar** with price and Add to Bag appears when the main button leaves the viewport.
- Image zoom on desktop: cursor changes to a zoom lens; image scales 2x and pans with the pointer.

### 5.4 Cart page, Checkout, Order success
- **Cart page:** two columns (items 65%, summary 35% sticky). Gift wrap checkbox, order note, coupon field styled as underline input with "Apply" text button.
- **Checkout:** two columns; left is the three step accordion (Contact and Delivery, Shipping, Payment), right is a sticky order summary on Cream. Header is simplified (wordmark centered, secure lock icon right). Payment options are selectable rows with a radio, label, small logo, and a short helper text that expands when selected. Place Order button is full width primary.
- **Order success:** centered, an SVG check drawn in gold (stroke-dashoffset animation, 900ms), "Thank you" in Cormorant H1, order number in a Cream box, short summary, two buttons (Track Order, Continue Shopping).

### 5.5 Track Order
Narrow centered form (max 520px). Result shows a **vertical timeline**: a 1px hairline with 12px circles; completed steps filled Ink with a gold ring on the current step; timestamps in Taupe; courier link at the bottom.

### 5.6 Auth pages
Split screen: left half is a full-height image with a short serif quote in Ivory (hidden on mobile), right half is the form centered on Ivory. Tabs or text link switches between Login and Register. Google button is Secondary style with a monochrome Google mark.

### 5.7 Account
Left vertical tab list (Orders, Addresses, Profile) as uppercase labels with a gold active bar; content panel on the right. Order rows have thumbnails, number, status chip (color-coded softly: Sage, Champagne, Blush, Garnet), total, and "View" link.

### 5.8 About
1. Opening statement, large serif, 3-4 lines, max 18ch per line feeling, with a small label above.
2. Story: two staggered images (one tall, one small offset) beside text.
3. Values: three numbered rows (01, 02, 03), each with a heading and one sentence, separated by hairlines. **Not icon cards.**
4. Process: horizontal image strip of craft or packing details with captions.
5. Closing: Blush band, one sentence, Shop button.

### 5.9 Contact
Two columns: left a large heading "Say hello." and the form; right a Cream panel with address, phone, email, hours and social links, then the map below. WhatsApp button as a Secondary button with a thin line icon.

### 5.10 FAQs
Left sticky topic list, right accordions. A search field at top with an underline style. Short answers, linking to Track Order, Privacy and Contact where relevant.

### 5.11 Privacy Policy and Terms
Single narrow column (max 720px), sticky table of contents on large screens, clear headings, comfortable 1.8 line height, last updated date at the top.

### 5.12 404
Large Cormorant "404" in Champagne, a ring or earring line-drawing in gold that draws itself (SVG stroke animation), one short line, buttons to Home and Shop.

---

## 6. Motion Design

### 6.1 Principles
1. **Purposeful.** Guide attention, confirm an action, or add polish. Otherwise remove it.
2. **Slow and soft.** Calm easing, no overshoot, no bounce (except the tiny badge pop).
3. **Varied.** Different effects for different jobs. Not everything fades up.
4. **Cheap to render.** Animate only `transform` and `opacity` (plus `clip-path` for image reveals).
5. **Accessible.** Honor `prefers-reduced-motion`.

### 6.2 Tokens

```js
// src/motion/tokens.js
export const ease = [0.22, 1, 0.36, 1];
export const dur = { micro: 0.25, base: 0.6, slow: 0.9, hero: 1.1 };
export const stagger = 0.08;
```

### 6.3 Reusable motion primitives

```jsx
// Reveal: fade + rise, once per element
import { motion, useReducedMotion } from 'framer-motion';
import { ease, dur } from './tokens';

export function Reveal({ children, delay = 0, y = 24, className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: dur.base, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
```

```jsx
// MaskText: headline lines rise from behind a clip (use for hero + big headings)
export function MaskLines({ lines, className }) {
  const reduce = useReducedMotion();
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: reduce ? 0 : '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: dur.hero, ease, delay: 0.15 + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
```

```jsx
// ImageReveal: clip-path wipe + inner scale settle
export function ImageReveal({ src, alt, className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: reduce ? 'inset(0)' : 'inset(100% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: dur.slow, ease }}
    >
      <motion.img
        src={src} alt={alt} className="h-full w-full object-cover"
        initial={{ scale: reduce ? 1 : 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease }}
      />
    </motion.div>
  );
}
```

```jsx
// Page transitions (wrap routes with AnimatePresence mode="wait")
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};
```

```jsx
// Header hide/show on scroll direction
import { useScroll, useMotionValueEvent } from 'framer-motion';
const { scrollY } = useScroll();
useMotionValueEvent(scrollY, 'change', (y) => {
  const prev = scrollY.getPrevious() ?? 0;
  setHidden(y > prev && y > 120);   // hide when scrolling down past 120px
  setScrolled(y > 80);              // switch from transparent to ivory
});
```

```jsx
// Scroll-to-top progress ring (SVG circle r=26, circumference ~163.4)
const { scrollYProgress } = useScroll();
<motion.circle cx="28" cy="28" r="26" fill="none" stroke="#B8924A" strokeWidth="1.5"
  style={{ pathLength: scrollYProgress }} transform="rotate(-90 28 28)" />
```

### 6.4 Animation catalog

| Where | Effect | Timing | Notes |
|---|---|---|---|
| First visit | Preloader: wordmark fades in, 1px gold line draws beneath | Max 1.2s | Once per session (sessionStorage flag) |
| Route change | Fade + 12px rise in, quick fade out | 500ms / 250ms | `AnimatePresence mode="wait"`; scroll to top on change |
| Header | Hide on scroll down, show on scroll up | 400ms | Transparent to Ivory after 80px |
| Nav links | Gold underline draws left to right | 300ms | `scaleX` from 0 to 1, `origin-left` |
| Hero | MaskLines headline, image scale 1.08 to 1, fade-in CTA | 1.1s | Stagger 120ms per line |
| Section headings | MaskLines or Reveal | 600ms | Vary between the two |
| Images in editorial blocks | ImageReveal | 900ms | Never reveal product grid images this way (too slow); use plain fade |
| Product grids | Fade with 60ms stagger on first load | 500ms | Re-stagger quickly on filter change using `layout` |
| Product card hover | Image crossfade, scale 1.04, Quick Add bar up | 500ms / 300ms | Desktop pointer devices only (`@media (hover:hover)`) |
| Heart toggle | Scale 1 to 1.25 to 1, fills Rose Gold | 350ms | Only micro-bounce in the site |
| Add to bag | Label changes to "Added" with check; product thumb arcs to the bag icon; badge pops; drawer opens | 800ms total | Fly-to-bag optional, skip on reduced motion |
| Quantity change | Number slides vertically | 200ms | `AnimatePresence` with `y` |
| Cart drawer | Slide from right, backdrop fade, items stagger 50ms | 500ms | Trap focus, Esc closes |
| Accordions | Height auto animate, icon rotates | 350ms | |
| Filters sheet (mobile) | Slides up with backdrop | 450ms | |
| Marquee | Linear infinite horizontal loop | 30-40s per loop | Pauses on hover; static under reduced motion |
| Parallax | Image translateY of 8-10% over scroll range | Scroll-linked | Hero, About, editorial split only; off on mobile if janky |
| Tabs (occasion) | Underline slides; row crossfades | 400ms | |
| Reviews rotator | Crossfade quote every 6s | 700ms | Pause on hover, manual dots |
| Buttons | Fill sweep | 300ms | See 4.3 |
| Inputs | Gold line grows from center; label floats | 300ms | |
| Toasts | Rise 16px and fade | 350ms | |
| Skeletons | Shimmer loop | 1.8s | Crossfade into real content, 400ms |
| Order success | SVG check draws in gold, then summary fades up | 900ms + 500ms | |
| Scroll-to-top | Appears after 400px, ring fills with scroll | 300ms | |
| 404 | Line drawing of a ring draws itself | 1.4s | |
| Custom cursor (optional) | 10px ring, grows to 56px labeled "View" over product images | 250ms | Desktop pointer only; off with reduced motion |

### 6.5 Reduced motion
When `prefers-reduced-motion: reduce`: disable parallax, marquee, preloader, fly-to-bag, mask and clip reveals, and custom cursor; keep short (150ms) opacity fades and the drawer slide shortened to a fade.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

### 6.6 Smooth scrolling (optional)
Lenis with `lerp: 0.1`, disabled on touch devices and under reduced motion. Do not hijack scroll inside the cart drawer, modals or filter sheets.

---

## 7. Imagery and Iconography

### 7.1 Photography direction

| Element | Direction |
|---|---|
| Light | Soft, natural, directional window light. No harsh flash, no heavy filters. |
| Backdrops | Linen, plaster, stone, soft paper in Ivory, Cream, Blush, Champagne, with occasional deep Noir for contrast |
| Product shots | Clean front shot, macro detail shot, scale shot on a hand or neck |
| Lifestyle | Real, relaxed moments, not stiff catalog poses. Cropped faces are fine. |
| Color grading | Warm, slightly lifted blacks, consistent across all images |
| Consistency | Same crop ratios everywhere: product 4:5, category tiles per layout, hero 16:9 desktop and 4:5 mobile |

**While photos are not ready:** use solid Cream, Blush or Champagne blocks with the product name in Cormorant; never gray rectangles, random stock photos or AI-generated faces.

### 7.2 Image handling
- WebP or AVIF with JPEG fallback; responsive `srcset` and `sizes`.
- Always set `width` and `height` (or `aspect-ratio`) to prevent layout shift.
- Lazy-load below the fold; the hero image is eager and `fetchpriority="high"`.
- Use a Cream placeholder color or tiny blurred preview while loading.
- Descriptive `alt` text for every product image (material, style, view).

### 7.3 Icons
- One family only: **Lucide**, stroke width 1.25-1.5, 20-24px, Ink (or Ivory/Champagne on dark).
- Brand social icons drawn in the same thin style, monochrome.
- Payment icons: monochrome or muted logos in a row, 24px high.
- **No emoji used as icons** anywhere in the UI.

---

## 8. Voice and Microcopy

| Moment | Copy direction |
|---|---|
| Hero | "Pieces you'll *reach for* every morning." |
| Add to bag | "Add to bag" then "Added" |
| Cart empty | "Your bag is empty. Let's fix that." |
| Wishlist empty | "Nothing saved yet. Tap the heart on anything you love." |
| Newsletter | "New arrivals, first. No noise." |
| Form error | "That phone number looks short. Please check it." (specific and kind) |
| Order success | "Thank you. Your order is being wrapped with care." |
| 404 | "This page has slipped away. Let's get you back." |

**Rules:** short sentences; concrete detail (materials, finish, how it feels); no hype words ("unleash", "elevate", "seamless", "game-changing"); no exclamation marks; no lorem ipsum.

---

## 9. Responsive and Accessibility

### 9.1 Responsive behavior

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Header | Wordmark + 3 icons, slide-in menu | Same | Full nav |
| Product grid | 2 columns | 3 | 4 |
| Filters | Bottom sheet | Bottom sheet | Sticky sidebar |
| Product page | Stacked, sticky bottom bar | Stacked or 2-col | 2-col, sticky info |
| Cart | Full-screen drawer | 440px drawer | 440px drawer |
| Footer | Stacked blocks | 2 columns | 4 columns |
| Hover effects | Disabled (tap states instead) | Disabled | Enabled |

- Minimum touch target: 44x44px.
- Test at 360px, 390px, 768px, 1024px, 1440px.
- No horizontal page scroll at any width (only inside carousels).

### 9.2 Accessibility
- WCAG 2.1 AA minimum. Follow the contrast table in 2.2.
- Visible focus: 2px Gold outline with 3px offset on all interactive elements (on dark: Champagne).
- Full keyboard support: header, menu, drawer, modals, accordions, carousels, filters.
- Focus trap and `aria-modal` for drawer, modal and mobile menu; return focus to the trigger on close.
- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, correct heading order.
- Labels on every input; errors announced with `aria-live`.
- Icon-only buttons have `aria-label` (e.g. "Open wishlist", "Open bag, 2 items").
- Do not rely on color alone for status (add text or icon).
- Carousels and the reviews rotator can be paused and operated by keyboard.

---

## 10. Do and Don't Summary

| Do | Don't |
|---|---|
| Use big serif headlines with one italic word | Use Inter/Roboto as the main look |
| Use asymmetric, overlapping editorial layouts | Stack centered hero, then 3 identical icon cards, then testimonials |
| Use hairlines, labels and numbered details | Put heavy shadows and big rounded corners on everything |
| Keep Gold and Rose Gold as small accents | Use gold or rose as small body text |
| Vary animation by purpose and keep it slow | Fade-up everything the same way |
| Write specific, warm copy | Use filler like "Elevate your style" or lorem ipsum |
| Use consistent warm photography | Use mismatched stock photos or gray boxes |
| Keep one dark band plus the footer | Make the whole page dark or add many contrasting bands |
| Design empty, loading and error states | Leave blank screens or spinners with no context |
| Use thin-stroke icons | Use emoji or mixed icon styles |

---

## 11. Design QA Checklist (per page)

- [ ] Only palette colors from Section 2.1 are used; 60/30/10 balance holds
- [ ] Fonts are Cormorant Garamond and Montserrat only, using the type scale
- [ ] Radius, border and shadow rules (2.5) followed
- [ ] Layout has editorial character, not a template stack
- [ ] Header and footer match Section 4, **no Admin Panel link**
- [ ] Motion follows Section 6, uses only the listed primitives, and respects reduced motion
- [ ] Loading, empty, error and success states are designed
- [ ] Looks right at 360, 768 and 1440px; touch targets 44px+
- [ ] Focus states visible; contrast checks pass
- [ ] Copy follows the voice rules; no placeholder text remains
- [ ] Lighthouse mobile: Performance 85+, Accessibility 90+

---

## 12. Suggested Prompts for the AI Coding Tool

Use these in order. Always paste Sections 2, 4 and 6 of this file along with the prompt.

1. **Setup:** "Set up a Vite React project with Tailwind using the config in Design.md 2.6, add the fonts, CSS variables and the motion tokens and primitives from Section 6."
2. **Shell:** "Build the Header and Footer exactly as specified in Design.md Sections 4.1 and 4.2, including the mobile menu, announcement bar, newsletter row and scroll-to-top progress button. Do not add an Admin Panel link."
3. **Home:** "Build the Home page following Design.md 5.1, section by section, with the specified backgrounds and motion. Use warm placeholder blocks where photos are missing."
4. **Components:** "Build the ProductCard, CartDrawer, Button, Input and Accordion per Design.md Section 4."
5. **Shop and Product:** "Build Shop (5.2) and Product Detail (5.3) with filters, gallery zoom, variant pickers and the sticky mobile add-to-bag bar."
6. **Checkout flow:** "Build Cart, Checkout, Order Success and Track Order per Design.md 5.4 and 5.5."
7. **Content pages:** "Build Auth, Account, About, Contact, FAQs, Privacy and 404 per Design.md 5.6 to 5.12."
8. **Polish:** "Audit every page against the Design QA Checklist (Section 11) and fix every item that fails."

---
*End of document.*
