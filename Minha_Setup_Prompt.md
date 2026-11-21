# Prompt: apply the Minha Jewellers branding to the whole site

You are working inside an existing jewelry e-commerce website project (React + Vite + Tailwind + Framer Motion). Brand name: **Minha Jewellers**. Rebrand and restyle the whole site by following `Design.md` (version 1.2) in the project root. That file is the single source of truth for colors, logo and typography.

## Rules

- Change branding and styling only. Do not change layout structure, routing, business logic, API calls, data or backend code.
- Do not invent colors. Use only the tokens from Design.md Section 2.1.
- Work in the order below, and run the build after steps 3, 6 and 7.

## Step 1. Brand config

Create or update `src/config/brand.js` with: name `Minha Jewellers`, short name `Minha`, logo `/logo.png`, tagline from Design.md. Replace every hard-coded "Aurelle", "Aurelle Jewels", "Jewelry store" placeholder or old brand name with a value read from this config. Always spell it **Minha Jewellers** (double L).

## Step 2. Logo

- Copy `minha-logo.png` to `public/logo.png` (crop transparent or white margins if needed; if you can, make a transparent `logo.svg`).
- Use the logo in Header (44px high desktop, 36px mobile), Footer (single-color Ivory version on the dark background), Checkout header, Auth pages, Preloader and 404, per Design.md Section 2.7.
- Create favicon files (gold crown on a Maroon circle: 32, 180 and 512px) and link them in `index.html`.
- Update `index.html`: `<title>Minha Jewellers</title>`, meta description, `og:site_name`, `theme-color` `#0F3D33`.

## Step 3. Color tokens

1. Replace the CSS variables in the global stylesheet with the block in Design.md Section 2.1.
2. Replace `theme.extend.colors` in `tailwind.config.js` with the block in Design.md Section 2.6.
3. Search the whole `src/` folder for old hex values and old class names, and convert them using this map:

| Old | New |
| --- | --- |
| `#FBF8F3` / `ivory` | `#FBF8F1` / `ivory` |
| `#F5EEE4` / `cream` | `#F4EFE2` / `cream` |
| `#E7D3B5` / `champagne` | `#EADCB4` / `champagne` |
| `#F1DDD6` / `blush` | `#E3E9DA` / `mist` |
| `#C98C7A` / `rose` | `#6A1724` / `maroon` |
| `#B8924A` / `gold` | `#B88F45` / `gold` |
| `#2B2522` / `ink` | `#1E2A25` / `ink` (text only) |
| `#6E625A` / `taupe` | `#566558` / `moss` |
| `#1C1917` / `noir` | `#0A2A22` / `deep` |
| `#6F8F72` / `sage` | `#2F7A50` / `leaf` |
| `#A33B3B` / `garnet` | `#B3261E` / `alert` |
| `rgba(43,37,34,...)` | `rgba(30,42,37,...)` |
| `rgba(28,25,23,...)` | `rgba(10,42,34,...)` |
| `rgba(231,211,181,...)` | `rgba(234,220,180,...)` |

1. Anything that was `bg-ink` as a **button background, cart badge, scroll-to-top button or selected state** becomes `bg-forest`. Headings and product names become `text-forest`. Body text stays `text-ink`.
2. Sale badge, sale price, wishlist heart (filled) and link hover use `maroon`. Selection color: Maroon background, Ivory text.
3. Fix hard-coded colors in inline styles, SVGs (progress ring stroke is `#B88F45`), Framer Motion animate props, and any CSS modules.

## Step 4. Apply the color rules from Design.md 2.1.1 and 2.2

- 60% Ivory/Cream, 30% Forest or Deep Forest, 10% Gold, Maroon, Champagne, Mist.
- Footer is Deep Forest. The one dark band on the Home page ("Craft and care") is Maroon.
- Green and Maroon never touch directly: put Ivory, Cream or a gold hairline between them.
- Gold is never used as small text on light backgrounds. Use it for lines, icons, stars, rings and large text only.
- Error and out-of-stock use Alert Red, never Maroon.

## Step 5. Copy

Replace placeholder copy that mentions the old brand (footer, About, Contact, FAQs, Privacy, emails, meta tags, order success page, WhatsApp message text). Keep prices in PKR. Follow the voice rules in Design.md Section 8.

## Step 6. Verify

- Run `grep -rniE "aurelle|#FBF8F3|#F5EEE4|#E7D3B5|#F1DDD6|#C98C7A|#B8924A|#2B2522|#6E625A|#1C1917|rose|blush|taupe|noir|garnet" src index.html tailwind.config.js` and fix every remaining hit (ignore unrelated words).
- Run `npm run build` and fix errors.
- Check Home, Shop, Product, Cart, Checkout, Account and 404 at 360px, 768px and 1440px. No horizontal scroll, touch targets 44px or more, visible gold focus rings.
- Run the Design QA Checklist (Design.md Section 11).

## Step 7. Report

List every file you changed, anything you could not convert automatically, and any place where the logo background (white PNG) does not look right on Ivory so I can supply a transparent version.
