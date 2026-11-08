import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return <main className="confirmation-page"><div className="surface"><CheckCircle2 /><p className="eyebrow">Rezerwacja zapisana</p><h1>Dziękujemy. Termin czeka na potwierdzenie studia.</h1><p>Numer rezerwacji: <strong>{ref ?? "—"}</strong></p><p className="muted">Wiadomość e-mail jest wysyłana tylko wtedy, gdy integracja pocztowa została skonfigurowana.</p><Link href="/" className="button">Wróć na stronę główną</Link></div></main>;
}
