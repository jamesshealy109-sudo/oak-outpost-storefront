import { NextRequest, NextResponse } from "next/server";
import { allowFormRequest, validateNewsletter } from "@/lib/forms";
import { sameOrigin } from "@/lib/request-origin";
export async function POST(request: NextRequest) {
  if (!sameOrigin(request.headers.get("origin"), request.headers.get("host")))
    return NextResponse.json(
      { error: "Please join from our website." },
      { status: 403 },
    );
  const {
    MAILCHIMP_API_KEY: key,
    MAILCHIMP_AUDIENCE_ID: audience,
    MAILCHIMP_SERVER_PREFIX: server,
  } = process.env;
  if (!key || !audience || !server || !/^us\d+$/.test(server))
    return NextResponse.json(
      { error: "You can choose email updates during checkout." },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length") ?? 0) > 1500)
    return NextResponse.json(
      { error: "Please check your email address." },
      { status: 413 },
    );
  if (
    !allowFormRequest(
      "newsletter:" + (request.headers.get("x-forwarded-for") ?? "unknown"),
    )
  )
    return NextResponse.json(
      { error: "Please wait a few minutes and try again." },
      { status: 429 },
    );
  let email;
  try {
    email = validateNewsletter(await request.json());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Please check your email address.",
      },
      { status: 400 },
    );
  }
  try {
    const response = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audience)}/members`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from("oak-outpost:" + key).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_address: email, status: "pending" }),
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok) {
      const data = await response.json();
      if (data.title === "Member Exists")
        return NextResponse.json({
          message:
            "This email is already on our list or awaiting confirmation. Check your inbox for updates.",
        });
      throw new Error("Subscription rejected");
    }
    return NextResponse.json({
      message: "Check your inbox to confirm your place at the Outpost.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn’t sign you up just now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}
