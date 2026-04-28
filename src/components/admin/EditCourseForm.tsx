"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCourse } from "@/actions/admin";
import Link from "next/link";

export function EditCourseForm({ course }: { course: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      date: formData.get("date") as string,
      duration: formData.get("duration") as string,
      description: formData.get("description") as string,
      manual_student_count: formData.get("manual_student_count") ? parseInt(formData.get("manual_student_count") as string, 10) : null,
    };

    const result = await updateCourse(course.id, data);

    if (result.success) {
      router.push("/admin/courses");
    } else {
      setError(result.error || "Ocurrió un error al actualizar el curso.");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Editar Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre del Curso *</label>
              <input id="name" name="name" defaultValue={course.name} required className="w-full p-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug (URL amigable) *</label>
              <input id="slug" name="slug" defaultValue={course.slug} placeholder="ejemplo-mi-curso" required className="w-full p-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Fecha de Inicio</label>
                <input type="date" id="date" name="date" defaultValue={course.date ? new Date(course.date).toISOString().split('T')[0] : ""} className="w-full p-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-1">Duración</label>
                <input id="duration" name="duration" defaultValue={course.duration || ""} placeholder="ej. 40 horas" className="w-full p-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Descripción</label>
              <textarea id="description" name="description" defaultValue={course.description || ""} rows={5} className="w-full p-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div>
              <label htmlFor="manual_student_count" className="block text-sm font-medium mb-1">Total de Alumnos Históricos (Opcional)</label>
              <input type="number" min="0" id="manual_student_count" name="manual_student_count" defaultValue={course.manual_student_count || ""} placeholder="Ej. 120" className="w-full p-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
              <p className="text-xs text-muted-foreground mt-1">Si dejas este campo en blanco, se mostrará el número de reseñas aprobadas como el total de alumnos.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/courses">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
