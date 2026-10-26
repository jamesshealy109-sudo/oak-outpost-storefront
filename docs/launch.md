# Deploying the standalone storefront

## Required configuration

- `FOURTHWALL_STOREFRONT_TOKEN`: catalog token from Settings → For developers → Storefront API. The token also authorizes anonymous cart operations. Keep it outside Git.
- `FOURTHWALL_SHOP_DOMAIN`: `oak-outpost-llc-shop.fourthwall.com`, or a verified future Fourthwall checkout domain.
- `NEXT_PUBLIC_SITE_URL`: the actual HTTPS origin of this standalone site, for metadata. Set it during build and at runtime.

The application supports a Next.js Node server and a Vinext Cloudflare Worker build. Public hosting is configured in `.openai/hosting.json` for `https://oak-outpost-storefront.strataworks-0552.chatgpt.site`; runtime configuration is held in Sites rather than Git.

## Public hosting

`npm run build:site` produces the Sites Worker through the supplied `sites()` integration. Use the Sites source workflow to push the exact source commit, package `dist`, save the returned version, and deploy it. Keep source write credentials in process memory and stdin only. Preserve public access for this customer preview. Check deployment status and the hosted catalog/cart after publishing.

`npm run build` validates both deployment targets. Both frameworks generate route declarations under `.next`, so `npm run typecheck` first regenerates the Next declarations before checking them. Generated framework declarations and caches are ignored.

## Node deployment

On the chosen host, set the environment, install dependencies with `npm ci`, run `npm run build:node`, then run `npm start` under a service manager. Terminate HTTPS at a reverse proxy and forward to port 3100. Preserve the original `Host` header; the cart and form endpoints validate browser Origin against that host. Do not expose a development server publicly.

## Container deployment

```sh
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN.example -t oak-outpost-storefront .
docker run -d --restart unless-stopped --name oak-outpost-storefront \
  --env-file /secure/path/oak-outpost.env \
  -p 127.0.0.1:3100:3100 oak-outpost-storefront
```

Replace the example hostname and environment-file path with real values. The Docker build intentionally receives no Fourthwall token. Home and product data are fetched at runtime. The Dockerfile was prepared but requires a Docker-capable host to build and run.

## Optional forms

Contact uses the existing Fourthwall support form by default. For an on-site form, configure `RESEND_API_KEY`, a verified `CONTACT_FROM_EMAIL`, and the actual `CONTACT_TO_EMAIL`; confirm delivery to the destination before announcing it as working.

For the on-site newsletter, set `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`, and `MAILCHIMP_SERVER_PREFIX` (for example `us21`). New entries use pending status so Mailchimp sends its double opt-in confirmation. Check the confirmation and a completed opt-in before claiming subscriber capture is verified.

The optional form routes include input validation and a small per-process throttle. A production edge/proxy should also rate-limit these public endpoints. Do not submit live test messages or enroll customers without authorization.

## Before public launch

1. Confirm HTTPS, the production origin, and the provider token in the chosen environment.
2. Confirm all intended products and the Fourthwall shop itself are public/live, with approved prices.
3. Review the current Clay-color availability discrepancy described in the README.
4. Verify a regular product and the Fall Essentials Bundle through the final checkout summary, including quantities, options, subtotal, tax/shipping display, and return navigation.
5. Choose an actual public storefront destination for Fourthwall's External Store URL setting so checkout navigation returns to this website. This setting was not pointed to localhost.
6. Check contact/support, policies, and any configured newsletter flow. No social profiles are invented.
7. Use a separately authorized paid test order if the owner wants payment, receipt, fulfillment, and tracking verified end to end.
