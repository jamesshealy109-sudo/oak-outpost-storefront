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
- Final Next.js and Vinext production builds passed; TypeScript passed; all 18 regression tests passed. Runtime dependency audit reports zero vulnerabilities; development-tool transitive advisories remain.
- Independent code review found and resolved saved-cart recovery when a bundle is unpublished or changed. Reset is explicit, checks Origin, and clears only the browser cookie. The provider cart is left intact.
- Design review accepted the visual direction and requested larger mobile product captions. Names are now 14 px and prices 13 px. DESIGN.md and its machine-readable sidecar describe the finished system.
- Sites public deployment succeeded at https://oak-outpost-storefront.strataworks-0552.chatgpt.site from source commit `8c57fd962dfbbaddb8a3c39e39d0e7b639a583d5` (version 1). The anonymous home and shop returned HTTP 200; the shop exposed all 16 product links.
- Hosted HTTP integration verification passed regular and bundle add, persisted cookie, quantity updates, checkout URL response, removal, reset, and foreign-Origin rejection. Regular hoodie quantity 2 subtotal was $69.98; bundle quantity 2 subtotal was $155.94. No order was placed.
- GitHub main was pushed. The initial CI run exposed an npm 10 optional-peer lockfile incompatibility; regenerating with npm 10 made clean-install validation pass. Follow-up CI status is available in GitHub Actions.

## Limits of the initial publication

This is checkout handoff verification, not a paid purchase or fulfillment test. Optional Resend and Mailchimp credentials are not configured or delivery-tested. The Dockerfile is prepared, not executed. Browser control stopped responding before the final hosted screenshot pass; the hosted commerce checks above use real HTTP requests. Existing desktop/mobile browser captures and the local checkout summary predate the final mobile caption enlargement, whose wrapping still needs fresh visual confirmation. Fourthwall's External Store URL has not been changed to the new frontend; checkout return navigation may still lead to its original storefront.

## Proxmox deployment — October 26, 2026

This is the current primary deployment; the earlier Sites publication above is historical.

- New unprivileged Debian 12 LXC `105` created on `prox`; existing guests were preserved. Source commit `a03e84d6e4ce0b521c6d32dfbf74ceb081f91931` was checked out and built inside Linux using verified official Node.js `22.23.4`.
- All 18 tests, TypeScript, and the Next.js production build passed in the new container. Systemd service runs as the dedicated non-login user, is enabled at boot, and recovered after an actual service restart. Guest systemd reports `running` with no failed units after enabling nesting.
- Service environment is root-owned mode `600`; application cache is owned by the service user. Source, runtime release and update commands are recorded in launch.md.
- User chose `oakoutfit.strataworks.tech` and completed the DNS record. Nginx Proxy Manager host ID `2` routes it to the new container. Let's Encrypt certificate ID `3` is valid through January 24, 2027. HTTPS validation passed both through public DNS and directly against the origin with the correct hostname; HTTP returned a 301 redirect to HTTPS.
- Public home and shop returned HTTP 200. The live provider catalog now contains 17 products, including a newly published branded tee.
- Real HTTPS API checks passed regular and bundle add/persist/update/checkout/remove, explicit reset, secure HttpOnly cookie attributes, and foreign-Origin rejection. No order was placed.
- In the in-app browser, Black/M Signature Oak Graphic Tee was added, quantity changed to 2, persisted across reload, and handed to Fourthwall checkout showing that exact variant and a $57.98 subtotal. No contact, shipping or payment information was entered. The test bag was cleared afterward.
- Fresh desktop/mobile captures verified the deployed layout and 14 px/13 px mobile product captions, with no horizontal overflow in the inspected mobile states. Images were loaded before final captures. The independent finish reviewer resolved the prior caption and capture findings and returned `ship`.
- Before editing the proxy, a protected database backup was created. The full existing storage proxy row was compared afterward and was identical. Existing containers remained running. Temporary root SSH access was removed; a new connection with that key was rejected, and its local key files were removed.

Remaining limits: payment and fulfillment were not purchased/tested; optional email integrations are unconfigured; Fourthwall checkout return navigation still uses its existing store setting. Reserve the container's current DHCP address for long-term upstream stability. Chrome extension control was unavailable, so GoDaddy DNS was completed by the user and frontend browser verification used the in-app browser.
