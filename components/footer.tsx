import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { shopDomain } from "@/lib/content";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" className="wordmark">
            OAK <span>&</span> OUTPOST<small>SOUTHERN LIFESTYLE GOODS</small>
          </Link>
          <p>
            For the backroads, the outdoors,
            <br />
            and the places that feel like home.
          </p>
          <span>Made for the Long Way Home.</span>
        </div>
        <div>
          <h3>Wander a little</h3>
          <Link href="/shop">The collection</Link>
          <Link href="/about">Our story</Link>
          <Link href="/shop?category=T-shirts">Everyday tees</Link>
          <Link href="/shop?category=Layers">Layers & long weekends</Link>
        </div>
        <div>
          <h3>We’re here to help</h3>
          <Link href="/contact">
            Contact us <ArrowUpRight size={13} />
          </Link>
          <Link href="/faq">Shipping & returns</Link>
          <Link href="/faq#tracking">Order tracking</Link>
          <a href={`https://${shopDomain}/pages/privacy-policy`}>
            Privacy policy
          </a>
          <a href={`https://${shopDomain}/pages/terms-of-service`}>
            Terms of service
          </a>
        </div>
        <img
          className="footer-badge"
          src="/brand/oak-badge.png"
          width={138}
          height={138}
          alt="Oak & Outpost oak tree badge, established 2026"
        />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Oak & Outpost LLC</span>
        <span>Rooted in the South. Ready for the road.</span>
        <a
          href="https://admin.fourthwall.com/store/oak-outpost-llc"
          rel="nofollow"
        >
          Store owner access <ArrowUpRight size={12} />
        </a>
      </div>
    </footer>
  );
}
