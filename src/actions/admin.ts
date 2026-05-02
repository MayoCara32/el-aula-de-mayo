"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getAdminDashboardStats() {
  const { data: courses } = await supabase.from("courses").select("id, name");
  const { data: reviews } = await supabase.from("reviews").select("id, rating, status, course_id");

  const totalCourses = courses?.length || 0;
  const totalReviews = reviews?.length || 0;
  const pendingReviews = reviews?.filter(r => r.status === "pending").length || 0;
  
  const approvedReviews = reviews?.filter(r => r.status === "approved") || [];
  const averageRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((acc, curr) => acc + Number(curr.rating), 0) / approvedReviews.length).toFixed(1) 
    : 0;

  return {
    totalCourses,
    totalReviews,
    pendingReviews,
    averageRating: Number(averageRating),
  };
}

export async function getAdminCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin courses:", error);
    return [];
  }
  return data;
}

export async function getAdminReviews(statusFilter?: "pending" | "approved" | "rejected") {
  let query = supabase
    .from("reviews")
    .select("*, courses(name)")
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching admin reviews:", error);
    return [];
  }
  return data;
}

export async function updateReviewStatus(reviewId: string, status: "approved" | "rejected", adminResponse?: string) {
  const updateData: any = { status };
  if (adminResponse !== undefined) {
    updateData.admin_response = adminResponse;
  }

  const { error } = await supabase
    .from("reviews")
    .update(updateData)
    .eq("id", reviewId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  revalidatePath("/courses", "layout"); // BUG-05 fix: invalida toda la sección de cursos
  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  return { success: true };
}

export async function toggleCourseActive(courseId: string, isActive: boolean) {
  const { error } = await supabase
    .from("courses")
    .update({ is_active: isActive })
    .eq("id", courseId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true };
}

export async function deleteCourse(courseId: string) {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true };
}

export async function createCourse(data: { name: string; slug: string; date?: string; duration?: string; description?: string; manual_student_count?: number | null }) {
  const { error } = await supabase
    .from("courses")
    .insert([{
      name: data.name,
      slug: data.slug,
      date: data.date || null,
      duration: data.duration || null,
      description: data.description || null,
      manual_student_count: data.manual_student_count !== undefined ? data.manual_student_count : null,
      is_active: true
    }]);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true };
}

export async function updateCourse(id: string, data: { name: string; slug: string; date?: string; duration?: string; description?: string; manual_student_count?: number | null }) {
  const { error } = await supabase
    .from("courses")
    .update({
      name: data.name,
      slug: data.slug,
      date: data.date || null,
      duration: data.duration || null,
      description: data.description || null,
      manual_student_count: data.manual_student_count !== undefined ? data.manual_student_count : null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath(`/courses/${data.slug}`);
  return { success: true };
}
