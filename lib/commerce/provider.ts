import { FourthwallProvider } from "./fourthwall";
import type { CommerceProvider } from "./types";
export function getProvider(): CommerceProvider {
  return new FourthwallProvider({
    token: process.env.FOURTHWALL_STOREFRONT_TOKEN ?? "",
    domain:
      process.env.FOURTHWALL_SHOP_DOMAIN ??
      "oak-outpost-llc-shop.fourthwall.com",
  });
}
