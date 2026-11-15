export type Review = {
  id: string;
  name: string;
  vehicle: string;
  service: string;
  body: string;
  rating: 5;
};

export const REVIEWS: readonly Review[] = [
  {
    id: "karol-bmw-m340i",
    name: "Karol M.",
    vehicle: "BMW M340i",
    service: "Korekta lakieru + ceramika",
    body: "Lakier odzyskał głębię, której nie było nawet przy odbiorze auta. Każdy etap został mi spokojnie wyjaśniony.",
    rating: 5
  },
  {
    id: "aleksandra-volvo-xc60",
    name: "Aleksandra R.",
    vehicle: "Volvo XC60",
    service: "Detailing wnętrza",
    body: "Wnętrze po rodzinnych wyjazdach wygląda jak nowe, bez ciężkiego zapachu chemii i bez błyszczących plastików.",
    rating: 5
  },
  {
    id: "michal-porsche-macan",
    name: "Michał K.",
    vehicle: "Porsche Macan GTS",
    service: "Folia PPF — front",
    body: "Krawędzie folii są praktycznie niewidoczne. Termin i zakres prac zgadzały się dokładnie z ustaleniami.",
    rating: 5
  },
  {
    id: "natalia-audi-a5",
    name: "Natalia W.",
    vehicle: "Audi A5 Sportback",
    service: "One step + zabezpieczenie",
    body: "Czerń znowu jest czarna, a drobne rysy zniknęły. Najbardziej doceniam rzeczową ocenę bez naciągania zakresu.",
    rating: 5
  },
  {
    id: "piotr-mercedes-e",
    name: "Piotr S.",
    vehicle: "Mercedes-AMG E 53",
    service: "Pakiet kompleksowy",
    body: "Auto zostało oddane perfekcyjnie przygotowane i punktualnie. Widać kontrolę jakości, nie tylko szybkie mycie.",
    rating: 5
  },
  {
    id: "joanna-tesla-model3",
    name: "Joanna L.",
    vehicle: "Tesla Model 3",
    service: "Powłoka ceramiczna",
    body: "Po kilku miesiącach samochód nadal myje się wyraźnie łatwiej. Dostałam też konkretne zalecenia pielęgnacji.",
    rating: 5
  },
  {
    id: "tomasz-toyota-supra",
    name: "Tomasz P.",
    vehicle: "Toyota GR Supra",
    service: "Korekta wieloetapowa",
    body: "Trudny lakier został dopracowany pod lampą bez hologramów. Efekt jest równy na każdym elemencie nadwozia.",
    rating: 5
  },
  {
    id: "ewa-range-rover-velar",
    name: "Ewa D.",
    vehicle: "Range Rover Velar",
    service: "Skóra + wnętrze",
    body: "Jasna tapicerka odzyskała naturalny kolor i matowe wykończenie. Wszystko wykonane z dużą dbałością o detale.",
    rating: 5
  }
] as const;

