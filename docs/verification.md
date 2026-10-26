# Verification record — October 26, 2026

## Confirmed during this build

- New private GitHub repository created under `jamesshealy109-sudo/oak-outpost-storefront`.
- Fourthwall Storefront API token created after the user completed account verification; local configuration is ignored by Git.
- Live API supplies 16 products after the user published the catalog.
- Fourthwall shop changed from Coming soon to Live after explicit user authorization; dashboard confirms Live.
- Product mapping, exact variant IDs, sold-out stock, limited `inStock` handling, quantity validation, invalid selection, complete bundle selection, bundle price calculation, text-only descriptions, checkout URL validation, safe persisted-cart IDs, provider failures, form input validation, and request-origin validation were tested.
- Real provider cart creation, quantity updates, and removal tested for a regular product.
- Real Fall Essentials Bundle created with an available non-Clay color, quantity changed to 2 with subtotal $155.94, and removed. No order placed.
- A first-variant audit passed for 14 of 15 individual products. Clay S/M in the Signature Oak Premium Long Sleeve Tee was rejected by Fourthwall despite unlimited stock in catalog data. Butter, Cypress, and Black S/M were accepted.
- The browser loaded the real product page, selected Black/M for the Signature Oak Graphic Tee, added it, changed quantity to 2, retained the bag after reload, and reached Fourthwall checkout showing that exact variant and a $57.98 subtotal for 2 items. No shipping/payment fields were submitted and no order was placed.
- Home and product layouts inspected at desktop and 390 px mobile widths; mobile document width equaled viewport width with no missing images in the inspected state.
- Production build and TypeScript check passed during implementation; final review results and final checks are recorded below when complete.

## Limits

This is checkout handoff verification, not a paid purchase or fulfillment test. Optional Resend and Mailchimp credentials are not configured or delivery-tested. The Dockerfile is prepared, not executed. The standalone frontend is locally previewed, not yet deployed to a public domain. The existing Fourthwall shop being Live is a separate state from frontend deployment.
