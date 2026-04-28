"use client";

import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ReviewCardProps {
  review: {
    id: string;
    student_name: string | null;
    rating: number;
    comment: string;
    created_at: string;
    courses?: { name: string } | null;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const fullStars = Math.floor(review.rating);
  const hasHalfStar = review.rating % 1 !== 0;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-foreground">
            {review.student_name || "Anónimo"}
          </h4>
          {review.courses && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Curso: {review.courses.name}
            </p>
          )}
        </div>
        <div className="flex items-center text-yellow-500">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
          {hasHalfStar && (
            <div className="relative w-4 h-4">
              <Star className="w-4 h-4 absolute" />
              <div className="overflow-hidden w-[50%] absolute h-full">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-sm text-foreground/80 italic mb-4 flex-1">
        &quot;{review.comment}&quot;
      </p>
      
      <p className="text-xs text-muted-foreground mt-auto">
        Hace {formatDistanceToNow(new Date(review.created_at), { locale: es })}
      </p>
    </div>
  );
}
