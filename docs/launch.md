# Deploying the standalone storefront

## Required configuration

- `FOURTHWALL_STOREFRONT_TOKEN`: catalog token from Settings → For developers → Storefront API. The token also authorizes anonymous cart operations. Keep it outside Git.
- `FOURTHWALL_SHOP_DOMAIN`: `oak-outpost-llc-shop.fourthwall.com`, or a verified future Fourthwall checkout domain.
- `NEXT_PUBLIC_SITE_URL`: the actual HTTPS origin of this standalone site, for metadata. Set it during build and at runtime.

The primary deployment is https://oakoutfit.com on the owner's Proxmox server; https://www.oakoutfit.com serves the same storefront. The application supports a Next.js Node server and an optional Vinext Worker build. Runtime configuration is outside Git.

## Current Proxmox deployment

- Node `prox`, new unprivileged Debian 12 container `105` (`oak-outpost`); 2 vCPU, 2 GiB RAM, 1 GiB swap, 12 GiB disk. Nesting is enabled for systemd compatibility.
- Current container address: `10.10.10.48`, MAC `BC:24:11:A3:D9:47`, DHCP on `vmbr0`. Reserve that lease on the router before relying on the address long term; the reverse proxy uses this address.
- Node.js `22.23.4`, installed from the official Linux archive after SHA-256 verification.
- Application source: `a03e84d6e4ce0b521c6d32dfbf74ceb081f91931`. The production build uses `NEXT_PUBLIC_SITE_URL=https://oakoutfit.com`.
- Runtime release: `/opt/oak-outpost/releases/a03e84d6e4ce0b521c6d32dfbf74ceb081f91931-oakoutfit-com-20261027`; `/opt/oak-outpost/current` selects the active release. Earlier releases remain available for rollback. The prior environment is protected at `/etc/oak-outpost/backups/before-customer-domain-20261027.env`.
- Source checkout: `/opt/oak-outpost/source`, owned by the non-login `oak-outpost` user. Production release files are root-owned; `.next/cache` is writable by the service user.
- Systemd service `oak-outpost.service` runs the standalone `server.js` as `oak-outpost`, listens on port `3100`, restarts on failure, and is enabled at boot. The container is also enabled at host boot.
- Environment: `/etc/oak-outpost/storefront.env`, root-owned mode `600`. Do not print it into logs or copy it into Git.
- Existing Nginx Proxy Manager in container `102`: proxy host ID `3`, `oakoutfit.com` and `www.oakoutfit.com` → `http://10.10.10.48:3100`; Let's Encrypt certificate ID `4`, valid through January 25, 2027. HTTP redirects to HTTPS. DNS is A `@` → `75.176.194.21` and CNAME `www` → `oakoutfit.com`. Google Workspace mail records remain separate.
- The earlier proxy host ID `2` and certificate ID `3` remain configured, but the Cloudflare DNS record for `oakoutfit.strataworks.tech` was deleted at the owner's request on October 27, 2026. Use the customer domain above.
- Before-change proxy database backups: `/opt/npm/data/backups/before-oak-outpost-20261026.sqlite` and `/opt/npm/data/backups/before-oak-customer-domain-20261027.sqlite` in container `102`. Existing storage and earlier Oak proxy entries were compared in full and remained identical during customer-domain setup.
- Temporary deployment SSH access was removed and a fresh authentication attempt was rejected. No deployment SSH credential remains in the repository or on this development PC.

Run these from the authenticated Proxmox node shell:

```sh
pct status 105
pct exec 105 -- systemctl status oak-outpost --no-pager
pct exec 105 -- journalctl -u oak-outpost -n 60 --no-pager
pct exec 105 -- systemctl restart oak-outpost
curl -fsS https://oakoutfit.com/api/cart
```

For updates, select and verify an immutable Git commit, build as the application user with the public site origin, stage a new release with its static/public assets, switch `current`, restart, and repeat the live catalog/cart/checkout checks. Keep the prior release until the new one passes. Reverting code also requires restoring any changed runtime environment values; never restore the entire shared proxy database just to revert this site.

The bootstrap helper in `deploy/proxmox/install.sh` is for a fresh Linux container with its protected environment file already staged. It deliberately refuses an existing `/opt/oak-outpost`; it is not an in-place upgrade script.

## Optional Worker hosting

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
