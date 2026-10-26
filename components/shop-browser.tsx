"use client";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "./product-card";
export function ShopBrowser({
  products,
  initialCategory = "",
  focusSearch = false,
}: {
  products: Product[];
  initialCategory?: string;
  focusSearch?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState("featured");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focusSearch) input.current?.focus();
  }, [focusSearch]);
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const sizes = Array.from(
    new Set(
      products.flatMap((p) => p.variants.map((v) => v.size)).filter(Boolean),
    ),
  );
  const colors = Array.from(
    new Set(
      products.flatMap((p) => p.variants.map((v) => v.color)).filter(Boolean),
    ),
  ).sort();
  const filtered = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!query ||
        `${p.name} ${p.description} ${p.category}`
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      (!size ||
        p.variants.some(
          (v) =>
            v.size === size && v.available && (!color || v.color === color),
        )) &&
      (!color ||
        p.variants.some(
          (v) => v.color === color && v.available && (!size || v.size === size),
        )),
  );
  if (sort === "price-low")
    filtered.sort(
      (a, b) => (a.price?.value ?? Infinity) - (b.price?.value ?? Infinity),
    );
  if (sort === "price-high")
    filtered.sort((a, b) => (b.price?.value ?? 0) - (a.price?.value ?? 0));
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  function clear() {
    setQuery("");
    setCategory("");
    setSize("");
    setColor("");
  }
  return (
    <>
      <div className="shop-topline">
        <div className="category-tabs" aria-label="Product categories">
          <button
            className={!category ? "active" : ""}
            onClick={() => setCategory("")}
          >
            All goods <span>{products.length}</span>
          </button>
          {categories.map((c) => (
            <button
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
              key={c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="shop-toolbar">
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Search the collection</span>
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your kind of good…"
          />
        </label>
        <div className="filter-fields">
          <label>
            Size
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">All sizes</option>
              {sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Color
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">All colors</option>
              {colors.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </label>
        </div>
      </div>
      <div className="results-line">
        <span role="status">
          {filtered.length}{" "}
          {filtered.length === 1 ? "good thing" : "good things"} to take along
        </span>
        {(query || category || size || color) && (
          <button className="text-button" onClick={clear}>
            Clear filters <X size={13} />
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className="product-grid shop-grid">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="catalog-message">
          <h2>No goods down this road.</h2>
          <p>Try another search, size, or color.</p>
          <button className="button" onClick={clear}>
            Explore all goods
          </button>
        </div>
      )}
    </>
  );
}
