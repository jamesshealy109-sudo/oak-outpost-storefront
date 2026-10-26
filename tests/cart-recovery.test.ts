import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import * as cartRoute from "../app/api/cart/route";
import { CommerceError, normalizeCart } from "../lib/commerce/fourthwall";

test("a cart with an unpublished bundle can be explicitly reset without changing the vendor cart", async () => {
  const id = "11111111-1111-4111-8111-111111111111";
  assert.throws(
    () => normalizeCart({
      id,
      items: [{
        quantity: 1,
        variant: {
          id: "tee-variant",
          name: "Green / M",
          unitPrice: { value: 29, currency: "USD" },
          product: { id: "tee", slug: "tee", name: "Tee" },
        },
        groupedBy: { type: "BUNDLE", bundleId: "unpublished-bundle", groupedId: "group-1" },
      }],
    }, [], "oak-outpost-llc-shop.fourthwall.com"),
    (error: unknown) => error instanceof CommerceError && error.code === "BUNDLE_CHANGED",
  );
  assert.equal(typeof cartRoute.DELETE, "function", "The shopper needs a reset operation even when the provider cart cannot be normalized");
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("Reset must not contact or mutate Fourthwall"); };
  try {
    const response = await cartRoute.DELETE(new NextRequest("https://shop.example/api/cart", {
      method: "DELETE",
      headers: { origin: "https://shop.example", host: "shop.example", cookie: `oo_cart=${id}` },
    }));
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).cart, null);
    assert.equal(response.cookies.get("oo_cart")?.value, "");
    assert.equal(response.cookies.get("oo_cart")?.path, "/");
    const expires = response.cookies.get("oo_cart")?.expires;
    assert.equal(expires instanceof Date ? expires.getTime() : expires, 0);
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("another origin cannot reset the shopper's saved cart", async () => {
  assert.equal(typeof cartRoute.DELETE, "function");
  const response = await cartRoute.DELETE(new NextRequest("https://shop.example/api/cart", {
    method: "DELETE",
    headers: { origin: "https://other.example", host: "shop.example" },
  }));
  assert.equal(response.status, 403);
  assert.equal(response.cookies.has("oo_cart"), false);
});
