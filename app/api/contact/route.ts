import { NextRequest, NextResponse } from "next/server";
import { allowFormRequest, validateContact } from "@/lib/forms";
import { sameOrigin } from "@/lib/request-origin";
export async function POST(request: NextRequest) {
  if (!sameOrigin(request.headers.get("origin"), request.headers.get("host")))
    return NextResponse.json(
      { error: "Please send your message from our contact page." },
      { status: 403 },
    );
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_FROM_EMAIL ||
    !process.env.CONTACT_TO_EMAIL
  )
    return NextResponse.json(
      { error: "Please use the support link on our Contact page to reach us." },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length") ?? 0) > 20000)
    return NextResponse.json(
      { error: "Please shorten your message." },
      { status: 413 },
    );
  if (
    !allowFormRequest(
      "contact:" + (request.headers.get("x-forwarded-for") ?? "unknown"),
    )
  )
    return NextResponse.json(
      { error: "Please wait a few minutes before sending another message." },
      { status: 429 },
    );
  let data;
  try {
    data = validateContact(await request.json());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Please check your message.",
      },
      { status: 400 },
    );
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `Oak & Outpost: ${data.subject}`,
        text: `From: ${data.name}\nEmail: ${data.email}\nOrder: ${data.order || "Not provided"}\n\n${data.message}`,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Provider rejected message");
    return NextResponse.json({
      message:
        "Your message has been sent. We’ll get back to you as soon as we can.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Your message could not be sent. Please try again, or use the support link in our FAQ.",
      },
      { status: 502 },
    );
  }
}
