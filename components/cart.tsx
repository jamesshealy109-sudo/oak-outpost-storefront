"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import type { Cart } from "@/lib/commerce/types";
import { money, shortName } from "@/lib/commerce/validation";
type Action = {
  action: "add" | "update" | "remove" | "checkout" | "reset";
  slug?: string;
  variantIds?: string[];
  quantity?: number;
  lineId?: string;
};
type CartContextValue = {
  cart: Cart | null;
  busy: boolean;
  error: string;
  openBag: () => void;
  mutate: (action: Action) => Promise<boolean>;
};
const Context = createContext<CartContextValue | null>(null);
export function useCart() {
  const value = useContext(Context);
  if (!value) throw new Error("Cart provider is missing");
  return value;
}
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [canReset, setCanReset] = useState(false);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const pending = useRef(false);
  const refresh = useCallback(async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/cart", { cache: "no-store" });
      const data = await r.json();
      if (!r.ok) {
        setCanReset(data.code === "BUNDLE_CHANGED");
        throw new Error(data.error);
      }
      setCart(data.cart);
      setCanReset(false);
      if (data.message) setNotice(data.message);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Your bag could not load. Please try again.",
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open) {
      opener.current = document.activeElement as HTMLElement;
      el.showModal();
      document.body.style.overflow = "hidden";
    } else {
      el.close();
      document.body.style.overflow = "";
      opener.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  async function mutate(action: Action) {
    if (pending.current) return false;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/cart", {
        method: action.action === "reset" ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        ...(action.action === "reset" ? {} : { body: JSON.stringify(action) }),
      });
      const data = await r.json();
      if (!r.ok) {
        setCanReset(data.code === "BUNDLE_CHANGED");
        throw new Error(
          data.error ?? "Your bag could not be updated. Please try again.",
        );
      }
      setCart(data.cart);
      setCanReset(false);
      if (data.message) setNotice(data.message);
      if (action.action === "checkout") {
        window.location.assign(data.cart.checkoutUrl);
      } else if (action.action === "add") {
        setNotice("Added to your bag.");
        setOpen(true);
      }
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Your bag could not be updated. Please try again.",
      );
      setOpen(true);
      return false;
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <Context.Provider
      value={{
        cart,
        busy,
        error,
        openBag: () => {
          setOpen(true);
          void refresh();
        },
        mutate,
      }}
    >
      {children}
      <span className="sr-only" role="status" aria-live="polite">
        {notice}
      </span>
      <dialog
        className="bag-dialog"
        ref={dialog}
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        aria-labelledby="bag-title"
        aria-busy={busy}
      >
        <div className="bag-shell">
          <header className="bag-heading">
            <h2 id="bag-title">
              Your bag <span>({cart?.count ?? 0})</span>
            </h2>
            <button
              className="icon-button"
              aria-label="Close bag"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </header>
          {error && (
            <div className="error-message" role="alert">
              <p>{error}</p>
              <button
                className="text-button"
                onClick={() => void refresh()}
                disabled={busy}
              >
                Refresh bag
              </button>
              {canReset && (
                <div>
                  <p>Start a new bag to shop again. This clears every item from your saved bag.</p>
                  <button
                    className="text-button"
                    onClick={() => void mutate({ action: "reset" })}
                    disabled={busy}
                  >
                    Clear bag and start again
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="bag-content">
            {!cart?.lines.length ? (
              <div className="bag-empty">
                <ShoppingBag size={42} strokeWidth={1} />
                <h3>A little room for adventure.</h3>
                <p>
                  Your bag is empty. Find something for wherever the road takes
                  you.
                </p>
                <Link
                  className="button"
                  href="/shop"
                  onClick={() => setOpen(false)}
                >
                  Explore the collection <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              cart.lines.map((line) => (
                <article className="bag-item" key={line.id}>
                  <Link
                    href={`/product/${line.slug}`}
                    onClick={() => setOpen(false)}
                    className="bag-image"
                  >
                    {line.image && (
                      <img
                        src={line.image}
                        alt={line.name}
                        width={90}
                        height={112}
                      />
                    )}
                  </Link>
                  <div className="bag-item-details">
                    <Link
                      href={`/product/${line.slug}`}
                      onClick={() => setOpen(false)}
                    >
                      {shortName(line.name)}
                    </Link>
                    <p>{line.description}</p>
                    <span className="price">{money(line.unitPrice)}</span>
                    <div className="bag-item-controls">
                      <div className="quantity-control">
                        <button
                          aria-label={`Decrease quantity of ${shortName(line.name)}`}
                          disabled={busy || line.quantity <= 1}
                          onClick={() =>
                            void mutate({
                              action: "update",
                              lineId: line.id,
                              quantity: line.quantity - 1,
                            })
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          aria-label={`Increase quantity of ${shortName(line.name)}`}
                          disabled={busy || line.quantity >= 1000}
                          onClick={() =>
                            void mutate({
                              action: "update",
                              lineId: line.id,
                              quantity: line.quantity + 1,
                            })
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className="icon-button"
                        disabled={busy}
                        aria-label={`Remove ${shortName(line.name)}`}
                        onClick={() =>
                          void mutate({ action: "remove", lineId: line.id })
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
          {!!cart?.lines.length && (
            <footer className="bag-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <strong>{money(cart.subtotal)}</strong>
              </div>
              <p>
                Shipping, taxes, and any discounts are calculated at checkout.
              </p>
              <button
                className="button full-width"
                disabled={busy}
                onClick={() => void mutate({ action: "checkout" })}
              >
                {busy ? (
                  <>
                    <LoaderCircle className="spin" size={18} /> Updating your
                    bag…
                  </>
                ) : (
                  <>
                    Continue to checkout <ArrowRight size={18} />
                  </>
                )}
              </button>
              <small>
                <LockKeyhole size={13} /> Secure checkout with Fourthwall
              </small>
            </footer>
          )}
        </div>
      </dialog>
    </Context.Provider>
  );
}
