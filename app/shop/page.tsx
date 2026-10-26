import type { Metadata } from "next";
import Link from "next/link";
import { loadCatalog } from "@/lib/catalog";
import { ShopBrowser } from "@/components/shop-browser";
export const metadata: Metadata = {
  title: "Shop the collection",
  description:
    "Shop Oak & Outpost tees, long sleeves, layers, headwear, and Southern lifestyle goods.",
};
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { products, error } = await loadCatalog();
  const params = await searchParams;
  return (
    <div className="shop-page section">
      <div className="shop-title">
        <div>
          <h1>
            Good things.
            <br />
            <em>Great company.</em>
          </h1>
          <p>For the everyday, the outdoors, and every mile in between.</p>
        </div>
        <img src="/brand/oak-leaf.png" width={160} height={150} alt="" />
      </div>
      {error ? (
        <div className="catalog-message" role="alert">
          <p>{error}</p>
          <Link className="button" href="/shop">
            Try again
          </Link>
        </div>
      ) : (
        <ShopBrowser
          key={String(params.category ?? "") + String(params.search ?? "")}
          products={products}
          initialCategory={
            typeof params.category === "string" ? params.category : ""
          }
          focusSearch={params.search === "1"}
        />
      )}
    </div>
  );
}
