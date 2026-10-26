import type { CartItemInput, Money, Product } from "./types";
export function stripHtml(input: string = ""): string {
  return input
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/(p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}
export function validateQuantity(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 1000
  )
    throw new Error("Choose a quantity between 1 and 1,000.");
  return value;
}
export function validCartId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}
export function selectionItems(
  product: Product,
  ids: string[],
  quantity: number,
): CartItemInput[] {
  validateQuantity(quantity);
  if (!product.available)
    throw new Error(
      "This product is currently unavailable. Please choose another.",
    );
  const products = product.type === "BUNDLE" ? product.offers : [product];
  if (ids.length !== products.length || new Set(ids).size !== ids.length)
    throw new Error("Complete the selection for every product.");
  return products.map((p, i) => {
    const v = p.variants.find((v) => v.id === ids[i]);
    if (!v) throw new Error("Choose a valid selection for every product.");
    if (
      !p.available ||
      !v.available ||
      (v.stock !== null && v.stock < quantity)
    )
      throw new Error(
        "That size, color, or quantity is unavailable. Please choose another.",
      );
    return {
      variantId: v.id,
      quantity,
      ...(product.type === "BUNDLE" ? { bundleId: product.id } : {}),
    };
  });
}
export function bundlePrice(product: Product, ids: string[]): Money {
  if (product.type !== "BUNDLE")
    return (
      product.variants.find((v) => v.id === ids[0])?.price ??
      product.price ?? { value: 0, currency: "USD" }
    );
  const prices = product.offers.map(
    (p, i) => p.variants.find((v) => v.id === ids[i])?.price ?? p.price,
  );
  const sum = prices.reduce((total, price) => total + (price?.value ?? 0), 0);
  const strategy = product.pricingStrategy;
  const value =
    strategy?.type === "FIXED_PRICE"
      ? (strategy.price?.value ?? product.price?.value ?? sum)
      : strategy?.type === "DISCOUNT_BASED"
        ? sum * (1 - (strategy.discountPercentage ?? 0) / 100)
        : sum;
  return {
    value: Math.round((value + Number.EPSILON) * 100) / 100,
    currency: product.price?.currency ?? "USD",
  };
}
export function money(value: Money | null): string {
  return value
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: value.currency,
      }).format(value.value)
    : "Unavailable";
}
export function shortName(name: string): string {
  return name.replace(/^Oak & Outpost\s*/i, "");
}
