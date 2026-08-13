# Yohannes Atelier

Luxury watch storefront concept for a premium timepiece brand — built with React, TypeScript,
Tailwind CSS, React Three Fiber, Framer Motion, Zustand, and React Router.

## GitHub short description

Luxury watch storefront concept featuring a cinematic product experience, configurable timepieces,
and a polished e-commerce flow.

## Portfolio description

Yohannes Atelier is a luxury watch storefront concept designed to feel elevated, modern, and premium.
The experience blends a cinematic landing page, immersive product browsing, a live watch customizer,
and a streamlined cart and checkout flow to create a polished digital retail experience. It showcases
strong front-end development, design-driven UX, and premium product storytelling for a modern luxury brand.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## What's inside

- **`/` — Hero** — a circular 3D watch ring (React Three Fiber). Drag, scroll, swipe, or use
  the arrow keys/dots to rotate. The background gradient, accent color, bloom, and heading
  typeface adapt per watch (Neon Kinetic / Titanium Core / Quantum Void themes in
  `src/data/themes.ts`).
- **`/watches`** — full catalogue with category/price/feature filters, live search, and sort,
  backed by client state in `src/store/useStore.ts`.
- **`/watches/:slug`** — full product detail page with colorway selector, spec table, and an
  AR "Try-On" preview placeholder. A lighter Quick View modal is also available from any card.
- **`/customizer`** — live strap/case/glow configurator with real-time preview.
- **`/about`** — parallax brand story, release timeline, and material breakdown.
- **`/cart`** — slide-in cart drawer plus a full `/cart` page with promo codes
  (try `VANGUARD10` or `CHRONOS20`) and a simulated 3-step checkout.

## Notes

- All data is local/mock (`src/data/watches.ts`) — there's no backend.
- State (cart, filters, customizer, active hero watch) lives in a single Zustand store.
- This was scaffolded without a network connection, so dependencies have not been installed
  or build-verified in this environment — run `npm install` locally to pull everything down
  and shake out any last TypeScript nits.
