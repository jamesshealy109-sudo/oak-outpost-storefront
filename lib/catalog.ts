import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getProvider } from "./commerce/provider";
import type { Product } from "./commerce/types";
const cachedProducts = unstable_cache(
  async () => getProvider().listProducts(true),
  ["oak-outpost-products"],
  { revalidate: 60 },
);
export const loadCatalog = cache(
  async (): Promise<{ products: Product[]; error: string | null }> => {
    try {
      return { products: await cachedProducts(), error: null };
    } catch {
      return {
        products: [],
        error:
          "The collection is taking a little longer to load. Please try again in a moment.",
      };
    }
  },
);
export function curated(products: Product[]): Product[] {
  const slugs = [
    "oak-outpost-signature-oak-graphic-tee",
    "oak-outpost-lowcountry-sunset-graphic-tee",
    "oak-outpost-vintage-heritage-washed-hat",
    "oak-outpost-signature-o-o-zip-up-hoodie",
  ];
  return [
    ...slugs
      .map((s) => products.find((p) => p.slug === s))
      .filter((p): p is Product => !!p),
    ...products.filter((p) => !slugs.includes(p.slug)),
  ].slice(0, 4);
}
