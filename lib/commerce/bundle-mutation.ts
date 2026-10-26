import type { Cart, CartItemInput } from "./types";
import { validateQuantity } from "./validation";
export function replacementGroups(
  cart: Cart,
  lineId: string,
  quantity: number | null,
): CartItemInput[][] {
  if (!cart.lines.some((line) => line.id === lineId))
    throw new Error("This item has changed. Please refresh your bag.");
  if (quantity !== null) validateQuantity(quantity);
  return cart.lines
    .filter((line) => !(line.id === lineId && quantity === null))
    .map((line) =>
      line.items.map((item) => ({
        variantId: item.variantId,
        quantity: line.id === lineId ? quantity! : item.quantity,
        ...(item.bundleId ? { bundleId: item.bundleId } : {}),
      })),
    );
}
