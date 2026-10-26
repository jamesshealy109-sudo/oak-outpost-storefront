"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
export function NewsletterForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="newsletter-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setStatus("");
        const form = e.currentTarget;
        try {
          const r = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: new FormData(form).get("email"),
              consent: true,
            }),
          });
          const data = await r.json();
          setStatus(data.message ?? data.error);
          if (r.ok) form.reset();
        } catch {
          setStatus("We couldn’t connect. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label htmlFor="newsletter-email">Join the Outpost</label>
      <div>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          placeholder="Your email address"
          autoComplete="email"
          maxLength={254}
          required
        />
        <button type="submit" aria-label="Join the Outpost" disabled={busy}>
          <ArrowRight size={22} />
        </button>
      </div>
      <small>
        By joining, you agree to receive Oak & Outpost emails. Unsubscribe
        anytime.
      </small>
      <p role="status">{busy ? "Sending…" : status}</p>
    </form>
  );
}
