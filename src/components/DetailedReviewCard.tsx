"use client";

import { Star, ThumbsUp, ThumbsDown, Lightbulb, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface DetailedReviewCardProps {
  review: {
    id: string;
    student_name: string | null;
    rating: number;
    comment: string;
    would_recommend?: boolean;
    improvement_suggestion?: string | null;
    liked_most?: string | null;
    created_at: string;
  };
}

export function DetailedReviewCard({ review }: DetailedReviewCardProps) {
  const fullStars = Math.floor(review.rating);
  const hasHalfStar = review.rating % 1 !== 0;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col h-full w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-foreground">
            {review.student_name || "Anónimo"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hace {formatDistanceToNow(new Date(review.created_at), { locale: es })}
          </p>
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
      
      <div className="flex-1 space-y-4">
        {/* Comment */}
        <div>
          <p className="text-sm text-foreground/90 italic">
            &quot;{review.comment}&quot;
          </p>
        </div>

        {/* Liked Most */}
        {review.liked_most && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-foreground">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Lo que más le gustó
            </div>
            <p className="text-xs text-muted-foreground">
              {review.liked_most}
            </p>
          </div>
        )}

        {/* Improvement Suggestion */}
        {review.improvement_suggestion && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-foreground">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Sugerencia de mejora
            </div>
            <p className="text-xs text-muted-foreground">
              {review.improvement_suggestion}
            </p>
          </div>
        )}
      </div>

      {/* Would Recommend */}
      {review.would_recommend !== undefined && review.would_recommend !== null && (
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
          {review.would_recommend ? (
            <>
              <ThumbsUp className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-500">Recomienda este curso</span>
            </>
          ) : (
            <>
              <ThumbsDown className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">No recomienda este curso</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
