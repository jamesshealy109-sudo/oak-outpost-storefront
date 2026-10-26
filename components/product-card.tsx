import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { money, shortName } from "@/lib/commerce/validation";
export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const colors = Array.from(
    new Map(
      product.variants.filter((v) => v.color).map((v) => [v.color, v.swatch]),
    ).entries(),
  );
  return (
    <article className="product-card">
      <Link
        className={`product-image product-tone-${index % 4}`}
        href={`/product/${product.slug}`}
        aria-label={`View ${shortName(product.name)}`}
      >
        {product.images[0] && (
          <img
            src={product.images[0].url}
            width={500}
            height={620}
            alt={product.name}
            loading="lazy"
          />
        )}
        <span className="product-image-action">
          <ArrowUpRight size={20} />
        </span>
        {product.type === "BUNDLE" && (
          <span className="product-tag">The whole set</span>
        )}
        {!product.available && (
          <span className="product-tag">Currently unavailable</span>
        )}
      </Link>
      <div className="product-card-info">
        <p className="product-category">{product.category}</p>
        <div className="product-name-price">
          <h3>
            <Link href={`/product/${product.slug}`}>
              {shortName(product.name)}
            </Link>
          </h3>
          <span className="price">
            {product.variants.some(
              (v) => v.price.value !== product.price?.value,
            )
              ? "From "
              : ""}
            {money(product.price)}
          </span>
        </div>
        {!!colors.length && (
          <div
            className="color-summary"
            aria-label={`Available in ${colors.length} colors`}
          >
            <span className="color-dots" aria-hidden="true">
              {colors.slice(0, 5).map(([name, color]) => (
                <span
                  key={name}
                  title={name}
                  style={{
                    backgroundColor: /^#[0-9a-f]{3,8}$/i.test(color)
                      ? color
                      : "#b4aa91",
                  }}
                />
              ))}
            </span>
            {colors.length > 5 && <span>+{colors.length - 5}</span>}
          </div>
        )}
      </div>
    </article>
  );
}
