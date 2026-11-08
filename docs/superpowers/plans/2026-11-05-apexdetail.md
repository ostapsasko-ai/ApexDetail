# ApexDetail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zbudować gotową do uruchomienia, wielostronicową platformę premium auto-detailingu z działającym kalkulatorem, koszykiem, rezerwacjami, sklepem, checkoutem i panelem admina.

**Architecture:** Next.js App Router rozdziela publiczny interfejs, granice API i chroniony panel. Czyste funkcje domenowe są testowane bez infrastruktury; Prisma/PostgreSQL zapewnia docelową persystencję, a integracje zewnętrzne działają przez jawne adaptery i bezpieczne stany demonstracyjne.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion, GSAP, Lucide React, Prisma/PostgreSQL, Stripe, Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-05-apexdetail-design.md`

## Global Constraints

- Cała treść klienta jest po polsku; ceny są w PLN.
- Aplikacja ma trasy `/`, `/uslugi`, `/kalkulator`, `/rezerwacja`, `/sklep`, `/koszyk`, `/zamowienie`, `/galeria`, `/o-nas`, `/kontakt`, `/admin`.
- Nie wolno udawać prawdziwej dostępności, płatności, wiadomości e-mail ani punktów odbioru.
- Intro gra raz na sesję, można je pominąć i szanuje `prefers-reduced-motion`.
- Koszyk odróżnia usługi od produktów i utrwala się po przeładowaniu.
- Wszystkie wejścia serwera są walidowane Zod, funkcje admina wymagają autoryzacji.

## Review Focus

- Pusty wybór usług nie może utworzyć wyceny ani rezerwacji — test w zadaniu 2 i 5.
- Usługi nie mogą generować kosztu lub formularza wysyłki — test w zadaniu 3 i 6.
- Jednoczesna próba rezerwacji tego samego slotu musi zakończyć się konfliktem — test w zadaniu 5.
- Brak danych integracji nie może wyglądać jak sukces produkcyjny — test w zadaniu 6.
- Nieautoryzowany dostęp do `/admin` i endpointów administracyjnych musi być odrzucony — test w zadaniu 7.

---

### Task 1: Fundament, motyw i szkielet tras

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/page-shell.tsx`
- Create: publiczne pliki stron wymienione w Global Constraints
- Test: `src/lib/navigation.test.ts`

**Interfaces:**
- Produces: `NAV_ITEMS`, `PageShell`, wspólne tokeny CSS i komplet routingu.

- [ ] Napisz test, który wymaga wszystkich tras i unikalnych etykiet nawigacji.
- [ ] Uruchom `pnpm test -- src/lib/navigation.test.ts` i potwierdź oczekiwaną porażkę.
- [ ] Dodaj minimalną konfigurację projektu, dane nawigacji, layout, nagłówek, stopkę i szkielety stron.
- [ ] Uruchom test ponownie i potwierdź sukces.

### Task 2: Konfigurowalny kalkulator usług

**Files:**
- Create: `src/lib/pricing.ts`, `src/lib/pricing.test.ts`, `src/components/calculator/service-calculator.tsx`
- Modify: `src/app/kalkulator/page.tsx`, `src/app/uslugi/page.tsx`

**Interfaces:**
- Produces: `VehicleType`, `ServiceDefinition`, `calculateEstimate(vehicle, serviceIds)`, `formatPln`.

- [ ] Napisz testy literalnych sum dla hatchbacka, sedana, kombi, coupe i SUV-a oraz pustego/nieznanego wyboru.
- [ ] Uruchom test i potwierdź porażkę z braku implementacji.
- [ ] Zaimplementuj dane i czystą funkcję wyceny, a potem interaktywny, animowany kalkulator.
- [ ] Uruchom testy kalkulatora i całą suitę.

### Task 3: Koszyk koło i trwały stan

**Files:**
- Create: `src/lib/cart.ts`, `src/lib/cart.test.ts`, `src/components/cart/cart-provider.tsx`, `src/components/cart/wheel-cart.tsx`, `src/components/cart/cart-drawer.tsx`
- Modify: `src/app/layout.tsx`, `src/app/koszyk/page.tsx`, `src/components/calculator/service-calculator.tsx`

**Interfaces:**
- Produces: `CartItem`, `cartReducer`, `getCartTotals`, `useCart()`.

- [ ] Napisz testy dodawania, zwiększania, usuwania, sumowania i oddzielenia produktów od usług.
- [ ] Potwierdź RED.
- [ ] Zaimplementuj reducer, localStorage hydration, koło z animacją i dostępny drawer.
- [ ] Potwierdź GREEN i pełną suitę.

### Task 4: Katalog i galeria

**Files:**
- Create: `src/lib/catalog.ts`, `src/components/store/storefront.tsx`, `src/components/gallery/gallery-grid.tsx`, `src/components/gallery/comparison-slider.tsx`
- Modify: `src/app/sklep/page.tsx`, `src/app/galeria/page.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `useCart()`.
- Produces: demonstracyjne `PRODUCTS`, wyszukiwanie, filtry, sortowanie, lightbox i porównanie przed/po.

- [ ] Napisz test zachowania filtrów i sortowania katalogu.
- [ ] Potwierdź RED.
- [ ] Zaimplementuj katalog, karty, galerię, porównanie i ekran główny z wygenerowanymi zasobami.
- [ ] Potwierdź GREEN i pełną suitę.

### Task 5: Rezerwacje i odporność na konflikty

**Files:**
- Create: `src/lib/booking.ts`, `src/lib/booking.test.ts`, `src/components/booking/booking-form.tsx`
- Create: `src/app/api/availability/route.ts`, `src/app/api/bookings/route.ts`, `src/app/rezerwacja/potwierdzenie/page.tsx`
- Modify: `src/app/rezerwacja/page.tsx`, `prisma/schema.prisma`

**Interfaces:**
- Produces: `bookingSchema`, `isSlotAvailable`, POST `/api/bookings`, GET `/api/availability`.

- [ ] Napisz testy walidacji wymaganych pól, pustych usług, daty w przeszłości i konfliktu slotu.
- [ ] Potwierdź RED.
- [ ] Dodaj modele Prisma, atomowe sprawdzenie slotu, formularz i stronę potwierdzenia.
- [ ] Potwierdź GREEN i pełną suitę.

### Task 6: Checkout, wysyłka i integracje

**Files:**
- Create: `src/lib/checkout.ts`, `src/lib/checkout.test.ts`, `src/lib/integrations.ts`
- Create: `src/components/checkout/checkout-form.tsx`, `src/components/checkout/pickup-map.tsx`
- Create: `src/app/api/checkout/route.ts`, `src/app/api/stripe/webhook/route.ts`, `src/app/api/pickup-points/route.ts`
- Modify: `src/app/zamowienie/page.tsx`, `.env.example`

**Interfaces:**
- Produces: `checkoutSchema`, `getIntegrationMode`, bezpieczny endpoint Stripe i endpoint punktów odbioru.

- [ ] Napisz testy: usługi bez dostawy, produkt wymagający metody, adres kurierski, punkt odbioru i jawny tryb demo bez kluczy.
- [ ] Potwierdź RED.
- [ ] Zaimplementuj checkout, karty metod, warunkową mapę, Stripe i webhook.
- [ ] Potwierdź GREEN i pełną suitę.

### Task 7: Uwierzytelnienie i panel administratora

**Files:**
- Create: `src/lib/auth.ts`, `src/lib/auth.test.ts`, `src/app/admin/login/page.tsx`, `src/app/admin/actions.ts`, `src/app/admin/admin-dashboard.tsx`
- Create: `src/app/api/admin/session/route.ts`, `src/app/api/admin/prices/route.ts`
- Modify: `src/app/admin/page.tsx`, `src/middleware.ts`, `prisma/schema.prisma`

**Interfaces:**
- Produces: podpisana sesja HTTP-only, `requireAdmin`, widoki zarządzania.

- [ ] Napisz test odrzucenia braku/błędnej roli oraz akceptacji ważnej sesji.
- [ ] Potwierdź RED.
- [ ] Zaimplementuj logowanie demonstracyjne skonfigurowane env, middleware i dashboard.
- [ ] Potwierdź GREEN i pełną suitę.

### Task 8: Intro, motion, dostępność i pozostałe treści

**Files:**
- Create: `src/components/intro/racing-intro.tsx`, `src/components/motion/page-transition.tsx`, `src/app/loading.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx`
- Modify: `src/app/layout.tsx`, publiczne strony informacyjne i `src/app/globals.css`

**Interfaces:**
- Produces: intro raz na sesję, skip, reduced-motion, skeletony, komplet polskich treści i metadanych.

- [ ] Napisz test funkcji decydującej, czy intro ma się uruchomić dla stanu sesji i reduced motion.
- [ ] Potwierdź RED.
- [ ] Zaimplementuj intro GSAP, przejścia Motion, stany błędów/puste i treści stron.
- [ ] Potwierdź GREEN i pełną suitę.

### Task 9: Dane, seed, dokumentacja i pakowanie

**Files:**
- Create: `prisma/seed.ts`, `README.md`, `docs/INTEGRATIONS.md`
- Modify: `package.json`, `.gitignore`

**Interfaces:**
- Produces: seed demonstracyjny, instrukcje instalacji, zmienne, wdrożenie i skrypty kontroli jakości.

- [ ] Dodaj seed dla usług, produktów, dostępności i konta demo bez sekretów w repozytorium.
- [ ] Dodaj instrukcje PostgreSQL, Stripe, Google Maps, przewoźników i e-maili.
- [ ] Uruchom `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- [ ] Napraw każdą wykrytą regresję test-first i powtórz pełną weryfikację.
- [ ] Utwórz ZIP w `outputs/`, pomijając `node_modules`, `.next`, pliki env i artefakty tymczasowe.
