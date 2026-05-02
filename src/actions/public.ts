"use server";

import { supabase } from "@/lib/supabase";

export async function getActiveCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active courses:", error);
    return [];
  }

  return data;
}

export async function getFinishedCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_active", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching finished courses:", error);
    return [];
  }

  return data;
}

export async function getCourseBySlug(slug: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching course:", error);
    return null;
  }

  return data;
}

export async function getApprovedReviews(courseId?: string) {
  let query = supabase
    .from("reviews")
    .select("*, courses(name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching approved reviews:", error);
    return [];
  }

  return data;
}

export async function getCourseStats(courseId: string) {
  // First, fetch the course to see if it has a manual student count
  const { data: courseData } = await supabase
    .from("courses")
    .select("manual_student_count")
    .eq("id", courseId)
    .single();

  const { data, error } = await supabase
    .from("reviews")
    .select("rating, would_recommend")
    .eq("course_id", courseId)
    .eq("status", "approved");

  if (error || !data) {
    return { average: 0, total: courseData?.manual_student_count || 0, reviewCount: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, recommendRate: { yes: 0, no: 0 } };
  }

  const reviewCount = data.length;
  const total = courseData?.manual_student_count !== null && courseData?.manual_student_count !== undefined 
    ? courseData.manual_student_count 
    : reviewCount;

  if (reviewCount === 0) return { average: 0, total, reviewCount: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, recommendRate: { yes: 0, no: 0 } };

  let recommendYes = 0;
  let recommendNo = 0;
  let sum = 0;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  data.forEach((r) => {
    sum += Number(r.rating);
    const roundedRating = Math.round(Number(r.rating)) as 1 | 2 | 3 | 4 | 5;
    if (distribution[roundedRating] !== undefined) {
      distribution[roundedRating]++;
    }
    if (r.would_recommend) {
      recommendYes++;
    } else {
      recommendNo++;
    }
  });

  const average = reviewCount > 0 ? (sum / reviewCount).toFixed(1) : "0.0";

  return { 
    average: Number(average), 
    total, 
    reviewCount,  // BUG-06 fix: exponer el conteo real de reseñas para cálculo de porcentajes
    distribution, 
    recommendRate: { yes: recommendYes, no: recommendNo } 
  };
}
