"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/actions/reviews";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

interface Course {
  id: string;
  name: string;
}

export function ReviewForm({ course }: { course: Course }) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [studentName, setStudentName] = useState("");
  const [comment, setComment] = useState("");
  const [likedMost, setLikedMost] = useState("");
  const [improvementSuggestion, setImprovementSuggestion] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Anti-duplicate logic
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    // BUG-19 fix: usar crypto.randomUUID() para identificadores más seguros
    let storedId = localStorage.getItem("aula_visitor_id");
    if (!storedId) {
      storedId = "vis_" + crypto.randomUUID();
      localStorage.setItem("aula_visitor_id", storedId);
    }
    setVisitorId(storedId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorId) {
      // BUG-07 fix: informar al usuario en vez de fallar silenciosamente
      toast.error("Error de identificación. Recarga la página e intenta de nuevo.");
      setError("Error de identificación. Por favor recarga la página.");
      return;
    }
    if (rating === 0) {
      toast.error("Por favor, selecciona una calificación.");
      setError("Por favor, selecciona una calificación.");
      return;
    }
    if (!comment || !likedMost || !improvementSuggestion || wouldRecommend === null) {
      toast.error("Por favor, completa todas las preguntas obligatorias.");
      setError("Por favor, completa todas las preguntas obligatorias.");
      return;
    }
    if (!consentAccepted) {
      toast.error("Debes aceptar el consentimiento para enviar tu opinión.");
      setError("Debes aceptar el consentimiento para enviar tu opinión.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const loadingToast = toast.loading("Enviando opinión...");

    const result = await submitReview({
      course_id: course.id,
      visitor_id: visitorId,
      student_name: studentName,
      rating,
      comment,
      liked_most: likedMost,
      improvement_suggestion: improvementSuggestion,
      would_recommend: wouldRecommend,
      consent_accepted: consentAccepted,
    });

    setIsLoading(false);

    if (result.success) {
      toast.dismiss(loadingToast);
      toast.success("¡Gracias! Tu opinión ha sido enviada y está pendiente de revisión.");
      router.push("/thanks");
    } else {
      toast.dismiss(loadingToast);
      toast.error(result.message || "Hubo un error al enviar tu opinión.");
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border/50 p-6 sm:p-10 rounded-2xl shadow-sm">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Calificación general <span className="text-destructive">*</span>
        </label>
        <div className="flex gap-1" onMouseLeave={() => setHoveredRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="relative cursor-pointer">
              <div className="flex">
                {/* BUG-08 fix: botones accesibles con ARIA y soporte de teclado */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Calificar ${star - 0.5} de 5 estrellas`}
                  className="w-4 h-8 z-10"
                  onMouseEnter={() => setHoveredRating(star - 0.5)}
                  onClick={() => setRating(star - 0.5)}
                  onKeyDown={(e) => e.key === 'Enter' && setRating(star - 0.5)}
                />
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Calificar ${star} de 5 estrellas`}
                  className="w-4 h-8 z-10"
                  onMouseEnter={() => setHoveredRating(star)}
                  onClick={() => setRating(star)}
                  onKeyDown={(e) => e.key === 'Enter' && setRating(star)}
                />
              </div>
              <Star
                className={cn(
                  "absolute top-0 left-0 w-8 h-8 pointer-events-none transition-colors",
                  (hoveredRating || rating) >= star ? "fill-yellow-500 text-yellow-500" :
                  (hoveredRating || rating) >= star - 0.5 ? "fill-yellow-500/50 text-yellow-500" : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
            </div>
          ))}
          <span className="ml-4 text-xl font-bold">{hoveredRating || rating} / 5</span>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          ¿Qué te pareció el curso? <span className="text-destructive">*</span>
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full min-h-[100px] p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Escribe tu opinión general..."
          required
        />
      </div>

      {/* Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="likedMost" className="block text-sm font-medium mb-2">
            ¿Qué fue lo que más te gustó del curso? <span className="text-destructive">*</span>
          </label>
          <textarea
            id="likedMost"
            value={likedMost}
            onChange={(e) => setLikedMost(e.target.value)}
            className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="improvementSuggestion" className="block text-sm font-medium mb-2">
            ¿Qué mejorarías del curso? <span className="text-destructive">*</span>
          </label>
          <textarea
            id="improvementSuggestion"
            value={improvementSuggestion}
            onChange={(e) => setImprovementSuggestion(e.target.value)}
            className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      {/* Would recommend */}
      <div>
        <label className="block text-sm font-medium mb-3">
          ¿Recomendarías este curso? <span className="text-destructive">*</span>
        </label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={wouldRecommend === true ? "default" : "outline"}
            onClick={() => setWouldRecommend(true)}
          >
            Sí
          </Button>
          <Button
            type="button"
            variant={wouldRecommend === false ? "destructive" : "outline"}
            onClick={() => setWouldRecommend(false)}
          >
            No
          </Button>
        </div>
      </div>

      {/* Name (Optional) */}
      <div>
        <label htmlFor="studentName" className="block text-sm font-medium mb-2">
          Tu nombre (Opcional)
        </label>
        <input
          type="text"
          id="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Anónimo"
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consent"
          checked={consentAccepted}
          onChange={(e) => setConsentAccepted(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary"
          required
        />
        <label htmlFor="consent" className="text-sm text-muted-foreground">
          Acepto que mi opinión pueda ser revisada y publicada de forma total o parcial en esta página. <span className="text-destructive">*</span>
        </label>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading || rating === 0}>
        {isLoading ? "Enviando..." : "Enviar opinión"}
      </Button>
    </form>
  );
}
