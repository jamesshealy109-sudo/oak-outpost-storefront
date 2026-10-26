#!/usr/bin/env bash
set -Eeuo pipefail
export DEBIAN_FRONTEND=noninteractive
release_sha=${1:?source SHA required}
site_origin=${2:?HTTPS public origin required}
[[ "$release_sha" =~ ^[0-9a-f]{40}$ ]] || exit 64
[[ "$site_origin" =~ ^https://[a-zA-Z0-9.-]+(:[0-9]+)?$ ]] || exit 64
[[ $(id -u) == 0 ]] || exit 77
[[ $(uname -m) == x86_64 ]] || { echo 'Expected x86_64 container'; exit 1; }
[[ ! -e /opt/oak-outpost ]] || { echo 'Fresh container required'; exit 1; }

apt-get update
apt-get install -y --no-install-recommends ca-certificates curl git xz-utils python3
work_dir=$(mktemp -d)
trap 'rm -f "$work_dir/node.tar.xz"; rmdir "$work_dir" 2>/dev/null || true' EXIT
curl --fail --show-error --silent --location --proto '=https' --tlsv1.2 \
  https://nodejs.org/dist/v22.23.4/node-v22.23.4-linux-x64.tar.xz -o "$work_dir/node.tar.xz"
printf '%s  %s\n' '1805bcd35e6815559bd2eb97db438d3fdb0eb3a5e6a977b7c1badca76337e9ce' "$work_dir/node.tar.xz" | sha256sum --check -
tar -xJf "$work_dir/node.tar.xz" -C /opt
export PATH=/opt/node-v22.23.4-linux-x64/bin:$PATH
node --version
npm --version

useradd --system --user-group --create-home --home-dir /var/lib/oak-outpost --shell /usr/sbin/nologin oak-outpost
install -d -m 755 /opt/oak-outpost /opt/oak-outpost/releases
git clone --no-checkout https://github.com/jamesshealy109-sudo/oak-outpost-storefront.git /opt/oak-outpost/source
git -C /opt/oak-outpost/source checkout --detach "$release_sha"
[[ $(git -C /opt/oak-outpost/source rev-parse HEAD) == "$release_sha" ]]
chown -R oak-outpost:oak-outpost /opt/oak-outpost/source
runuser -u oak-outpost -- env PATH="$PATH" NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL="$site_origin" \
  bash -c 'set -e; cd /opt/oak-outpost/source; npm ci --no-fund; npm test; npm run typecheck; npm run build:node'

release_dir=/opt/oak-outpost/releases/$release_sha
install -d -m 755 "$release_dir"
cp -a /opt/oak-outpost/source/.next/standalone/. "$release_dir/"
cp -a /opt/oak-outpost/source/.next/static "$release_dir/.next/static"
cp -a /opt/oak-outpost/source/public "$release_dir/public"
chown -R root:root "$release_dir"
install -d -o oak-outpost -g oak-outpost -m 750 "$release_dir/.next/cache"
ln -s "$release_dir" /opt/oak-outpost/current
install -d -m 700 /etc/oak-outpost
[[ -s /etc/oak-outpost/storefront.env ]] || { echo 'Protected runtime environment must be staged before service start'; exit 1; }
chmod 600 /etc/oak-outpost/storefront.env
cat >/etc/systemd/system/oak-outpost.service <<'SERVICE'
[Unit]
Description=Oak and Outpost standalone storefront
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=oak-outpost
Group=oak-outpost
WorkingDirectory=/opt/oak-outpost/current
Environment=NODE_ENV=production
Environment=NEXT_TELEMETRY_DISABLED=1
Environment=PORT=3100
Environment=HOSTNAME=0.0.0.0
EnvironmentFile=/etc/oak-outpost/storefront.env
ExecStart=/opt/node-v22.23.4-linux-x64/bin/node server.js
Restart=always
RestartSec=5
TimeoutStopSec=30
UMask=0027
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
SERVICE
systemctl daemon-reload
systemctl enable --now oak-outpost.service
for attempt in $(seq 1 30); do
  if curl --fail --silent http://127.0.0.1:3100/ >/dev/null; then break; fi
  sleep 1
done
systemctl is-active oak-outpost.service
curl --fail --silent http://127.0.0.1:3100/api/cart
printf '\nDeployed source: %s\n' "$release_sha"
