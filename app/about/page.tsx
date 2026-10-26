import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { story } from "@/lib/content";
import { JoinOutpost } from "@/components/join-outpost";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Our story" };
export default function About() {
  return (
    <>
      <section className="about-opening section">
        <div>
          <h1>
            Rooted in the South.
            <br />
            <em>Made for the outdoors.</em>
          </h1>
          <p>
            For the places we come from.
            <br />
            And the places we’ve yet to find.
          </p>
        </div>
        <img
          src="/brand/oak-badge.png"
          width={300}
          height={300}
          alt="Oak & Outpost, Southern Lifestyle Goods, established 2026"
        />
      </section>
      <div className="about-landscape">
        <img
          src="/images/long-way-home.png"
          width={1536}
          height={1024}
          alt="A winding Southern backroad beneath a canopy of live oaks"
        />
      </div>
      <section className="about-story section">
        <h2>
          The journey
          <br />
          is the good part.
        </h2>
        <div>
          {story.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Link className="button" href="/shop">
            Make yourself at home <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <JoinOutpost />
    </>
  );
}
