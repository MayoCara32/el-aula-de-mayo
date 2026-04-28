import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { EditCourseForm } from "@/components/admin/EditCourseForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0;

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !course) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/courses" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a cursos
      </Link>
      
      <EditCourseForm course={course} />
    </div>
  );
}
