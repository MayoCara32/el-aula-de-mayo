import { getAdminCourses, toggleCourseActive, deleteCourse } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { parseISO } from "date-fns"; // BUG-11: parseISO evita desfase de zona horaria
import { es } from "date-fns/locale";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Power, PowerOff } from "lucide-react";

export const revalidate = 0; // Force dynamic for admin pages

export default async function AdminCoursesPage() {
  const courses = await getAdminCourses();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground">Gestiona los cursos disponibles en la plataforma.</p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nuevo Curso
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Nombre del Curso</th>
                  <th className="px-6 py-4 font-medium">Fecha / Duración</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course: any) => (
                    <tr key={course.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                      <td className="px-6 py-4 font-medium">
                        {course.name}
                        <div className="text-xs text-muted-foreground font-normal mt-1">/{course.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="whitespace-nowrap">
                          {/* BUG-11 fix: parseISO en vez de new Date() para fechas YYYY-MM-DD */}
                          {course.date ? format(parseISO(course.date), "dd MMM yyyy", { locale: es }) : "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">{course.duration || "Sin duración"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                          }`}>
                            {course.is_active ? "Activo" : "Finalizado"}
                          </span>
                          {course.is_active && course.date && new Date(course.date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500" title="La fecha de inicio fue hace más de 30 días. Considere finalizarlo.">
                              Posiblemente concluido
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Toggle Active Action */}
                          <form action={async () => {
                            "use server";
                            await toggleCourseActive(course.id, !course.is_active);
                          }}>
                            <Button size="icon" variant="ghost" title={course.is_active ? "Finalizar (Desactivar)" : "Reactivar"}>
                              {course.is_active ? <PowerOff className="w-4 h-4 text-muted-foreground" /> : <Power className="w-4 h-4 text-green-500" />}
                            </Button>
                          </form>
                          
                          {/* Edit Action */}
                          <Button size="icon" variant="ghost" asChild>
                            <Link href={`/admin/courses/${course.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          
                          {/* Delete Action */}
                          <form action={async () => {
                            "use server";
                            await deleteCourse(course.id);
                          }}>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No hay cursos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
