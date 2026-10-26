import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { supportUrl } from "@/lib/content";
import { ContactForm } from "@/components/contact-form";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Get in touch" };
export default function Contact() {
  const configured = !!(
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_FROM_EMAIL &&
    process.env.CONTACT_TO_EMAIL
  );
  return (
    <section className="section contact-page">
      <div className="contact-copy">
        <h1>
          Pull up a chair.
          <br />
          <em>Say hello.</em>
        </h1>
        <p>
          A question about your order? A little feedback from the road? We’d
          love to hear from you.
        </p>
        <div className="contact-tip">
          <h2>Asking about an order?</h2>
          <p>
            Have your order number handy. If something arrived damaged or
            incorrect, include a description and photos in the support form.
          </p>
        </div>
        <Link className="underlined-link" href="/faq">
          You might find it here <ArrowUpRight size={16} />
        </Link>
      </div>
      {configured ? (
        <ContactForm />
      ) : (
        <div className="support-panel">
          <img src="/brand/oak-leaf.png" width={100} height={95} alt="" />
          <h2>We’re happy to help.</h2>
          <p>
            Our support form connects you with the team who can help with your
            order, shipping, or a question about Oak & Outpost.
          </p>
          <a className="button" href={supportUrl}>
            Send us a message <ArrowUpRight size={18} />
          </a>
          <p className="small-copy">
            Opens our support form on Fourthwall, our current order and
            fulfillment partner.
          </p>
        </div>
      )}
    </section>
  );
}
