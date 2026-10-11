import { Star } from "lucide-react";

export function TestimonialCard({
  quote,
  author,
  role,
  rating = 5,
}: {
  quote: string;
  author: string;
  role?: string | null;
  rating?: number;
}) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex gap-0.5" aria-label={`${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < rating
                ? "h-4 w-4 fill-gold text-gold"
                : "h-4 w-4 text-border-strong"
            }
          />
        ))}
      </div>
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
        “{quote}”
      </blockquote>
      <figcaption className="mt-5 border-t border-border pt-4">
        <p className="text-sm font-semibold text-foreground">{author}</p>
        {role && <p className="text-xs text-muted">{role}</p>}
      </figcaption>
    </figure>
  );
}
