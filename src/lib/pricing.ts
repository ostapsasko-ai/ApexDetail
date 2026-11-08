export const VEHICLES = [
  { id: "hatchback", label: "Hatchback", multiplier: 1 },
  { id: "sedan", label: "Sedan", multiplier: 1.1 },
  { id: "coupe", label: "Coupé", multiplier: 1.1 },
  { id: "wagon", label: "Kombi", multiplier: 1.15 },
  { id: "suv", label: "SUV / Crossover", multiplier: 1.25 }
] as const;

export type VehicleType = (typeof VEHICLES)[number]["id"];

export const SERVICES = [
  { id: "paint-polish", name: "Polerowanie lakieru", price: 500, description: "Odświeżenie połysku i redukcja lekkich zarysowań." },
  { id: "paint-correction", name: "Korekta lakieru", price: 900, description: "Wieloetapowa praca nad defektami i klarownością powierzchni." },
  { id: "ceramic-coating", name: "Powłoka ceramiczna", price: 1500, description: "Trwała hydrofobowość i łatwiejsza pielęgnacja lakieru." },
  { id: "interior-detail", name: "Detailing wnętrza", price: 350, description: "Kompleksowe czyszczenie i zabezpieczenie kabiny." },
  { id: "upholstery-cleaning", name: "Czyszczenie tapicerki", price: 250, description: "Pranie ekstrakcyjne lub bezpieczna pielęgnacja skóry." },
  { id: "detail-wash", name: "Mycie detailingowe", price: 150, description: "Dekontaminacja i bezpieczne mycie metodą dwóch wiader." },
  { id: "wheel-protection", name: "Zabezpieczenie felg", price: 200, description: "Oczyszczenie i powłoka ułatwiająca usuwanie pyłu." },
  { id: "headlight-restoration", name: "Renowacja reflektorów", price: 180, description: "Przywrócenie przejrzystości i zabezpieczenie UV." }
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

export type Estimate = {
  multiplier: number;
  items: Array<{ id: ServiceId; name: string; basePrice: number; price: number }>;
  total: number;
};

export function calculateEstimate(vehicle: VehicleType, serviceIds: string[]): Estimate {
  const vehicleDefinition = VEHICLES.find(({ id }) => id === vehicle);
  if (!vehicleDefinition) throw new Error("Nieznany typ nadwozia");

  const uniqueIds = [...new Set(serviceIds)];
  const items = uniqueIds.map((id) => {
    const service = SERVICES.find((candidate) => candidate.id === id);
    if (!service) throw new Error(`Nieznana usługa: ${id}`);
    return {
      id: service.id,
      name: service.name,
      basePrice: service.price,
      price: Math.round(service.price * vehicleDefinition.multiplier)
    };
  });

  return {
    multiplier: vehicleDefinition.multiplier,
    items,
    total: items.reduce((sum, item) => sum + item.price, 0)
  };
}

export function formatPln(amount: number): string {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);
}

