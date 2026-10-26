# Oak & Outpost

Standalone Southern lifestyle storefront built with Next.js and TypeScript. Fourthwall supplies the real product catalog, inventory, customer carts, payment checkout, print-on-demand production, shipping, and order administration during the initial phase. The presentation and source code are independent of the Fourthwall website theme.

Public site: https://oak-outpost-storefront.strataworks-0552.chatgpt.site

## Run locally

Node.js 22 or newer is required.

```powershell
npm ci
Copy-Item .env.example .env.local
# Set FOURTHWALL_STOREFRONT_TOKEN in .env.local.
npm run dev
```

Open http://127.0.0.1:3100. An ignored local configuration was prepared on the original development machine. No credentials are committed to this repository.

```powershell
npm test
npm run typecheck
npm run build
npm start
```

The standard production server listens on port 3100. A standalone Node image is also provided; see [deployment](docs/launch.md).

## What is implemented

- Custom responsive home, collection, product, about, FAQ, contact, and error pages.
- Live product descriptions, images, prices, stock, color and size choices.
- Search, categories, size/color filters, and price/name sorting.
- Validated product and multi-product bundle selection.
- A keyboard-accessible shopping bag with quantity changes, removal, provider cart persistence in an HttpOnly cookie, and current checkout handoff.
- Current provider-specific payment, tax, shipping, confirmation, and tracking remain on Fourthwall.
- A working link to the existing Fourthwall support form; optional first-party contact form through configured Resend.
- Optional Mailchimp double opt-in newsletter. Until configured, the site explains how to opt in during Fourthwall checkout rather than showing a nonfunctional signup form.
- Self-hosted licensed fonts, supplied brand artwork, and generated editorial landscape photography.

## Ownership and administration

Repository: `jamesshealy109-sudo/oak-outpost-storefront` (private). This repository is currently owned by the user's GitHub account; transfer it when the customer should own the source directly.

Use Fourthwall's authenticated owner dashboard for products, prices, sizes, colors, orders, refunds, production, shipping, and payment settings. Website copy is in `lib/content.ts` and the page components. A separate browser CMS was not included in the approved initial scope.

## Integration boundary

`lib/commerce/types.ts` is the provider-neutral product/cart contract. `lib/commerce/fourthwall.ts` implements it. `lib/commerce/provider.ts` selects the current provider. UI components do not construct Fourthwall cart requests or checkout URLs.

The catalog caches the normalized response for 60 seconds; add-to-cart and cart requests fetch current provider data. Large raw catalog responses are not placed in Next's 2 MB fetch cache. Bundled cart edits create a complete replacement provider cart, preserving the original until all selections are accepted, because the current Fourthwall quantity endpoint rejects bundle components. A cart is not an order and no payment occurs during this operation.

For a later dropshipping supplier, see [migration](docs/dropshipping-migration.md). It requires real supplier and payment integrations; replacing a name in a configuration file is insufficient.

## Verification and current limitations

See [verification](docs/verification.md) for the checks actually performed. The standalone frontend is publicly hosted through Sites, with a private GitHub source repository. The Fourthwall backend shop is Live. Payment submission and paid fulfillment have not been tested. A custom customer domain can be connected separately.

The provider currently rejects the Clay color of the Signature Oak Premium Long Sleeve Tee despite advertising it as available in the catalog. Butter, Cypress, and Black in tested sizes are accepted, including in the bundle. The storefront reports provider rejections and asks customers to choose another option; review that color in Fourthwall before promoting it.

## Assets

The customer supplied the oak, heron, and backroad artwork. The landscape is generated brand imagery, not a product photograph or a claim about a specific place. Product imagery is loaded from Fourthwall. Asset sources, the exact image-generation prompt, and font license files are recorded in [asset provenance](docs/assets.md) and `public/fonts/`.
