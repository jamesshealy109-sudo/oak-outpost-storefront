# Oak & Outpost standalone storefront

Status: approved by the user on October 26, 2026, with remaining design decisions delegated to the builder. The user subsequently authorized a public preview and switching Fourthwall to Live.

## Intent

Replace the sparse existing Fourthwall storefront with a substantially better standalone Oak & Outpost website and a functional shop. The user confirmed that Fourthwall will fulfill orders for the first few months, followed by a move to dropshipping. Preserve the brand, its actual merchandise, and the supplied website copy and artwork.

## Approaches

1. Custom standalone storefront using Fourthwall's Storefront API. The website owns presentation, navigation, product discovery, product pages, and cart. Fourthwall owns the hosted checkout, payment collection, tax and shipping calculations, order confirmation, and fulfillment. This is the recommended approach and matches the user's initial Fourthwall period.
2. Independent commerce and fulfillment system immediately. This would require selecting and connecting payment and dropshipping services now. Deferred because the user specified Fourthwall for the first few months.
3. Redesigned marketing site with links or embedded Fourthwall pages. Less integration work, but it would leave most of the shop experience in the existing theme and would not satisfy the requested improvement as well.

## Product and brand truth

Oak & Outpost LLC sells Southern lifestyle and outdoor apparel. Tagline: “Made for the Long Way Home.” The supplied brief specifies forest green, cream, tan, burnt orange, and a rustic, outdoorsy, vintage, clean character. Existing logos and artwork are available in the workspace. Use the actual product photography, options, descriptions, and prices where they are configured; do not invent reviews, sales figures, discounts, delivery guarantees, or purchasable products.

The dashboard reports 16 products. The ten catalog entries inspected are Private. The hoodie detail says private products are purchasable by admins only and do not have a selling price. The public All Products page is empty. These are launch dependencies, not reasons to fabricate a catalog or change statuses and prices without a concrete review.

## Proposed experience

- Home: prominent Oak & Outpost identity, the long-way-home message, compelling outdoor and real product imagery, a direct Shop the Collection action, featured merchandise, and a short brand story. Use strong typography, spacious product photography, and restrained rustic detail.
- Shop: responsive grid, search, available product categories, size and color filters derived from actual catalog data, sort, and clear empty and failure states.
- Product: image gallery, verified description, current price, variant and quantity selection, availability, size information where supplied, and add-to-cart feedback. Distinguish unavailable variants and price changes before checkout.
- Cart: persistent cart identifier, exact variant names, quantity updates, removal, current API totals, and checkout. Shipping and tax are finalized by Fourthwall; do not advertise an invented final total or delivery date.
- About: the supplied “Rooted in the South. Made for the Outdoors.” story.
- Contact and FAQ: working support path and the supplied factual FAQ. Contact submission and newsletter enrollment must use real configured destinations; do not show a success message without acceptance by the relevant service.
- Owner administration: use the existing Fourthwall admin for merchandise, orders, payments, fulfillment, and shipping during phase one. No duplicate customer database or pretend admin dashboard. The separate website content remains in the repository initially; a browser content editor is a separate capability if required.

## Architecture and ownership

Proposed builder choice: Next.js with TypeScript, responsive CSS, server-rendered product pages, and a small commerce adapter. This is a proposal, not an agreed stack. It provides useful product search visibility and a straightforward server runtime for service integrations.

Create a new private repository, proposed name `oak-outpost-storefront`, under the authenticated GitHub owner `jamesshealy109-sudo`. Keep original customer source files outside the application checkout. Include deployment instructions and an environment example; exclude credentials and customer/order data from commits.

UI components consume normalized product, variant, price, image, and cart types through a Fourthwall adapter. Preserve the provider's exact variant IDs and money semantics. Provider-specific checkout URLs and cart operations stay in the adapter. A later dropshipping provider will need its own implementation, payment and fulfillment configuration, and migration testing; this build creates that boundary, not an unconfigured future integration.

## Launch dependencies and safeguards

Retrieve or configure a Storefront API token through the authorized store account, with any required account verification performed by the user. Keep configuration outside Git. The API exposes published products, so the owner must settle sellable products, retail prices, and publication readiness before live checkout can be verified. Inspect current settings before proposing any changes.

Hosting destination, production domain, support destination, newsletter provider, official social links, and the eventual dropshipping supplier are currently undecided. Complete the build and a local preview without inventing those values. Deploy when a supported destination is available within the user's authorization; report any remaining concrete dependency separately from completed work.

## Acceptance evidence

Verify the production build and meaningful commerce behavior: catalog mapping, valid and invalid variants, quantity updates and removal, cart persistence, provider errors, price and availability refresh, and checkout URL construction. Inspect desktop and mobile layouts, keyboard interaction, focus behavior, images, and overflow. Test a real Fourthwall cart and reach its correct checkout with matching variants and totals when sellable products and configuration permit it. Do not place a paid order.

The handoff must distinguish repository creation and push, local preview, deployment, live catalog connectivity, and checkout verification. A catalog mockup or an unconfigured adapter does not count as a functional live shop.
