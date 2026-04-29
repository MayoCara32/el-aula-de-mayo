import { getCourseBySlug } from "@/actions/public";
import { ReviewForm } from "@/components/ReviewForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
      <Link href={`/courses/${course.slug}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al curso
      </Link>
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Calificar curso</h1>
        <p className="text-xl text-muted-foreground">
          {course.name}
        </p>
      </div>

      <ReviewForm course={{ id: course.id, name: course.name }} />
    </div>
  );
}
