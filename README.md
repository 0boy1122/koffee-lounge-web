# Koffee Lounge Website

A Next.js prototype for Koffee Lounge — coffee shop ordering, menu, and
corporate services site for the Accra market.

## Pages

- **Home** — hero, popular flavors, corporate teaser, delivery CTA, testimonials
- **About** — brand story, photo gallery, sourcing & sustainability
- **Menu** — searchable/filterable menu with dietary tags
- **Corporate Services** — offerings + inquiry form
- **Order** — cart, promo codes, checkout modal, live order status tracker

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Build (static export)

This project is configured for static export (`output: "export"`) so it can
be hosted on GitHub Pages, under the `/Koffee-Lounge-` base path (see
`src/lib/base-path.ts`).

```bash
npm run build
```

Output is written to `out/`.
