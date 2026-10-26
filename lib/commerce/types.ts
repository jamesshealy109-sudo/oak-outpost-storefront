export type Money = { value: number; currency: string };
export type ProductImage = { url: string; alt: string };
export type Variant = {
  id: string;
  name: string;
  description: string;
  price: Money;
  color: string;
  swatch: string;
  size: string;
  available: boolean;
  stock: number | null;
  image: ProductImage | null;
};
export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: ProductImage[];
  variants: Variant[];
  price: Money | null;
  available: boolean;
  type: "PRODUCT" | "BUNDLE";
  category: string;
  details: { title: string; body: string }[];
  offers: Product[];
  pricingStrategy: {
    type: string;
    discountPercentage?: number;
    price?: Money;
  } | null;
};
export type CartItemInput = {
  variantId: string;
  quantity: number;
  bundleId?: string;
  groupedId?: string;
};
export type CartLine = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  items: CartItemInput[];
  bundle: boolean;
};
export type Cart = {
  id: string;
  lines: CartLine[];
  subtotal: Money;
  count: number;
  checkoutUrl: string;
};
export interface CommerceProvider {
  listProducts(fresh?: boolean): Promise<Product[]>;
  getProduct(slug: string, fresh?: boolean): Promise<Product | null>;
  getCart(id: string): Promise<Cart>;
  createCart(items: CartItemInput[]): Promise<Cart>;
  addItems(id: string, items: CartItemInput[]): Promise<Cart>;
  updateItems(id: string, items: CartItemInput[]): Promise<Cart>;
  removeItems(id: string, items: CartItemInput[]): Promise<Cart>;
  checkoutUrl(id: string): string;
}
