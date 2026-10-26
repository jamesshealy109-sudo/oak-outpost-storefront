"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "./cart";
export function Header() {
  const { cart, openBag } = useCart();
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <div className="announcement">
        Southern roots. Open roads. A little farther from the everyday.
      </div>
      <header className="site-header">
        <button
          className="icon-button mobile-menu"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="main-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <Link
          href="/"
          className="wordmark"
          aria-label="Oak & Outpost home"
          onClick={() => setMenu(false)}
        >
          OAK <span>&</span> OUTPOST<small>SOUTHERN LIFESTYLE GOODS</small>
        </Link>
        <nav
          id="main-navigation"
          className={menu ? "main-nav expanded" : "main-nav"}
          aria-label="Main navigation"
        >
          {[
            ["/shop", "Shop the collection"],
            ["/about", "Our story"],
            ["/faq", "Good to know"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setMenu(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mobile-only"
            onClick={() => setMenu(false)}
          >
            Get in touch
          </Link>
        </nav>
        <div className="header-actions">
          <Link
            href="/shop?search=1"
            className="icon-button"
            aria-label="Search the collection"
          >
            <Search size={20} />
          </Link>
          <button
            className="bag-button"
            onClick={openBag}
            aria-label={`Open bag, ${cart?.count ?? 0} items`}
          >
            <ShoppingBag size={20} />
            <span className="bag-word">Bag</span>
            <span className="bag-count">{cart?.count ?? 0}</span>
          </button>
        </div>
      </header>
    </>
  );
}
