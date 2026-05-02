import { getCourseBySlug, getCourseStats, getApprovedReviews } from "@/actions/public";
import type { Metadata, ResolvingMetadata } from "next";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Star, PenLine, Share2 } from "lucide-react";
import { format } from "date-fns";
import { parseISO } from "date-fns"; // BUG-11: parseISO evita desfase de zona horaria
import { es } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);
  
  if (!course) {
    return { title: "Curso no encontrado" };
  }

  return {
    title: course.name,
    description: course.description ? course.description.substring(0, 160) + "..." : "Curso de El aula de Mayo",
    openGraph: {
      title: `${course.name} | El aula de Mayo`,
      description: course.description ? course.description.substring(0, 160) + "..." : "Curso de El aula de Mayo",
      images: ['/logo.jpg'],
    },
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const [stats, reviews] = await Promise.all([
    getCourseStats(course.id),
    getApprovedReviews(course.id),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
      <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 mb-12 shadow-sm">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{course.name}</h1>
        
        <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground text-sm">
          {course.date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {/* BUG-11: parseISO evita desfase de un día en zonas horarias negativas */}
              <span>{format(parseISO(course.date), "dd 'de' MMMM, yyyy", { locale: es })}</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>{course.duration}</span>
            </div>
          )}
        </div>

        <p className="text-lg text-foreground/90 leading-relaxed mb-10">
          {course.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href={`/courses/${course.slug}/review`}>
              <PenLine className="w-4 h-4 mr-2" />
              Calificar curso
            </Link>
          </Button>
          {/* A simple client component could handle the share action */}
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href={`https://api.whatsapp.com/send?text=Te%20comparto%20este%20curso:%20${course.name}%0Ahttps://elaulademayo.vercel.app/courses/${course.slug}`} target="_blank">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir por WhatsApp
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar with Stats */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Estadísticas</h3>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-5xl font-black">{stats.average.toFixed(1)}</span>
              <div className="flex flex-col pb-1">
                <div className="flex text-yellow-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(stats.average) ? 'fill-current' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{stats.total} opiniones aprobadas</span>
              </div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                // BUG-06 fix: usar reviewCount (reseñas reales) no total (alumnos)
                const count = stats.distribution[rating as keyof typeof stats.distribution] || 0;
                const reviewCount = (stats as any).reviewCount ?? 0;
                const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center text-sm">
                    <span className="w-3">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-500 mx-2" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground text-xs">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold mb-6">Opiniones de alumnos</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="bg-card border border-border/50 rounded-xl p-8 text-center">
              <p className="text-muted-foreground mb-4">Sé el primero en dejar una opinión para este curso.</p>
              <Button variant="outline" asChild>
                <Link href={`/courses/${course.slug}/review`}>Calificar ahora</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
