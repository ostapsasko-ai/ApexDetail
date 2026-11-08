"use client";

import Link from "next/link";
import { CartDrawer } from "./cart-drawer";
import { useCart } from "./cart-provider";
import { formatPln } from "@/lib/pricing";

export function CartPageContent() {
  const { items, totals, setOpen, clearCart } = useCart();
  if (!items.length) return <section className="content-section shell"><div className="surface"><h2>Koszyk jest pusty.</h2><p className="muted">Skonfiguruj usługę albo wybierz produkt do pielęgnacji.</p><div className="flex flex-wrap gap-3"><Link href="/kalkulator" className="button">Otwórz kalkulator</Link><Link href="/sklep" className="button button--secondary">Zobacz sklep</Link></div></div><CartDrawer /></section>;
  return <section className="content-section shell"><div className="cart-page-list">{items.map((item) => <article key={item.id}><div><span>{item.kind === "service" ? "Usługa" : "Produkt"}</span><h2>{item.name}</h2><p className="muted">Ilość: {item.quantity}{item.vehicle ? ` · ${item.vehicle}` : ""}</p></div><strong>{formatPln(item.unitPrice * item.quantity)}</strong></article>)}</div><div className="cart-page-summary"><p>Łącznie <strong>{formatPln(totals.subtotal)}</strong></p><button className="button button--secondary" onClick={clearCart}>Wyczyść</button><button className="button" onClick={() => setOpen(true)}>Edytuj i zamów</button></div><CartDrawer /></section>;
}

