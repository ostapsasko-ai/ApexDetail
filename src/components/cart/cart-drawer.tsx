"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { formatPln } from "@/lib/pricing";
import { useCart } from "./cart-provider";

const PARTICLES = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 61 + 7) % 100}%`,
  size: 1 + (index % 3),
  delay: `${-((index * 0.37) % 4)}s`,
  duration: `${2.8 + (index % 5) * 0.65}s`
}));

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
      <aside className="cart-drawer relative overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(239,35,49,0.12),transparent_58%)]" aria-hidden="true">
          {PARTICLES.map((particle, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-white/70 shadow-[0_0_10px_rgba(239,35,49,0.9)]"
              style={{ left: particle.left, top: particle.top, width: particle.size + 1, height: particle.size + 1, animation: `cartParticle ${particle.duration} ease-in-out ${particle.delay} infinite` }}
            />
          ))}
        </div>
        <header className="relative z-10"><div><p className="eyebrow">Koło zakupów</p><h2 id="cart-title">Twój koszyk</h2></div><button type="button" aria-label="Zamknij koszyk" onClick={() => setOpen(false)}><X /></button></header>
        <div className="cart-drawer__body relative z-10">
          {items.length === 0 ? <div className="empty-state"><ShoppingBag /><h3>Koszyk czeka na pierwszy wybór.</h3><p>Dodaj usługę z kalkulatora albo produkt ze sklepu.</p><Link href="/sklep" className="button" onClick={() => setOpen(false)}>Przejdź do sklepu</Link></div> : items.map((item) => (
            <article className="cart-line" key={item.id}>
              <div><span className="cart-line__kind">{item.kind === "service" ? "Usługa" : "Produkt"}</span><h3>{item.name}</h3>{item.vehicle && <small>Nadwozie: {item.vehicle}</small>}</div>
              <strong>{formatPln(item.unitPrice * item.quantity)}</strong>
              {item.kind === "product" && <div className="quantity-control"><button type="button" aria-label={`Zmniejsz ilość ${item.name}`} onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus /></button><span>{item.quantity}</span><button type="button" aria-label={`Zwiększ ilość ${item.name}`} onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus /></button></div>}
              <button className="remove-line" type="button" aria-label={`Usuń ${item.name}`} onClick={() => removeItem(item.id)}><Trash2 /></button>
            </article>
          ))}
        </div>
        <footer className="relative z-10">
          <div><span>Suma usług</span><strong>{formatPln(totals.serviceSubtotal)}</strong></div>
          <div><span>Suma produktów</span><strong>{formatPln(totals.productSubtotal)}</strong></div>
          <div className="cart-total"><span>Razem</span><strong>{formatPln(totals.subtotal)}</strong></div>
          <Link href="/zamowienie" className={`button ${items.length ? "" : "is-disabled"}`} onClick={() => setOpen(false)}>Przejdź do zamówienia</Link>
        </footer>
        <style jsx>{`
          @keyframes cartParticle {
            0% { transform: translate3d(0, 36px, 0) scale(.65); opacity: 0; }
            18% { opacity: .9; }
            52% { transform: translate3d(20px, -12px, 0) scale(1.2); opacity: .75; }
            100% { transform: translate3d(-14px, -76px, 0) scale(.4); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            span { animation: none !important; }
          }
        `}</style>
      </aside>
    </div>
  );
}

