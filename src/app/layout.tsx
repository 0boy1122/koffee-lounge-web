import type { Metadata } from "next";
import { Baloo_2, Nunito, Caveat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyActionBar } from "@/components/StickyActionBar";

const baloo = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Koffee Lounge — Crafted Coffee, Elevated Workspace",
  description:
    "Order coffee, food, and catering from Koffee Lounge, or book corporate coffee subscriptions, catering, and venue rental.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${nunito.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-espresso font-body">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
          <SiteFooter />
          <StickyActionBar />
        </CartProvider>
      </body>
    </html>
  );
}
