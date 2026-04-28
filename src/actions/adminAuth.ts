"use server";

import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { createSession, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Por favor, ingresa usuario y contraseña." };
  }

  const { data: user, error } = await supabase
    .from("admin_users")
    .select("id, password_hash")
    .eq("username", username)
    .single();

  if (error || !user) {
    return { error: "Credenciales incorrectas." };
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return { error: "Credenciales incorrectas." };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  await logout();
  redirect("/admin/login");
}
