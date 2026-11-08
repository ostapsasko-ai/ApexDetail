"use client";

import { MapPin, Search } from "lucide-react";
import { useState } from "react";

export type PickupPoint = { id: string; name: string; address: string; lat: number; lng: number };

export function PickupMap({ selected, onSelect }: { selected: PickupPoint | null; onSelect: (point: PickupPoint) => void }) {
  const [query, setQuery] = useState(""); const [points, setPoints] = useState<PickupPoint[]>([]); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  async function search() {
    setLoading(true); setMessage("");
    try { const response = await fetch(`/api/pickup-points?q=${encodeURIComponent(query)}`); const data = await response.json(); setPoints(data.points ?? []); if (!response.ok) setMessage(data.message ?? data.error); }
    catch { setMessage("Nie udało się połączyć z usługą punktów."); } finally { setLoading(false); }
  }
  const focus = selected ?? points[0];
  return <div className="pickup-picker"><div className="pickup-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Miasto lub kod pocztowy" /><button type="button" onClick={search} disabled={query.trim().length < 2 || loading}><Search />{loading ? "Szukam…" : "Szukaj punktów"}</button></div>{message && <div className="integration-warning"><MapPin /><span>{message} Nie pokazujemy przykładowych lokalizacji jako prawdziwych.</span></div>}{focus && mapKey ? <iframe title="Mapa wybranego punktu odbioru" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(mapKey)}&q=${focus.lat},${focus.lng}`} /> : points.length > 0 && <div className="integration-warning"><MapPin /><span>Lista punktów pochodzi z API przewoźnika, ale mapa wymaga klucza Google Maps.</span></div>}<div className="pickup-list">{points.map((point) => <button type="button" className={selected?.id === point.id ? "is-active" : ""} key={point.id} onClick={() => onSelect(point)}><MapPin /><span><strong>{point.name}</strong><small>{point.address}</small></span></button>)}</div></div>;
}

