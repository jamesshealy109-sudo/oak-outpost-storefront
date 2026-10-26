import type { Metadata } from "next";
import localFont from "next/font/local";
import { CartProvider } from "@/components/cart";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";
const body = localFont({
  src: [
    { path: "../public/fonts/dm-sans-regular.ttf", weight: "400" },
    { path: "../public/fonts/dm-sans-semibold.ttf", weight: "600" },
  ],
  variable: "--font-body",
  display: "swap",
});
const display = localFont({
  src: "../public/fonts/fraunces-semibold.ttf",
  weight: "600",
  variable: "--font-display",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100",
  ),
  title: {
    default: "Oak & Outpost — Made for the Long Way Home",
    template: "%s | Oak & Outpost",
  },
  description:
    "Southern lifestyle and outdoor apparel inspired by backroads, open skies, and the places that feel like home. Explore the Oak & Outpost collection.",
  icons: { icon: "/brand/oak-badge.png" },
  openGraph: {
    title: "Oak & Outpost — Made for the Long Way Home",
    description: "Southern roots. Open roads. Timeless outdoor apparel.",
    images: ["/images/long-way-home.png"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
