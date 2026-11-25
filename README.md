# Jewellery Store — Foundation

## Status
Foundation and homepage only. Not yet run or built in the environment where it was written (no network access there).

## Run locally
1. `cp .env.example .env.local` and fill in values.
2. `npm install`
3. `npm run typecheck`, `npm run lint`, `npm run build`
4. `npm run dev`

## Not built yet
Shop, product, category, collection, cart, wishlist, checkout, auth, admin and policy pages. Links to these will return 404 until built.

## Firebase
- Deploy rules: `firebase deploy --only firestore:rules,firestore:indexes`
- Set custom claims (`role: manager | admin`) only from a trusted server script using the Admin SDK.

## Placeholders
Brand name, tagline, announcement, contact details, hero image and trust points live in `src/config/site.ts`.
