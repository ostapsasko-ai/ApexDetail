import { PageShell } from "@/components/page-shell";
import { CartPageContent } from "@/components/cart/cart-page";
export default function CartPage() { return <PageShell eyebrow="Koszyk" title="Twój zestaw." description="Usługi i produkty są rozliczane osobno, żeby dostawa dotyczyła tylko przesyłek fizycznych."><CartPageContent /></PageShell>; }
