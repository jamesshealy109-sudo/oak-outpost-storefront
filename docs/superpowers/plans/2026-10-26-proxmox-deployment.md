# Proxmox deployment implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task. This is deployment of the approved existing application; no design or commerce changes are required.

**Goal:** Run Oak & Outpost in a new container on the user's Proxmox development server at 10.10.10.2.

**Architecture:** Create a separate unprivileged Linux container using the host's existing storage, template, and bridge conventions. Run the immutable GitHub source as a standalone Node.js production service, with Fourthwall configuration outside the source tree. Reuse an established public reverse proxy route if available; otherwise finish LAN deployment and identify the exact missing public routing requirement.

**Tech stack:** Proxmox LXC, supported Debian/Ubuntu template, Node.js 22, systemd, Next.js standalone output.

**Spec:** User authorization in this conversation: use prox (local development server), create a new container, deploy and run the shop there. Existing app specification: ../specs/2026-10-26-oak-outpost-storefront-design.md.

## Constraints

- Preserve existing containers, VMs, network, and application settings.
- Select an unused container ID after reading current inventory; do not clone a customer workload.
- Prefer 2 vCPU, 2 GiB RAM, 1 GiB swap, 12 GiB disk if host capacity permits.
- Root account in the new container may remain locked; manage through Proxmox rather than create unnecessary login credentials.
- Deploy source commit a03e84d6e4ce0b521c6d32dfbf74ceb081f91931, or an explicitly recorded later revision for deployment documentation only.
- Fourthwall remains responsible for payment and fulfillment. Do not place an order.
- Keep environment credentials outside Git, terminal output, and deployment logs.
- Report local availability separately from public reachability.

## Review focus

- Wrong host/container: confirm hostname, node and inventory before creating anything.
- Resource/storage contention: check available memory and storage first.
- Linux runtime compatibility: build inside the new Linux container, not on Windows.
- Reverse proxy compatibility: preserve Host for request Origin validation.
- Startup and configuration: verify actual service restart, catalog and cart against the deployed address.

## Task 1: Deploy and verify the isolated service

- [x] Read host version, node, guest inventory, storage, templates, bridge/network, resource capacity and existing public proxy conventions through the authenticated session.
- [x] Record the chosen new container ID and network settings; create and boot that container only.
- [x] Install official Node.js 22 and required OS packages; clone the public repo at the recorded immutable revision.
- [x] Install dependencies, run regression tests and the Node production build inside Linux.
- [x] Stage standalone output with static/public assets; configure Fourthwall and site origin in a protected environment file; start an unprivileged systemd service with restart enabled.
- [x] Verify HTTP home, live product links (now 17), product page, persisted cart, quantity updates, removal and Fourthwall checkout handoff. Restart service and verify it recovers.
- [x] Configure and verify the user-selected HTTPS origin https://oakoutfit.strataworks.tech.
- [x] Record container ID, address, deployed SHA, service location, restart/update commands and verification limits in docs/launch.md and docs/verification.md. Commit deployment documentation to GitHub without credentials.
