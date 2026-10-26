"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  LockKeyhole,
  Minus,
  Plus,
  LoaderCircle,
  Truck,
} from "lucide-react";
import type { Product, Variant } from "@/lib/commerce/types";
import { bundlePrice, money, shortName } from "@/lib/commerce/validation";
import { useCart } from "./cart";
function VariantPicker({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: string;
  onChange: (id: string) => void;
}) {
  const initial =
    product.variants.find((v) => v.available) ?? product.variants[0];
  const [color, setColor] = useState(initial?.color ?? "");
  const selected = product.variants.find((v) => v.id === value);
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.color, v.swatch])).entries(),
  );
  const colorVariants = product.variants.filter((v) => v.color === color);
  const sizes = Array.from(new Set(colorVariants.map((v) => v.size)));
  function pickColor(next: string) {
    setColor(next);
    const eligible = product.variants.find(
      (v) => v.color === next && v.size === selected?.size && v.available,
    );
    const only = product.variants.filter((v) => v.color === next);
    onChange(
      eligible?.id ??
        (only.length === 1 && only[0].available ? only[0].id : ""),
    );
  }
  return (
    <fieldset className="variant-picker">
      <legend className={product.type === "BUNDLE" ? "" : "sr-only"}>
        {shortName(product.name)}
      </legend>
      {!!colors.some(([name]) => name) && (
        <div className="color-picker">
          <p>
            Color <strong>{color}</strong>
          </p>
          <div className="swatches">
            {colors.map(([name, swatch]) => (
              <button
                key={name}
                type="button"
                className={color === name ? "swatch selected" : "swatch"}
                aria-label={`Choose ${name} for ${shortName(product.name)}`}
                aria-pressed={color === name}
                onClick={() => pickColor(name)}
              >
                <span
                  style={{
                    backgroundColor: /^#[0-9a-f]{3,8}$/i.test(swatch)
                      ? swatch
                      : "#a8a18f",
                  }}
                />
                {color === name && <Check size={15} />}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="size-heading">
        <p>
          Size <strong>{selected?.size ?? "Choose your size"}</strong>
        </p>
      </div>
      <div className="size-options">
        {sizes.map((size) => {
          const v = colorVariants.find((v) => v.size === size);
          return (
            <button
              type="button"
              key={size}
              disabled={!v?.available}
              aria-pressed={selected?.id === v?.id}
              className={selected?.id === v?.id ? "selected" : ""}
              onClick={() => onChange(v!.id)}
            >
              {size || "Standard"}
              {!v?.available && <span className="sr-only"> — unavailable</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
export function ProductSelector({ product }: { product: Product }) {
  const { mutate, busy } = useCart();
  const offers = product.type === "BUNDLE" ? product.offers : [product];
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      offers.map((p) => [
        p.id,
        p.variants.length === 1 && p.variants[0].available
          ? p.variants[0].id
          : "",
      ]),
    ),
  );
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const ids = offers.map((p) => selection[p.id] ?? "");
  const ready = ids.every(Boolean) && product.available;
  const price = ready ? bundlePrice(product, ids) : product.price;
  const selectedVariant: Variant | undefined = product.variants.find(
    (v) => v.id === ids[0],
  );
  useEffect(() => {
    if (selectedVariant?.image) setActiveImage(selectedVariant.image);
  }, [selectedVariant?.id, selectedVariant?.image]);
  async function add() {
    if (!ready) {
      setFeedback(
        "Choose a size and color for each item before adding it to your bag.",
      );
      return;
    }
    setFeedback("");
    await mutate({
      action: "add",
      slug: product.slug,
      variantIds: ids,
      quantity,
    });
  }
  return (
    <div className="product-detail">
      <div className="product-gallery">
        <div className="product-main-image">
          {activeImage && (
            <img
              src={activeImage.url}
              alt={activeImage.alt}
              width={800}
              height={1000}
              fetchPriority="high"
            />
          )}
        </div>
        <div className="product-thumbnails">
          {product.images.map((image, i) => (
            <button
              key={image.url}
              className={activeImage?.url === image.url ? "active" : ""}
              aria-label={`View product image ${i + 1}`}
              aria-pressed={activeImage?.url === image.url}
              onClick={() => setActiveImage(image)}
            >
              <img
                src={image.url}
                alt=""
                width={80}
                height={100}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="product-purchase">
        <Link className="breadcrumb" href="/shop">
          The collection / {product.category}
        </Link>
        <h1>{shortName(product.name)}</h1>
        <div className="product-price">
          {!ready &&
          product.type !== "BUNDLE" &&
          product.variants.some((v) => v.price.value !== price?.value)
            ? "From "
            : ""}
          {money(price)}
        </div>
        <p className="product-intro">{product.description.split("\n\n")[0]}</p>
        {product.type === "BUNDLE" && (
          <p className="bundle-note">
            One good set. Choose your favorites for every item below.
          </p>
        )}
        <div className="product-options">
          {offers.map((p) => (
            <div key={p.id}>
              {product.type === "BUNDLE" && (
                <h2 className="bundle-product-name">{shortName(p.name)}</h2>
              )}
              <VariantPicker
                product={p}
                value={selection[p.id]}
                onChange={(id) => {
                  setSelection((s) => ({ ...s, [p.id]: id }));
                  setFeedback("");
                }}
              />
            </div>
          ))}
        </div>
        <div className="add-row">
          <div className="quantity-control">
            <button
              aria-label="Decrease product quantity"
              disabled={quantity <= 1 || busy}
              onClick={() => setQuantity((q) => q - 1)}
            >
              <Minus size={15} />
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              aria-label="Increase product quantity"
              disabled={quantity >= 1000 || busy}
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus size={15} />
            </button>
          </div>
          <button
            className="button"
            disabled={busy || !product.available}
            onClick={() => void add()}
          >
            {busy ? (
              <>
                <LoaderCircle className="spin" size={18} /> Adding…
              </>
            ) : product.available ? (
              <>
                Add to bag <ArrowRight size={18} />
              </>
            ) : (
              "Currently unavailable"
            )}
          </button>
        </div>
        <p className="selection-feedback" role="status">
          {feedback ||
            (!ready && product.available
              ? "Choose your options to make it yours."
              : "")}
        </p>
        <div className="purchase-notes">
          <span>
            <Truck size={17} /> Shipping estimates at checkout
          </span>
          <span>
            <LockKeyhole size={16} /> Secure payment with Fourthwall
          </span>
        </div>
        <div className="product-accordions">
          <details open>
            <summary>
              The whole story <ChevronDown size={16} />
            </summary>
            <div className="plain-copy">{product.description}</div>
          </details>
          {product.details.map((d) => (
            <details key={d.title}>
              <summary>
                {d.title}
                <ChevronDown size={16} />
              </summary>
              <div className="plain-copy">{d.body}</div>
            </details>
          ))}
          <details>
            <summary>
              Shipping & support
              <ChevronDown size={16} />
            </summary>
            <p>
              Delivery options and estimates are shown at checkout. Tracking is
              sent when available after your order ships. Need a hand?{" "}
              <Link href="/contact">Get in touch</Link>.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
