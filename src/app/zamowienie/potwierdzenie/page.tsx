import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
export default function OrderConfirmationPage() { return <main className="confirmation-page"><div className="surface"><CheckCircle2 /><p className="eyebrow">Płatność przyjęta przez Stripe</p><h1>Zamówienie zostało zarejestrowane.</h1><p className="muted">Status zostanie ostatecznie potwierdzony po zweryfikowaniu podpisanego webhooka Stripe.</p><Link href="/" className="button">Wróć na stronę główną</Link></div></main>; }

