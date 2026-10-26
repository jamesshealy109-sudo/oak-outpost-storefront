import test from "node:test";
import assert from "node:assert/strict";
import { replacementGroups } from "../lib/commerce/bundle-mutation";
import type { Cart } from "../lib/commerce/types";
const cart = {
  id: "old-cart",
  lines: [
    {
      id: "bundle-group-1",
      quantity: 1,
      items: [
        {
          variantId: "tee",
          quantity: 1,
          bundleId: "fall",
          groupedId: "bundle-group-1",
        },
        {
          variantId: "hat",
          quantity: 1,
          bundleId: "fall",
          groupedId: "bundle-group-1",
        },
      ],
    },
    {
      id: "regular",
      quantity: 3,
      items: [{ variantId: "ordinary-tee", quantity: 3 }],
    },
    {
      id: "bundle-group-2",
      quantity: 1,
      items: [
        {
          variantId: "tee",
          quantity: 1,
          bundleId: "fall",
          groupedId: "bundle-group-2",
        },
        {
          variantId: "hat",
          quantity: 1,
          bundleId: "fall",
          groupedId: "bundle-group-2",
        },
      ],
    },
  ],
} as Cart;
test("bundle quantity replacement preserves other groups and strips old group identifiers", () => {
  const groups = replacementGroups(cart, "bundle-group-1", 2);
  assert.equal(groups.length, 3);
  assert.equal(groups[0][0].quantity, 2);
  assert.equal(groups[1][0].quantity, 3);
  assert.equal(groups[2][0].quantity, 1);
  assert.equal("groupedId" in groups[0][0], false);
  assert.equal(cart.lines[0].items[0].quantity, 1);
});
test("bundle removal keeps all regular items and the other identical bundle instance", () => {
  const groups = replacementGroups(cart, "bundle-group-1", null);
  assert.equal(groups.length, 2);
  assert.equal(groups[0][0].variantId, "ordinary-tee");
  assert.equal(groups[1][0].variantId, "tee");
  assert.throws(() => replacementGroups(cart, "missing", null), /changed/i);
});
