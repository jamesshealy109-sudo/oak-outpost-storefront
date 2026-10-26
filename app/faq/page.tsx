import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { faq } from "@/lib/content";
export const metadata: Metadata = {
  title: "Good to know — shipping, returns & FAQ",
};
export default function FAQ() {
  return (
    <section className="section faq-page">
      <div className="page-intro">
        <h1>
          A few things
          <br />
          <em>good to know.</em>
        </h1>
        <p>
          From finding your fit to following your order home.
          <br />
          We’re here to make the journey a little easier.
        </p>
      </div>
      <div className="faq-list">
        {faq.map(([q, a], i) => (
          <details key={q} id={i === 4 ? "tracking" : undefined}>
            <summary>
              {q}
              <ChevronDown size={20} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <div className="help-close">
        <h2>Still have a question?</h2>
        <p>There’s a real person at the other end.</p>
        <Link href="/contact" className="button">
          Get in touch <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
