import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TimerReset } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[calc(100vh-76px)] overflow-hidden border-b border-white/10">
        <Image src="/generated/apexdetail-hero.png" alt="Grafitowy samochód po detailingu w studiu ApexDetail" fill priority className="object-cover object-[66%_center]" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#08090b_0%,rgba(8,9,11,.94)_30%,rgba(8,9,11,.18)_76%)]" />
        <div className="shell relative z-10 flex min-h-[calc(100vh-76px)] items-center py-20">
          <div className="max-w-[650px]">
            <p className="eyebrow">Warszawa · studio ochrony i renowacji</p>
            <h1 className="m-0 font-display text-[clamp(58px,9vw,126px)] font-extrabold leading-[.82] tracking-[-.055em]">Precyzja, którą widać w świetle.</h1>
            <p className="mt-8 max-w-[590px] text-lg text-zinc-300 md:text-xl">Korekta lakieru, powłoki ceramiczne i wnętrza prowadzone jak proces techniczny — bez skrótów i przypadkowych obietnic.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/rezerwacja" className="button">Umów oględziny <ArrowRight size={18} /></Link>
              <Link href="/kalkulator" className="button button--secondary">Oblicz cenę</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {[
            [ShieldCheck, "Ochrona", "Sprawdzone powłoki i protokół przygotowania powierzchni."],
            [Sparkles, "Wykończenie", "Kontrola pod światłem inspekcyjnym na każdym etapie."],
            [TimerReset, "Termin", "Realny czas pracy ustalony po oględzinach samochodu."]
          ].map(([Icon, title, copy]) => {
            const FeatureIcon = Icon as typeof ShieldCheck;
            return <article key={String(title)} className="bg-asphalt p-8 md:p-10"><FeatureIcon className="mb-8 text-signal" /><h2 className="font-display text-2xl">{String(title)}</h2><p className="muted">{String(copy)}</p></article>;
          })}
        </div>
      </section>
    </main>
  );
}

