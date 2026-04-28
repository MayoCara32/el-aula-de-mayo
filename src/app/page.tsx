import { getActiveCourses, getApprovedReviews, getFinishedCourses, getCourseStats } from "@/actions/public";
import { CourseCard } from "@/components/CourseCard";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { FinishedCourseCarousel } from "@/components/FinishedCourseCarousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Sparkles, Archive } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [courses, reviews, finishedCourses] = await Promise.all([
    getActiveCourses(),
    getApprovedReviews(),
    getFinishedCourses()
  ]);

  const finishedCoursesWithStats = await Promise.all(
    finishedCourses.map(async (course) => {
      const stats = await getCourseStats(course.id);
      return { ...course, stats };
    })
  );

  return (
    <div className="selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-[100px] rounded-full" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-1.5 bg-background/50 backdrop-blur-md border border-white/10 rounded-full mb-8 shadow-2xl">
            <div className="w-12 h-12 relative overflow-hidden rounded-full mr-3 hidden sm:block">
              <Image 
                src="/logo.jpg" 
                alt="Castrejón Ramírez Marcos Guillermo" 
                fill 
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium tracking-tight px-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Castrejón Ramírez Marcos Guillermo
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            El aula de <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Mayo</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Docencia, acompañamiento académico y mejora continua.
            Un espacio diseñado para compartir conocimiento y evolucionar juntos.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Button size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105" asChild>
              <Link href="#courses">
                Ver Cursos Disponibles
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background/50 backdrop-blur hover:bg-accent/50 transition-all hover:scale-105" asChild>
              <Link href="#reviews">
                Leer Opiniones
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 relative overflow-hidden bg-card/10 border-b border-border/40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-white blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Opiniones Destacadas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Lo que dicen mis alumnos sobre su experiencia en el aula.
            </p>
          </div>

          <ReviewCarousel reviews={reviews.slice(0, 5)} />
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 bg-card/20 relative">
        <div className="absolute inset-0 border-y border-white/5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Cursos Disponibles</h2>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No hay cursos activos en este momento.</p>
          )}
        </div>
      </section>

      {/* Finished Courses Section */}
      {finishedCoursesWithStats.length > 0 && (
        <section className="py-24 relative overflow-hidden bg-background">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
                <Archive className="w-4 h-4" />
                Histórico
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Cursos Finalizados</h2>
              <p className="text-muted-foreground max-w-2xl">
                Explora el historial y rendimiento de mis cursos anteriores, basado en la experiencia real de los estudiantes.
              </p>
            </div>

            <FinishedCourseCarousel courses={finishedCoursesWithStats} />
          </div>
        </section>
      )}
    </div>
  );
}
