import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getSession();
  
  // Minimal security check
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "reviews") {
    const { data } = await supabase
      .from("reviews")
      .select("*, courses(name)");

    if (!data) return new NextResponse("No data", { status: 404 });

    const headers = ["ID", "Curso", "Alumno", "Calificación", "Opinión", "Lo que más gustó", "Sugerencia", "Recomienda", "Estado", "Fecha"];
    
    const csvContent = [
      headers.join(","),
      ...data.map((r: any) => [
        r.id,
        `"${r.courses?.name || ""}"`,
        `"${r.student_name || "Anónimo"}"`,
        r.rating,
        // BUG-12 fix: fallbacks para campos potencialmente null en la BD
        `"${(r.comment || "").replace(/"/g, '""')}"`,
        `"${(r.liked_most || "").replace(/"/g, '""')}"`,
        `"${(r.improvement_suggestion || "").replace(/"/g, '""')}"`,
        r.would_recommend ? "Sí" : "No",
        r.status,
        r.created_at
      ].join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="opiniones.csv"',
      },
    });
  }

  return new NextResponse("Invalid type", { status: 400 });
}
