import Link from "next/link";
import { Button } from "./ui/button";
import { BookOpen, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { parseISO } from "date-fns"; // BUG-11: parseISO evita desfase de zona horaria
import { es } from "date-fns/locale";

interface CourseCardProps {
  course: {
    id: string;
    name: string;
    slug: string;
    description: string | null; // BUG-10 fix: puede ser null en la BD
    date: string | null;
    duration: string | null;
    is_active: boolean;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-border hover:shadow-md">
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 tracking-tight">{course.name}</h3>
        <p className="text-muted-foreground text-sm flex-1 mb-6 line-clamp-3">
          {/* BUG-10 fix: fallback para descripción nula */}
          {course.description || "Sin descripción disponible."}
        </p>
        
        <div className="space-y-2 mb-6 text-sm text-muted-foreground">
          {course.date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {/* BUG-11 fix: parseISO evita desfase de un día en zonas horarias con offset negativo */}
              <span>{format(parseISO(course.date), "dd 'de' MMMM, yyyy", { locale: es })}</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{course.duration.toLowerCase().includes('hora') ? course.duration : `${course.duration} horas`}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          {course.is_active ? (
            <>
              <Button asChild className="w-full">
                <Link href={`/courses/${course.slug}`}>Ver detalles</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/courses/${course.slug}/review`}>Calificar curso</Link>
              </Button>
            </>
          ) : (
            <Button asChild className="w-full" variant="secondary">
              <Link href={`/courses/finished/${course.slug}`}>Ver Reporte Final</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
