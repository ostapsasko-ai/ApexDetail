import { PageShell } from "@/components/page-shell";
import { CheckoutForm } from "@/components/checkout/checkout-form";
export default function CheckoutPage() { return <PageShell eyebrow="Dostawa i płatność" title="Bezpieczne zamówienie." description="Dane płatnicze obsługuje Stripe. ApexDetail nigdy nie przechowuje numeru karty ani CVV."><section className="content-section shell"><CheckoutForm /></section></PageShell>; }
