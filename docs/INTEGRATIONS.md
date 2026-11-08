# Integracje ApexDetail

Wszystkie integracje są domyślnie wyłączone. Aplikacja nie udaje płatności, dostępności, wysłania e-maila ani istnienia punktu odbioru.

## PostgreSQL i Prisma

1. Uruchom `docker compose up -d postgres` lub użyj zarządzanej bazy PostgreSQL.
2. Skopiuj `.env.example` do `.env.local` i ustaw `DATABASE_URL`.
3. Wykonaj `pnpm db:generate`, `pnpm db:migrate` oraz `pnpm db:seed`.
4. Dla konta administratora ustaw tymczasowo `ADMIN_EMAIL` i `ADMIN_PASSWORD` podczas seedowania. W produkcji usuń `ADMIN_PASSWORD` po utworzeniu hasha.

Unikalne pole `Booking.slotKey` zapobiega podwójnej rezerwacji nawet przy równoległych żądaniach. Migracje produkcyjne należy wykonywać przez `prisma migrate deploy`.

## Stripe

1. Utwórz konto Stripe i włącz PLN.
2. Ustaw `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` i publiczny `NEXT_PUBLIC_APP_URL`.
3. Skieruj webhook na `POST /api/stripe/webhook`.
4. Nasłuchiwane zdarzenia: `checkout.session.completed` oraz `checkout.session.expired`.

Checkout używa wyłącznie sesji Stripe. Aplikacja nie widzi i nie zapisuje numerów kart ani CVV. Apple Pay i Google Pay są prezentowane przez Stripe tylko na obsługiwanych urządzeniach, domenach i przeglądarkach. Bez sekretu endpoint zwraca jawny wynik `mode: demo` i nie tworzy obciążenia.

## Google Maps i punkty odbioru

Ustaw `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` z ograniczeniem HTTP referrer do domeny wdrożenia. Widok używa Google Maps Embed do prezentacji wybranego punktu.

Punkty muszą pochodzić z oficjalnego API przewoźnika lub zakontraktowanego agregatora. Ustaw:

- `PICKUP_PROVIDER_API_URL` — endpoint proxy przyjmujący `?q=<miasto-lub-kod>`;
- `PICKUP_PROVIDER_TOKEN` — sekret przekazywany tylko po stronie serwera.

Oczekiwany znormalizowany format odpowiedzi:

```json
{"points":[{"id":"WAW01A","name":"Paczkomat WAW01A","address":"ul. ...","lat":52.1,"lng":21.0}]}
```

Bez obu danych platforma zwraca 503 i pustą listę. Nie zawiera fikcyjnych lokalizacji.

## E-mail

Adapter `sendTransactionalEmail` wysyła JSON przez HTTP do dostawcy ustawionego jako `EMAIL_API_URL`, z tokenem Bearer `EMAIL_API_TOKEN`. Oczekuje pól `from`, `to`, `subject`, `text`. Dostosuj adapter do Resend, Postmark, Mailgun albo infrastruktury klienta. Bez konfiguracji status rezerwacji pozostaje `NOT_CONFIGURED`.

## Administracja

- `AUTH_SECRET`: co najmniej 32 losowe bajty, np. z bezpiecznego generatora sekretów platformy wdrożeniowej.
- `ADMIN_EMAIL`: login administratora.
- `ADMIN_PASSWORD_HASH`: hash bcrypt używany przez endpoint logowania.

Sesja jest podpisanym JWT w ciasteczku HTTP-only, `SameSite=Strict`, `Secure` w produkcji. Middleware chroni `/admin/*` i `/api/admin/*`.

## Galeria i pliki

Kod zawiera model `GalleryImage`, ale docelowy upload wymaga uzgodnienia polityki retencji oraz magazynu obiektowego (np. S3/R2). Do czasu jego podłączenia nie należy przyjmować plików do lokalnego systemu plików środowiska serverless. Wygenerowane assety demonstracyjne w `public/generated` są częścią tego projektu i muszą zostać zastąpione autentycznymi realizacjami przed publikacją komercyjną.

