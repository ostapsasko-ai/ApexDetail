import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, MessageSquareQuote } from "lucide-react";

import { Marquee } from "@/components/magicui/marquee";
import { PageShell } from "@/components/page-shell";
import { ReviewCard } from "@/components/reviews/review-card";
import { REVIEWS } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Opinie | ApexDetail",
  description: "Demonstracyjny moduł opinii klientów studia detailingu ApexDetail."
};

const firstRow = REVIEWS.slice(0, REVIEWS.length / 2);
const secondRow = REVIEWS.slice(REVIEWS.length / 2);

export default function ReviewsPage() {
  return (
    <PageShell
      eyebrow="Głos po odbiorze auta"
      title="Jakość najlepiej opisuje się po przejechaniu pierwszych kilometrów."
      description="Poniższy moduł pokazuje docelowy sposób prezentacji zweryfikowanych opinii klientów — konkretnie, wraz z autem i wykonanym zakresem."
    >
      <section className="reviews-section" aria-labelledby="reviews-heading">
        <div className="shell">
          <div className="demo-banner reviews-demo-note" role="note">
            <strong><Info aria-hidden="true" /> Treści demonstracyjne</strong>
            <span>Przed publikacją wpisy należy zastąpić autentycznymi, zweryfikowanymi opiniami klientów.</span>
          </div>
          <h2 id="reviews-heading" className="sr-only">Przykładowe opinie klientów</h2>
        </div>

        <div className="reviews-stage">
          <Marquee
            pauseOnHover
            repeat={3}
            aria-label="Pierwszy rząd opinii — ustaw fokus, aby zatrzymać animację"
            className="[--duration:38s] [--gap:12px]"
          >
            {firstRow.map((review) => <ReviewCard key={review.id} review={review} />)}
          </Marquee>
          <Marquee
            reverse
            pauseOnHover
            repeat={3}
            aria-label="Drugi rząd opinii — ustaw fokus, aby zatrzymać animację"
            className="[--duration:44s] [--gap:12px]"
          >
            {secondRow.map((review) => <ReviewCard key={review.id} review={review} />)}
          </Marquee>
        </div>

        <div className="shell reviews-context">
          <MessageSquareQuote aria-hidden="true" />
          <p>Każda przyszła publikacja powinna wskazywać rzeczywisty zakres prac i pochodzić od klienta, który wyraził zgodę na jej wykorzystanie.</p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="reviews-cta">
          <div>
            <h2>Zobacz efekt na własnym samochodzie.</h2>
            <p>Oględziny pozwalają dobrać zakres, czas i ochronę do faktycznego stanu auta.</p>
          </div>
          <Link href="/rezerwacja" className="button">Umów oględziny <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </PageShell>
  );
}

