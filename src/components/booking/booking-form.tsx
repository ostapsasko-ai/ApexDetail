"use client";

import { CalendarDays, CheckCircle2, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/lib/pricing";

type Slot = { time: string; available: boolean };
function tomorrow() { const value = new Date(); value.setDate(value.getDate() + 1); return value.toISOString().slice(0, 10); }

export function BookingForm() {
  const router = useRouter();
  const [date, setDate] = useState(tomorrow);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [time, setTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [calendarMessage, setCalendarMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const canSubmit = useMemo(() => Boolean(date && time && selectedServices.length), [date, time, selectedServices]);

  useEffect(() => {
    const stored = window.localStorage.getItem("apexdetail-calculator-v1");
    if (stored) { try { const parsed = JSON.parse(stored) as { selected?: string[] }; if (parsed.selected) setSelectedServices(parsed.selected); } catch { /* optional preference only */ } }
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingSlots(true); setCalendarMessage(""); setTime("");
    fetch(`/api/availability?date=${date}`).then(async (response) => {
      const data = await response.json(); if (!active) return; setSlots(data.slots ?? []); if (!response.ok) setCalendarMessage(data.message ?? "Nie udało się sprawdzić terminów.");
    }).catch(() => { if (active) setCalendarMessage("Brak połączenia z kalendarzem. Nie pokazujemy niesprawdzonej dostępności."); }).finally(() => { if (active) setLoadingSlots(false); });
    return () => { active = false; };
  }, [date]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setError("");
    const form = new FormData(event.currentTarget);
    const payload = { date, time, serviceIds: selectedServices, vehicleBrand: form.get("vehicleBrand"), vehicleModel: form.get("vehicleModel"), customerName: form.get("customerName"), phone: form.get("phone"), email: form.get("email"), notes: form.get("notes"), consent: form.get("consent") === "on" };
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Nie udało się zapisać rezerwacji."); router.push(`/rezerwacja/potwierdzenie?ref=${encodeURIComponent(data.reference)}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Nie udało się zapisać rezerwacji."); } finally { setSubmitting(false); }
  }

  return <form className="booking-form" onSubmit={submit}>
    <section><div className="step-heading"><span>1</span><div><h2>Termin</h2><p>Dostępność pochodzi z bazy — nie generujemy fikcyjnych slotów.</p></div></div><label className="field"><span>Data</span><input type="date" min={tomorrow()} value={date} onChange={(event) => setDate(event.target.value)} required /></label>{loadingSlots ? <p className="status-line"><LoaderCircle className="animate-spin" /> Sprawdzam kalendarz…</p> : calendarMessage ? <div className="integration-warning"><CalendarDays /><span>{calendarMessage}</span></div> : <div className="slot-grid">{slots.map((slot) => <button type="button" disabled={!slot.available} className={time === slot.time ? "is-active" : ""} onClick={() => setTime(slot.time)} key={slot.time}>{slot.time}{!slot.available && <small>zajęty</small>}</button>)}</div>}</section>
    <section><div className="step-heading"><span>2</span><div><h2>Zakres prac</h2><p>Wybierz minimum jedną usługę.</p></div></div><div className="booking-services">{SERVICES.map((service) => <label key={service.id}><input type="checkbox" checked={selectedServices.includes(service.id)} onChange={() => setSelectedServices((current) => current.includes(service.id) ? current.filter((id) => id !== service.id) : [...current, service.id])} /><span>{service.name}</span></label>)}</div></section>
    <section><div className="step-heading"><span>3</span><div><h2>Samochód i kontakt</h2><p>Dane wykorzystamy wyłącznie do obsługi wizyty.</p></div></div><div className="form-grid"><label className="field"><span>Marka</span><input name="vehicleBrand" required /></label><label className="field"><span>Model</span><input name="vehicleModel" required /></label><label className="field"><span>Imię i nazwisko</span><input name="customerName" autoComplete="name" required /></label><label className="field"><span>Telefon</span><input name="phone" type="tel" autoComplete="tel" required /></label><label className="field field--wide"><span>E-mail</span><input name="email" type="email" autoComplete="email" required /></label><label className="field field--wide"><span>Dodatkowe informacje</span><textarea name="notes" rows={4} maxLength={1000} /></label></div><label className="consent"><input name="consent" type="checkbox" required /><span>Zgadzam się na przetwarzanie danych w celu obsługi rezerwacji. Dane nie są używane marketingowo bez osobnej zgody.</span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" type="submit" disabled={!canSubmit || submitting}>{submitting ? <><LoaderCircle className="animate-spin" /> Zapisuję…</> : <><CheckCircle2 /> Zarezerwuj termin</>}</button></section>
  </form>;
}

