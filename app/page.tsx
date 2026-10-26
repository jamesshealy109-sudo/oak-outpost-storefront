import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sun, TreePine, Compass } from "lucide-react";
import { loadCatalog, curated } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { JoinOutpost } from "@/components/join-outpost";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { products, error } = await loadCatalog();
  const featured = curated(products);
  return (
    <>
      <section className="home-hero">
        <img
          className="hero-landscape"
          src="/images/long-way-home.png"
          alt="A quiet backroad beneath Southern live oaks and Spanish moss"
          width={1536}
          height={1024}
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <h1>
            Made for the
            <br />
            <em>long way</em> home.
          </h1>
          <p>
            Southern roots. Outdoor spirit. Everyday goods
            <br className="desktop-only" /> for wherever the road takes you.
          </p>
          <Link className="button button-cream" href="/shop">
            Find your next favorite <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hero-bottom">
          <span>TAKE THE BACKROAD.</span>
          <span>STAY A LITTLE LONGER.</span>
          <a href="#collection" aria-label="Explore the collection below">
            <span>Explore the outpost</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
      <div className="brand-ribbon">
        <span>
          <TreePine size={17} strokeWidth={1.4} /> Rooted in the South
        </span>
        <span>
          <Compass size={17} strokeWidth={1.4} /> Made for the outdoors
        </span>
        <span>
          <Sun size={18} strokeWidth={1.4} /> Worn along the way
        </span>
      </div>
      <section className="section collection-section" id="collection">
        <div className="section-heading">
          <div>
            <h2>
              Meet your everyday
              <br />
              adventure companions.
            </h2>
            <p>The tees, layers, and little things that go wherever you do.</p>
          </div>
          <Link className="underlined-link" href="/shop">
            Shop the collection <ArrowUpRight size={18} />
          </Link>
        </div>
        {error ? (
          <div className="catalog-message">
            <p>{error}</p>
            <Link className="underlined-link" href="/shop">
              Try the collection <ArrowRight size={16} />
            </Link>
          </div>
        ) : !products.length ? (
          <div className="catalog-message">
            <h3>Something good is taking root.</h3>
            <p>Our next collection is on its way. Come back soon.</p>
          </div>
        ) : (
          <div className="product-grid">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>
      <section className="collection-stories">
        <Link
          href="/shop?category=T-shirts"
          className="story-tile story-tile-heron"
        >
          <img
            src="/brand/heron-art.png"
            alt="Vintage Lowcountry heron artwork"
            width={330}
            height={330}
            loading="lazy"
          />
          <div>
            <h2>
              A little Lowcountry.
              <br />A lot of character.
            </h2>
            <span>
              Find your everyday tee <ArrowUpRight size={20} />
            </span>
          </div>
        </Link>
        <Link
          href="/shop?category=Long%20sleeves"
          className="story-tile story-tile-road"
        >
          <img
            src="/brand/backroad-art.png"
            alt="The long way home through the backroads"
            width={330}
            height={330}
            loading="lazy"
          />
          <div>
            <h2>
              Cool mornings.
              <br />
              Long weekends.
            </h2>
            <span>
              Settle into a long sleeve <ArrowUpRight size={20} />
            </span>
          </div>
        </Link>
      </section>
      <section className="brand-story section">
        <div className="brand-story-art">
          <img
            src="/brand/oak-badge.png"
            width={360}
            height={360}
            alt="The Oak & Outpost Southern Lifestyle Goods oak badge"
            loading="lazy"
          />
          <p>SOUTHERN LIFESTYLE GOODS · EST. 2026</p>
        </div>
        <div className="brand-story-copy">
          <h2>
            Good things happen
            <br />
            along the way.
          </h2>
          <p>
            Early mornings outside. A familiar road with the windows down. One
            more story around the fire.
          </p>
          <p>
            Oak & Outpost celebrates Southern traditions, outdoor adventures,
            and the places that feel like home. We make apparel for the moments
            between where you are and wherever you’re headed.
          </p>
          <Link className="underlined-link" href="/about">
            A little about our roots <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <JoinOutpost />
    </>
  );
}
