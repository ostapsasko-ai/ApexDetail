# ApexDetail

Polskojęzyczna platforma premium auto-detailingu z kalkulatorem, rezerwacjami, sklepem, koszykiem, checkoutem Stripe, wysyłką, galerią i chronionym panelem administratora.

## Najważniejsze funkcje

- 11 rzeczywistych tras publicznych i panel administratora;
- filmowe intro z oryginalnym, niebrandowanym bolidem — raz na sesję, z pominięciem i reduced motion;
- kalkulator 5 typów nadwozia i 8 usług z rozbiciem ceny;
- trwały koszyk w localStorage z animowanym kołem i rozdzieleniem usług/produktów;
- katalog demonstracyjny: wyszukiwanie, kategorie, sortowanie, stany magazynowe;
- rezerwacje z walidacją Zod, kontrolą dostępności i unikalnym slotem PostgreSQL;
- checkout z walidacją cen po stronie serwera, Stripe Checkout i podpisanym webhookiem;
- InPost, DHL, DPD i Poczta Polska; prawdziwe punkty wyłącznie przez oficjalny adapter API;
- galeria z porównaniem przed/po, filtrami i lightboxem;
- sesja administratora HTTP-only i dane operacyjne z Prisma;
- bezpieczne, jawne stany demonstracyjne bez kluczy zewnętrznych.

## Uruchomienie

Wymagania: Node.js 20+, pnpm 10+ i PostgreSQL 16+ (lub Docker).

```bash
pnpm install
copy .env.example .env.local
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Na macOS/Linux użyj `cp .env.example .env.local`. Aplikacja otworzy się pod `http://localhost:3000`.

Bez `DATABASE_URL` można oglądać publiczne strony, kalkulator, sklep, koszyk i jawny tryb demo płatności. Rezerwacje nie pokazują wtedy fikcyjnych terminów.

## Skrypty jakości

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm check
```

Testy domenowe obejmują kalkulator, koszyk, katalog, rezerwacje, checkout, integracje, autoryzację i decyzję intro.

## Dane i bezpieczeństwo

- Ceny są przechowywane jako pełne PLN w tej wersji demonstracyjnej; integracja Stripe konwertuje je do groszy dopiero po ponownej walidacji serwerowej.
- Numer karty i CVV nigdy nie trafiają do ApexDetail.
- Dane osobowe są ograniczone do realizacji rezerwacji/zamówienia. Przed wdrożeniem należy uzupełnić dane administratora RODO, retencję i regulaminy.
- Sekrety są wyłącznie w zmiennych środowiskowych. Nie commituj `.env.local`.

## Integracje i wdrożenie

Pełna konfiguracja znajduje się w [docs/INTEGRATIONS.md](docs/INTEGRATIONS.md). Zalecane wdrożenie: Vercel lub Node.js container + zarządzany PostgreSQL. W pipeline wykonaj:

```bash
pnpm install --frozen-lockfile
pnpm db:generate
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm prisma migrate deploy
```

## Zasoby wizualne

Pliki `public/generated/apexdetail-hero.png`, `apexdetail-racing-car.png` i `apexdetail-products.png` zostały wygenerowane specjalnie dla tego projektu za pomocą wbudowanego narzędzia ImageGen. Są oryginalnymi materiałami demonstracyjnymi bez logo producentów. Galeria i adres studia są wyraźnie demonstracyjne i wymagają podmiany przed publikacją.

## Znane ograniczenia

- Płatności, mapa, punkty odbioru i e-mail wymagają prawdziwych kluczy/umów.
- Rozbudowane CRUD produktów, grafików i upload galerii wymagają uzgodnienia produkcyjnego magazynu plików i polityki retencji; modele Prisma i chronione granice API są przygotowane.
- Adres studia oraz katalog produktów to dane demonstracyjne.
