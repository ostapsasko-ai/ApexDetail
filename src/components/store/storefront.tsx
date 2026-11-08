"use client";

import Image from "next/image";
import { Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { filterProducts, PRODUCT_CATEGORIES, PRODUCTS, type CatalogFilters } from "@/lib/catalog";
import { formatPln } from "@/lib/pricing";
import { useCart } from "@/components/cart/cart-provider";

export function Storefront() {
  const [filters, setFilters] = useState<CatalogFilters>({ query: "", category: "all", sort: "featured" });
  const { addItem } = useCart();
  const products = useMemo(() => filterProducts(PRODUCTS, filters), [filters]);

  return (
    <section className="content-section shell">
      <div className="demo-banner"><strong>Katalog demonstracyjny</strong><span>Produkty i stany magazynowe służą do prezentacji platformy.</span></div>
      <div className="store-toolbar">
        <label className="search-field"><Search /><span className="sr-only">Szukaj produktów</span><input value={filters.query} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Szukaj produktu" /></label>
        <label className="select-field"><SlidersHorizontal /><span className="sr-only">Sortowanie</span><select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as CatalogFilters["sort"] }))}><option value="featured">Polecane</option><option value="price-asc">Cena: rosnąco</option><option value="price-desc">Cena: malejąco</option></select></label>
      </div>
      <div className="category-filters" role="group" aria-label="Kategorie produktów">
        <button className={filters.category === "all" ? "is-active" : ""} onClick={() => setFilters((current) => ({ ...current, category: "all" }))}>Wszystkie</button>
        {PRODUCT_CATEGORIES.map((category) => <button key={category.id} className={filters.category === category.id ? "is-active" : ""} onClick={() => setFilters((current) => ({ ...current, category: category.id }))}>{category.label}</button>)}
      </div>
      {products.length ? <div className="product-grid">{products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-card__image"><Image src="/generated/apexdetail-products.png" alt={`Demonstracyjny produkt: ${product.name}`} fill sizes="(max-width: 700px) 100vw, 33vw" style={{ objectPosition: product.imagePosition }} className="object-cover" /></div>
          <div className="product-card__body"><p>{PRODUCT_CATEGORIES.find(({ id }) => id === product.category)?.label}</p><h2>{product.name}</h2><span>{product.description}</span><div><strong>{formatPln(product.price)}</strong><small className={product.stock ? "in-stock" : "out-of-stock"}>{product.stock ? `Dostępny · ${product.stock} szt.` : "Obecnie niedostępny"}</small></div><button type="button" className="button" disabled={!product.stock} onClick={() => addItem({ id: `product-${product.id}`, kind: "product", name: product.name, unitPrice: product.price, quantity: 1, image: "/generated/apexdetail-products.png" })}><ShoppingBag size={17} /> {product.stock ? "Dodaj do koszyka" : "Brak w magazynie"}</button></div>
        </article>
      ))}</div> : <div className="surface empty-catalog"><Search /><h2>Brak pasujących produktów.</h2><p className="muted">Zmień frazę albo wybierz inną kategorię.</p></div>}
    </section>
  );
}

