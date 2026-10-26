"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="section catalog-message">
      <h1>A small detour.</h1>
      <p>
        We couldn’t load this part of the Outpost. Please try again in a moment.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <Link className="underlined-link" href="/shop">
        Back to the collection
      </Link>
    </section>
  );
}
