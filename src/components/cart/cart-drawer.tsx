"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { formatPln } from "@/lib/pricing";
import { useCart } from "./cart-provider";

export function CartDrawer() {
  const { items, totals, open, setOpen, removeItem, setQuantity } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  if (!open) return null;
  return (
    <div className="cart-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header><div><p className="eyebrow">Koło zakupów</p><h2 id="cart-title">Twój koszyk</h2></div><button type="button" aria-label="Zamknij koszyk" onClick={() => setOpen(false)}><X /></button></header>
        <div className="cart-drawer__body">
          {items.length === 0 ? <div className="empty-state"><ShoppingBag /><h3>Koszyk czeka na pierwszy wybór.</h3><p>Dodaj usługę z kalkulatora albo produkt ze sklepu.</p><Link href="/sklep" className="button" onClick={() => setOpen(false)}>Przejdź do sklepu</Link></div> : items.map((item) => (
            <article className="cart-line" key={item.id}>
              <div><span className="cart-line__kind">{item.kind === "service" ? "Usługa" : "Produkt"}</span><h3>{item.name}</h3>{item.vehicle && <small>Nadwozie: {item.vehicle}</small>}</div>
              <strong>{formatPln(item.unitPrice * item.quantity)}</strong>
              {item.kind === "product" && <div className="quantity-control"><button type="button" aria-label={`Zmniejsz ilość ${item.name}`} onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus /></button><span>{item.quantity}</span><button type="button" aria-label={`Zwiększ ilość ${item.name}`} onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus /></button></div>}
              <button className="remove-line" type="button" aria-label={`Usuń ${item.name}`} onClick={() => removeItem(item.id)}><Trash2 /></button>
            </article>
          ))}
        </div>
        <footer>
          <div><span>Suma usług</span><strong>{formatPln(totals.serviceSubtotal)}</strong></div>
          <div><span>Suma produktów</span><strong>{formatPln(totals.productSubtotal)}</strong></div>
          <div className="cart-total"><span>Razem</span><strong>{formatPln(totals.subtotal)}</strong></div>
          <Link href="/zamowienie" className={`button ${items.length ? "" : "is-disabled"}`} onClick={() => setOpen(false)}>Przejdź do zamówienia</Link>
        </footer>
      </aside>
    </div>
  );
}

