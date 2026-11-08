import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { RacingIntro } from "@/components/intro/racing-intro";

export const metadata: Metadata = {
  metadataBase: new URL("https://apexdetail.example"),
  title: { default: "ApexDetail — premium auto detailing", template: "%s | ApexDetail" },
  description: "Nowoczesne studio detailingu: korekta lakieru, ceramika, wnętrza, rezerwacje i sklep.",
  openGraph: {
    title: "ApexDetail",
    description: "Detailing zaprojektowany wokół precyzji.",
    locale: "pl_PL",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl">
      <body>
        <a href="#main-content" className="skip-link">Przejdź do treści</a>
        <CartProvider>
          <RacingIntro />
          <SiteHeader />
          <div id="main-content">{children}</div>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

