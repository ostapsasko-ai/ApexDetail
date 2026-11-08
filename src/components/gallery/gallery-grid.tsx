"use client";

import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { useState } from "react";
import { ComparisonSlider } from "./comparison-slider";

const ITEMS = [
  { id: 1, category: "lakier", label: "Korekta lakieru", src: "/generated/apexdetail-hero.png", position: "66% center" },
  { id: 2, category: "ceramika", label: "Powłoka ceramiczna", src: "/generated/apexdetail-hero.png", position: "82% center" },
  { id: 3, category: "wnetrze", label: "Detale wnętrza", src: "/generated/apexdetail-products.png", position: "76% center" },
  { id: 4, category: "felgi", label: "Zabezpieczenie felg", src: "/generated/apexdetail-hero.png", position: "94% center" },
  { id: 5, category: "akcesoria", label: "Pielęgnacja po usłudze", src: "/generated/apexdetail-products.png", position: "55% center" },
  { id: 6, category: "lakier", label: "Inspekcja powierzchni", src: "/generated/apexdetail-hero.png", position: "45% center" }
];

export function GalleryGrid() {
  const [filter, setFilter] = useState("wszystkie");
  const [active, setActive] = useState<(typeof ITEMS)[number] | null>(null);
  const categories = ["wszystkie", "lakier", "ceramika", "wnetrze", "felgi"];
  const visible = filter === "wszystkie" ? ITEMS : ITEMS.filter(({ category }) => category === filter);
  return (
    <section className="content-section shell">
      <div className="demo-banner"><strong>Materiały demonstracyjne</strong><span>Przed publikacją należy zastąpić je autentycznymi realizacjami klienta.</span></div>
      <h2 className="section-title">Porównanie powierzchni</h2><ComparisonSlider />
      <div className="category-filters gallery-filters">{categories.map((category) => <button key={category} className={filter === category ? "is-active" : ""} onClick={() => setFilter(category)}>{category === "wnetrze" ? "Wnętrze" : category === "wszystkie" ? "Wszystkie" : category[0].toUpperCase() + category.slice(1)}</button>)}</div>
      <div className="gallery-grid">{visible.map((item) => <button type="button" key={item.id} onClick={() => setActive(item)}><Image src={item.src} alt={`${item.label} — materiał demonstracyjny`} fill sizes="(max-width: 700px) 100vw, 33vw" style={{ objectPosition: item.position }} className="object-cover" /><span><ZoomIn />{item.label}</span></button>)}</div>
      {active && <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.label} onClick={() => setActive(null)}><button aria-label="Zamknij podgląd" onClick={() => setActive(null)}><X /></button><div><Image src={active.src} alt={`${active.label} — powiększenie`} fill sizes="100vw" style={{ objectPosition: active.position }} className="object-contain" /></div></div>}
    </section>
  );
}

