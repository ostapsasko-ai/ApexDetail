"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/navigation";
import { WheelCart } from "@/components/cart/wheel-cart";

const PRIMARY_ITEMS = NAV_ITEMS.filter(({ href }) =>
  ["/uslugi", "/kalkulator", "/rezerwacja", "/sklep", "/galeria", "/kontakt"].includes(href)
);

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="ApexDetail — strona główna">
          <span className="brand__mark" aria-hidden="true">A</span>
          <span>APEX<span>DETAIL</span></span>
        </Link>

        <nav className="desktop-nav" aria-label="Główna nawigacja">
          {PRIMARY_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <WheelCart />
          <Link href="/rezerwacja" className="button button--compact">Umów wizytę</Link>
          <button
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="mobile-nav" aria-label="Nawigacja mobilna">
          {NAV_ITEMS.filter(({ href }) => href !== "/").map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

