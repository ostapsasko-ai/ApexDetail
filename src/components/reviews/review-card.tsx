import { Star, Wrench } from "lucide-react";

import type { Review } from "@/lib/reviews";

type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <figure className="review-card">
      <header className="review-card__header">
        <div className="review-card__person">
          <span aria-hidden="true">{review.name.charAt(0)}</span>
          <div>
            <figcaption>{review.name}</figcaption>
            <p>{review.vehicle}</p>
          </div>
        </div>
        <div className="review-card__rating" role="img" aria-label={`Ocena ${review.rating} na 5`}>
          {Array.from({ length: review.rating }, (_, index) => (
            <Star key={index} aria-hidden="true" fill="currentColor" />
          ))}
        </div>
      </header>

      <blockquote>„{review.body}”</blockquote>

      <footer>
        <span><Wrench aria-hidden="true" /> {review.service}</span>
        <b>DEMO</b>
      </footer>
    </figure>
  );
}

