import { getCourseBySlug, getCourseStats, getApprovedReviews } from "@/actions/public";
import type { Metadata, ResolvingMetadata } from "next";
import { ReviewCard } from "@/components/ReviewCard";
import { Archive, ArrowLeft, Star, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import nextDynamic from "next/dynamic";

const RatingBarChart = nextDynamic(() => import("@/components/charts/RatingBarChart").then(mod => mod.RatingBarChart), { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">Cargando gráfica...</div> });
const RecommendPieChart = nextDynamic(() => import("@/components/charts/RecommendPieChart").then(mod => mod.RecommendPieChart), { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">Cargando gráfica...</div> });

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);
  
  if (!course) {
    return { title: "Reporte no encontrado" };
  }

  return {
    title: `Reporte: ${course.name}`,
    description: `Reporte de rendimiento y opiniones finales del curso: ${course.name}.`,
    openGraph: {
      title: `Reporte Histórico: ${course.name} | El aula de Mayo`,
      description: `Rendimiento final y opiniones de los alumnos del curso: ${course.name}.`,
      images: ['/logo.jpg'],
    },
  };
}

export default async function FinishedCoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);

  if (!course || course.is_active) {
    notFound(); // Only show finished (inactive) courses here
  }

  const [stats, reviews] = await Promise.all([
    getCourseStats(course.id),
    getApprovedReviews(course.id),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <Link href="/courses" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a todos los cursos
      </Link>
      
      {/* Header */}
      <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Archive className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-6">
            <Archive className="w-4 h-4" />
            Curso Finalizado
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{course.name}</h1>
          <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl">
            {course.description}
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <h2 className="text-2xl font-bold tracking-tight mb-6">Reporte de Rendimiento</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {/* KPI Card */}
        <div className="bg-card border border-border/50 rounded-xl p-8 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <Star className="w-8 h-8 fill-current" />
          </div>
          <div className="text-6xl font-black mb-2">{stats.average.toFixed(1)}</div>
          <p className="text-muted-foreground">Calificación Promedio</p>
          <div className="mt-8 pt-8 border-t border-border/50 w-full">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Users className="w-6 h-6" />
              <span className="text-3xl font-bold">{stats.total}</span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Alumnos históricos</p>
            <p className="text-muted-foreground/70 text-[10px] mt-1">Basado en {(stats as any).reviewCount} opiniones</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-center">Distribución de Estrellas</h3>
          <RatingBarChart distribution={stats.distribution} />
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-center">Nivel de Recomendación</h3>
          <RecommendPieChart recommendRate={stats.recommendRate} />
        </div>
      </div>

      {/* All Reviews */}
      <h2 className="text-2xl font-bold tracking-tight mb-6">Opiniones destacadas</h2>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-xl p-8 text-center">
          <p className="text-muted-foreground">No hay opiniones publicadas para este curso.</p>
        </div>
      )}
    </div>
  );
}
