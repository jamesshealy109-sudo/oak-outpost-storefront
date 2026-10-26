# Oak & Outpost Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the approved standalone Oak & Outpost storefront and push it to a new private GitHub repository.

**Architecture:** Next.js/TypeScript owns the site and a provider-neutral commerce contract. The Fourthwall adapter loads published products and creates and manages provider carts; Fourthwall hosts checkout. Preserve customer assets outside this application.

**Tech Stack:** Next.js, React, TypeScript, CSS, Node test runner with tsx.

**Spec:** ../specs/2026-10-26-oak-outpost-storefront-design.md

## Global Constraints

- Forest green, cream, tan, and burnt orange; supplied name, tagline, artwork, and copy.
- Real prices and provider variant IDs; no invented sellable catalog or shipping guarantees.
- Fourthwall initially, separate adapter for a later supplier.
- Credentials and customer data excluded from Git.
- User approved scope and delegated remaining design and implementation details; execute inline without additional implementation-choice gates.

## Review Focus

- Malformed or stale cart storage must not crash shopping or silently discard a provider failure.
- Variant changes must update price and availability together.
- Sold-out or incomplete bundle selections must never create an invalid cart.
- Provider timeouts and failures must show recovery actions and prevent a false success.
- Unconfigured forms must use a real support path and never claim submission.

### Task 1: Commerce integration and isolated app setup

**Files:** package.json, tsconfig.json, next.config.ts, lib/commerce/{types,fourthwall,validation}.ts, tests/commerce.test.ts.

**Interfaces:** `CommerceProvider` exposes listProducts, getProduct, getCart, createCart, addItems, updateItems, removeItems, checkoutUrl. `Product` retains exact variant IDs, availability, descriptions, image URLs, option values, and money. Cart totals come from provider responses.

- [ ] Write tests for real documented product mapping, malformed quantities, variant eligibility, bundle completeness, trusted checkout origins, and provider failures.
- [ ] Run `npm test`; expected failing assertions for missing behavior.
- [ ] Implement the contract and Fourthwall adapter using official endpoint schemas, plus safe server configuration.
- [ ] Run `npm test` and `npm run typecheck`; expected all passing.
- [ ] Commit the integration and setup.

### Task 2: Branded site and shopping flows

**Files:** app/{layout,page,globals}.tsx/css, app/shop/page.tsx, app/product/[slug]/page.tsx, app/{about,contact,faq}/page.tsx, components/{header,footer,product-card,product-selector,cart,shop-browser}.tsx, lib/content.ts, public/brand/*.

**Interfaces:** Consume Task 1 products through the adapter; a cart context exposes busy/error/current cart, add, update, remove, refresh. Persist only the provider cart ID, with safe recovery.

- [ ] Write failing tests for safe persisted-cart parsing and variant/bundle selection rules; expected failures before implementation.
- [ ] Implement the approved pages, responsive brand design, accessible navigation, real variant selection, filtered catalog, gallery, persistent cart, provider totals and checkout handoff. Clearly label unavailable catalog entries and unconfigured services.
- [ ] Verify cart loading, stale storage, API errors, quantity updates/removal, and product option changes with tests; expected all passing.
- [ ] Verify production compilation with `npm run build`; expected successful build.
- [ ] Commit the storefront.

### Task 3: Live setup, visual review, repository handoff

**Files:** README.md, .env.example, .gitignore, Dockerfile, docs/{launch,dropshipping-migration}.md, DESIGN.md, .impeccable/design.json.

**Interfaces:** Task 1 adapter and Task 2 routes; configured Fourthwall catalog and checkout when sellable products are available.

- [ ] Verify token connectivity without exposing or committing credentials; inspect real catalog and launch dependencies.
- [ ] Run production preview and inspect desktop/mobile, keyboard navigation, empty states, product/gallery/cart flows and checkout where available.
- [ ] Run one mechanical design scan and an independent design/code review, resolve material findings, then rerun affected checks.
- [ ] Document configuration, support path, actual launch dependencies, deployment, and later supplier migration; persist the final design system.
- [ ] Create and push the new private `oak-outpost-storefront` GitHub repo, verify remote commit and privacy, and present the preview and evidence. Do not equate source push with live commerce or deployment.
