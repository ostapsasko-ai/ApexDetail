import { ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import React from "react";

import { CinematicHero } from "@/components/home/cinematic-hero";

export default function HomePage() {
  return (
    <main>
      <CinematicHero />

      <section className="content-section shell">
        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {[
            [ShieldCheck, "Ochrona", "Sprawdzone powłoki i protokół przygotowania powierzchni."],
            [Sparkles, "Wykończenie", "Kontrola pod światłem inspekcyjnym na każdym etapie."],
            [TimerReset, "Termin", "Realny czas pracy ustalony po oględzinach samochodu."]
          ].map(([Icon, title, copy], index) => {
            const FeatureIcon = Icon as typeof ShieldCheck;
            return (
              <article key={String(title)} className="group relative overflow-hidden bg-asphalt p-8 md:p-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-y-1/2 -left-1/2 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm motion-reduce:hidden"
                  style={{ animation: `featureShimmer 3.8s ease-in-out ${index * 0.55}s infinite` }}
                />
                <div className="relative z-10">
                  <FeatureIcon className="mb-8 text-signal" />
                  <h2 className="font-display text-2xl">{String(title)}</h2>
                  <p className="muted">{String(copy)}</p>
                </div>
              </article>
            );
          })}
        </div>
        <style>{`
          @keyframes featureShimmer {
            0%, 18% { transform: translateX(0) rotate(12deg); opacity: 0; }
            32% { opacity: 1; }
            62%, 100% { transform: translateX(600%) rotate(12deg); opacity: 0; }
          }
        `}</style>
      </section>
    </main>
  );
}

