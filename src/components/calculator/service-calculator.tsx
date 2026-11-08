"use client";

import Link from "next/link";
import { animate, motion } from "framer-motion";
import { Car, CarFront, Check, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { calculateEstimate, formatPln, SERVICES, VEHICLES, type VehicleType } from "@/lib/pricing";
import { useCart } from "@/components/cart/cart-provider";

const STORAGE_KEY = "apexdetail-calculator-v1";

export function ServiceCalculator() {
  const [vehicle, setVehicle] = useState<VehicleType>("sedan");
  const [selected, setSelected] = useState<string[]>([]);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [saved, setSaved] = useState(false);
  const previousTotal = useRef(0);
  const { addItem, setOpen } = useCart();

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { vehicle?: VehicleType; selected?: string[] };
      if (VEHICLES.some(({ id }) => id === parsed.vehicle)) setVehicle(parsed.vehicle!);
      if (Array.isArray(parsed.selected)) setSelected(parsed.selected.filter((id) => SERVICES.some((service) => service.id === id)));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ vehicle, selected }));
  }, [vehicle, selected]);

  const estimate = useMemo(() => calculateEstimate(vehicle, selected), [vehicle, selected]);

  useEffect(() => {
    const controls = animate(previousTotal.current, estimate.total, {
      duration: 0.45,
      ease: "easeOut",
      onUpdate: (value) => setDisplayTotal(Math.round(value)),
      onComplete: () => { previousTotal.current = estimate.total; }
    });
    return () => controls.stop();
  }, [estimate.total]);

  function toggleService(id: string) {
    setSaved(false);
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  function addPackageToCart() {
    estimate.items.forEach((item) => addItem({ id: `service-${item.id}`, kind: "service", name: item.name, unitPrice: item.price, quantity: 1, vehicle }));
    setSaved(true);
    setOpen(true);
  }

  return (
    <div className="shell pb-24">
      <section className="calculator-step">
        <div className="step-heading"><span>1</span><div><h2>Wybierz nadwozie</h2><p>Rozmiar wpływa na czas i zużycie materiałów.</p></div></div>
        <div className="vehicle-grid">
          {VEHICLES.map((item, index) => {
            const Icon = index === 4 ? CarFront : Car;
            return (
              <button key={item.id} type="button" className={`vehicle-option ${vehicle === item.id ? "is-active" : ""}`} aria-pressed={vehicle === item.id} onClick={() => setVehicle(item.id)}>
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
                <small>× {item.multiplier.toFixed(2)}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="calculator-step">
        <div className="step-heading"><span>2</span><div><h2>Dobierz zakres</h2><p>Możesz połączyć dowolną liczbę usług.</p></div></div>
        <div className="service-selector-grid">
          {SERVICES.map((service) => {
            const active = selected.includes(service.id);
            return (
              <motion.button layout key={service.id} type="button" className={`service-option ${active ? "is-active" : ""}`} aria-pressed={active} onClick={() => toggleService(service.id)}>
                <span className="service-option__icon">{active ? <Check /> : <Plus />}</span>
                <span><strong>{service.name}</strong><small>{service.description}</small></span>
                <b>od {formatPln(service.price)}</b>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="estimate-panel" aria-live="polite">
        <div>
          <p className="eyebrow">Wycena orientacyjna</p>
          <p className="estimate-total">{formatPln(displayTotal)}</p>
          <p className="muted">Mnożnik nadwozia: × {estimate.multiplier.toFixed(2)}</p>
        </div>
        <div className="estimate-breakdown">
          {estimate.items.length === 0 ? <p className="muted">Wybierz co najmniej jedną usługę, aby zobaczyć rozbicie kosztów.</p> : estimate.items.map((item) => <div key={item.id}><span>{item.name}</span><strong>{formatPln(item.price)}</strong></div>)}
        </div>
        <div className="estimate-actions">
          <button type="button" className="button button--secondary" disabled={!selected.length} onClick={addPackageToCart}>{saved ? <><Check size={18} /> Pakiet w koszyku</> : <><ShieldCheck size={18} /> Dodaj do koszyka</>}</button>
          <Link href={selected.length ? "/rezerwacja" : "/kalkulator"} aria-disabled={!selected.length} className={`button ${selected.length ? "" : "is-disabled"}`}>Zarezerwuj termin</Link>
        </div>
        <p className="estimate-note">Cena jest szacunkiem. Stan lakieru, tapicerki i nietypowe zabrudzenia mogą wpłynąć na wycenę potwierdzoną po oględzinach.</p>
      </section>
    </div>
  );
}

