import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/commerce/provider";
import { CommerceError } from "@/lib/commerce/fourthwall";
import {
  selectionItems,
  validCartId,
  validateQuantity,
} from "@/lib/commerce/validation";
import { sameOrigin } from "@/lib/request-origin";
const cookieName = "oo_cart";
const options = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};
export const dynamic = "force-dynamic";
function failure(error: unknown) {
  const known = error instanceof CommerceError;
  return NextResponse.json(
    {
      error: known
        ? error.message
        : error instanceof Error
          ? error.message
          : "Your bag could not be updated. Please try again.",
      code: known ? error.code : "INVALID_REQUEST",
    },
    {
      status: known ? error.status : 400,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
export async function GET() {
  try {
    const jar = await cookies();
    const id = jar.get(cookieName)?.value;
    if (!validCartId(id))
      return NextResponse.json(
        { cart: null },
        { headers: { "Cache-Control": "no-store" } },
      );
    const cart = await getProvider().getCart(id);
    return NextResponse.json(
      { cart },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof CommerceError && error.code === "CART_NOT_FOUND") {
      (await cookies()).delete(cookieName);
      return NextResponse.json({
        cart: null,
        message: "Your saved bag expired. Please add your favorites again.",
      });
    }
    return failure(error);
  }
}
export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request.headers.get("origin"), request.headers.get("host")))
    return NextResponse.json(
      { error: "Please update your bag from this website." },
      { status: 403 },
    );
  // Recovery must work even when an old bundle prevents the provider cart from
  // loading. Forget only this browser's cart link; leave the vendor cart intact.
  const response = NextResponse.json(
    { cart: null, message: "Your bag has been cleared. You can start again." },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.delete(cookieName);
  return response;
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request.headers.get("origin"), request.headers.get("host")))
    return NextResponse.json(
      { error: "Please update your bag from this website." },
      { status: 403 },
    );
  if (Number(request.headers.get("content-length") ?? 0) > 16384)
    return NextResponse.json(
      { error: "That request is too large." },
      { status: 413 },
    );
  try {
    const body = await request.json();
    const provider = getProvider();
    const jar = await cookies();
    const id = jar.get(cookieName)?.value;
    const hasCart = validCartId(id);
    let cart;
    if (body.action === "add") {
      if (
        typeof body.slug !== "string" ||
        !Array.isArray(body.variantIds) ||
        body.variantIds.some((x: unknown) => typeof x !== "string")
      )
        throw new Error("Please select a product, size, and color.");
      const product = await provider.getProduct(body.slug, true);
      if (!product)
        throw new Error(
          "This product is no longer available. Please return to the collection.",
        );
      const items = selectionItems(
        product,
        body.variantIds,
        validateQuantity(body.quantity),
      );
      if (hasCart) {
        try {
          cart = await provider.addItems(id, items);
        } catch (error) {
          if (error instanceof CommerceError && error.code === "CART_NOT_FOUND")
            cart = await provider.createCart(items);
          else throw error;
        }
      } else cart = await provider.createCart(items);
    } else if (body.action === "update" || body.action === "remove") {
      if (!hasCart)
        throw new Error("Your bag has expired. Please add your items again.");
      const current = await provider.getCart(id);
      const line = current.lines.find((l) => l.id === body.lineId);
      if (!line)
        throw new Error("This item has changed. Please refresh your bag.");
      cart =
        body.action === "remove"
          ? await provider.removeItems(id, line.items)
          : await provider.updateItems(
              id,
              line.items.map((item) => ({
                ...item,
                quantity: validateQuantity(body.quantity),
              })),
            );
    } else if (body.action === "checkout") {
      if (!hasCart)
        throw new Error(
          "Your bag is empty. Add something from the collection first.",
        );
      cart = await provider.getCart(id);
      if (!cart.lines.length)
        throw new Error(
          "Your bag is empty. Add something from the collection first.",
        );
    } else throw new Error("Please choose a valid bag action.");
    jar.set(cookieName, cart.id, options);
    return NextResponse.json(
      { cart },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
