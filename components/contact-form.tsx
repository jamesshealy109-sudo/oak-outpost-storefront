"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  return (
    <form
      className="contact-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setBusy(true);
        setStatus("");
        try {
          const r = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
          });
          const data = await r.json();
          setStatus(data.message ?? data.error);
          if (r.ok) form.reset();
        } catch {
          setStatus("Your message could not be sent. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Your name
        <input name="name" autoComplete="name" maxLength={120} required />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
        />
      </label>
      <label>
        Order number <span>(optional)</span>
        <input name="order" maxLength={80} />
      </label>
      <label>
        Subject
        <input name="subject" maxLength={180} required />
      </label>
      <label>
        Your message
        <textarea name="message" rows={5} maxLength={5000} required />
      </label>
      <button type="submit" className="button" disabled={busy}>
        {busy ? "Sending…" : "Send message"}
        <ArrowRight size={18} />
      </button>
      <p role="status">{status}</p>
    </form>
  );
}
