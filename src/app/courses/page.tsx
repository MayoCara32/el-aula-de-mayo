import { getActiveCourses, getFinishedCourses } from "@/actions/public";
import { CourseCard } from "@/components/CourseCard";
import { GraduationCap, Archive } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const [courses, finishedCourses] = await Promise.all([
    getActiveCourses(),
    getFinishedCourses()
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Cursos Activos</h1>
        </div>
        
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-20 bg-card rounded-xl border border-border/50">
            No hay cursos activos en este momento.
          </p>
        )}
      </div>

      <div className="pt-10 border-t border-border/50">
        <div className="flex items-center gap-3 mb-8">
          <Archive className="w-8 h-8 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight text-muted-foreground">Histórico (Finalizados)</h2>
        </div>
        
        {finishedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80 hover:opacity-100 transition-opacity">
            {finishedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Aún no hay cursos finalizados en el historial.
          </p>
        )}
      </div>
    </div>
  );
}
