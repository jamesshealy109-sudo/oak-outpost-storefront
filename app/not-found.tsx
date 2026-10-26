import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <section className="section catalog-message">
      <img
        src="/brand/oak-badge.png"
        width={150}
        height={150}
        alt="Oak & Outpost"
      />
      <h1>A little off the beaten path.</h1>
      <p>
        This page or product couldn’t be found. There are more good things back
        at the Outpost.
      </p>
      <Link className="button" href="/shop">
        Explore the collection <ArrowRight size={18} />
      </Link>
    </section>
  );
}
