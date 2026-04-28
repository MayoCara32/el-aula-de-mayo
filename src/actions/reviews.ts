"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitReview(data: {
  course_id: string;
  visitor_id: string;
  student_name: string;
  rating: number;
  comment: string;
  liked_most: string;
  improvement_suggestion: string;
  would_recommend: boolean;
  consent_accepted: boolean;
}) {
  try {
    // Check if the visitor already reviewed this course
    const { data: existingReview, error: checkError } = await supabase
      .from("reviews")
      .select("id")
      .eq("course_id", data.course_id)
      .eq("visitor_id", data.visitor_id)
      .single();

    if (existingReview) {
      return { success: false, message: "Ya has enviado una opinión para este curso." };
    }

    // Since PGRST116 means zero rows, we can proceed.
    // Insert new review
    const { error: insertError } = await supabase.from("reviews").insert([
      {
        course_id: data.course_id,
        visitor_id: data.visitor_id,
        student_name: data.student_name || "Anónimo",
        rating: data.rating,
        comment: data.comment,
        liked_most: data.liked_most,
        improvement_suggestion: data.improvement_suggestion,
        would_recommend: data.would_recommend,
        consent_accepted: data.consent_accepted,
        status: "pending",
      },
    ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return { success: false, message: "Hubo un error al guardar tu opinión. Intenta de nuevo." };
    }

    revalidatePath(`/courses`);
    return { success: true, message: "¡Gracias! Tu opinión ha sido enviada y está pendiente de revisión." };
  } catch (error: any) {
    console.error("Submit review error:", error);
    return { success: false, message: "Error interno del servidor." };
  }
}
