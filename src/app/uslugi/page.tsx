import { PageShell } from "@/components/page-shell";
import Link from "next/link";
import { SERVICES, formatPln } from "@/lib/pricing";
export default function ServicesPage() { return <PageShell eyebrow="Zakres prac" title="Usługi dopasowane do stanu samochodu." description="Każdą usługę rozpoczynamy od oględzin, pomiarów i ustalenia oczekiwanego efektu."><section className="content-section shell"><div className="service-cards">{SERVICES.map((service) => <article key={service.id}><p>{service.name}</p><h2>{formatPln(service.price)}</h2><span>{service.description}</span></article>)}</div><div className="mt-10"><Link href="/kalkulator" className="button">Oblicz zakres i cenę</Link></div></section></PageShell>; }
