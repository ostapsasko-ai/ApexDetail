# ApexDetail — projekt produktu

## Cel

Zbudować kompletną, uruchamialną lokalnie polskojęzyczną platformę premium auto-detailingu: wielostronicowy serwis, kalkulator usług, rezerwacje, sklep, koszyk, checkout, galerię oraz chroniony panel administracyjny. Wynik ma być kodem źródłowym dostarczonym w ZIP-ie, z bezpiecznymi trybami demonstracyjnymi wszędzie tam, gdzie działanie produkcyjne wymaga zewnętrznych kluczy lub umów.

## Odbiorcy i zadania

- Klient detaliczny porównuje usługi, wycenia pakiet, rezerwuje termin i kupuje produkty.
- Klient sklepu wybiera dostawę, punkt odbioru lub adres kurierski i przechodzi do płatności.
- Administrator zarządza rezerwacjami, cenami, produktami, stanami, zamówieniami, dostępnością, kosztami dostaw i galerią.

## Zakres

- Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, GSAP, Lucide React.
- PostgreSQL i Prisma: modele użytkowników, usług, dostępności, rezerwacji, produktów, zamówień, płatności i galerii.
- Zod i walidacja serwerowa dla formularzy i endpointów.
- Stripe Checkout i podpisany webhook; bez kluczy jawny tryb demonstracyjny.
- Google Maps i adaptery przewoźników; bez kluczy brak zmyślonych punktów i jasny komunikat konfiguracyjny.
- E-mail przez adapter; bez danych dostępowych rezerwacja nie udaje wysłanej wiadomości.
- Wszystkie trasy wymienione w zadaniu, działająca nawigacja, responsywność i dostępność.

## Kierunek wizualny

„Torowe atelier”: precyzja Porsche Design połączona z materiałami warsztatu detailingowego. Jednym dominującym momentem jest 2–3 sekundowe intro z bolidem; pozostały interfejs pozostaje spokojny, techniczny i czytelny.

### Tokeny

- `Asphalt #08090B` — tło.
- `Carbon #15171B` — powierzchnie.
- `Signal red #E50914` — akcje i światło.
- `Polished silver #B9BEC8` — podziały i dane techniczne.
- `Track white #F6F7F8` — tekst pierwszoplanowy.
- Typografia: systemowy `Bahnschrift`/`Arial Narrow` dla nagłówków, `Segoe UI`/Inter dla treści; bez zależności od pobierania fontów podczas buildu.

### Układ

Asymetryczny hero z fotografią po prawej i zdecydowaną, lewostronną typografią. Sekcje mają rytm inspirowany panelami karoserii: ostre nacięcia, cienkie srebrne linie, umiarkowane promienie. Karty nie są identycznym zestawem SaaS; hierarchia wynika z funkcji i treści.

```text
┌─────────────────────────────────────────────────────────────┐
│ znak / nawigacja / koło-koszyk                              │
├──────────────────────────────┬──────────────────────────────┤
│ obietnica + 2 działania      │ samochód / światło / asfalt │
│ konkretne parametry          │ kadr schodzi poza viewport  │
├──────────────────────────────┴──────────────────────────────┤
│ pakiety usług:  duży / wąski / wąski                       │
├─────────────────────────────────────────────────────────────┤
│ proces i realizacje — naprzemienny rytm                     │
└─────────────────────────────────────────────────────────────┘
```

## Architektura

- Warstwa domenowa w `src/lib`: cennik, koszyk, walidacja, dostępność, płatności i wysyłka.
- Komponenty funkcjonalne w `src/components` z małymi client boundaries.
- Route Handlers w `src/app/api` jako bezpieczne granice serwera.
- Prisma jako docelowa persystencja PostgreSQL; katalog demonstracyjny i konfiguracja usług są danymi jawnie oznaczonymi.
- Admin chroniony sesyjnym tokenem HTTP-only, autoryzowany także na endpointach.

## Bezpieczeństwo i uczciwość trybów demo

- Brak przechowywania PAN/CVV; karta trafia wyłącznie do Stripe.
- Brak klucza Stripe oznacza brak realnego obciążenia i widoczny stan „Tryb demonstracyjny”.
- Brak klucza map/przewoźnika oznacza komunikat konfiguracyjny; system nie pokazuje fikcyjnych punktów.
- Rezerwacja wymaga sprawdzenia konfliktu po stronie serwera i unikalności slotu w bazie.
- Dane osobowe są minimalizowane, objęte informacją RODO i nie trafiają do logów aplikacyjnych.

## Poza zakresem lokalnego ZIP-a

- Aktywacja prawdziwych płatności, wysyłek, map, e-maili i OAuth bez danych klienta.
- Publikacja i migracje na cudzej infrastrukturze.
- Prawdziwe stany magazynowe, terminy i zdjęcia realizacji; dane startowe są wyraźnie demonstracyjne.

