import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProvider } from "@/lib/commerce/provider";
import { ProductSelector } from "@/components/product-selector";
import { ProductCard } from "@/components/product-card";
import { loadCatalog } from "@/lib/catalog";
import { shortName } from "@/lib/commerce/validation";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await getProvider().getProduct(slug);
    return p
      ? {
          title: shortName(p.name),
          description: p.description.slice(0, 160),
          openGraph: { images: p.images.slice(0, 1).map((i) => i.url) },
        }
      : { title: "Product not found" };
  } catch {
    return { title: "The collection" };
  }
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProvider().getProduct(slug);
  if (!product) notFound();
  const { products } = await loadCatalog();
  const related = products
    .filter((p) => p.slug !== slug && p.type === "PRODUCT")
    .sort(
      (a, b) =>
        Number(b.category === product.category) -
        Number(a.category === product.category),
    )
    .slice(0, 4);
  return (
    <div className="section product-page">
      <ProductSelector key={product.id} product={product} />
      {!!related.length && (
        <section className="related-products">
          <div className="section-heading">
            <h2>Good company for the road.</h2>
            <Link className="underlined-link" href="/shop">
              All goods <ArrowRight size={17} />
            </Link>
          </div>
          <div className="product-grid">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
