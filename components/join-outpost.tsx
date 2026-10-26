import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
export function JoinOutpost() {
  const enabled = !!(
    process.env.MAILCHIMP_API_KEY &&
    process.env.MAILCHIMP_AUDIENCE_ID &&
    process.env.MAILCHIMP_SERVER_PREFIX
  );
  return (
    <section className="join-outpost">
      <div>
        <h2>
          There’s a place for you
          <br />
          at the Outpost.
        </h2>
        <p>New designs. Familiar places. More reasons to take the long way.</p>
      </div>
      <div className="join-action">
        {enabled ? (
          <NewsletterForm />
        ) : (
          <>
            <h3>Come along for the next chapter.</h3>
            <p>
              Choose email updates when you check out to hear what’s coming down
              the road.
            </p>
            <Link className="underlined-link" href="/shop">
              Find your first favorite <ArrowRight size={18} />
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
