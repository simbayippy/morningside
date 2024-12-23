"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export type AuthResponse = {
  error: string | null;
};

export async function login(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");

  // This return is just for TypeScript - the redirect will prevent it from being reached
  return { error: null };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error: authError } = await supabase.auth.signUp(data);

  if (authError) {
    console.log(authError);
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "No user data returned from Supabase" };
  }

  try {
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email: authData.user.email!,
      },
    });
  } catch (error) {
    console.error("Error creating Prisma user:", error);

    try {
      const admin = await createClient();
      await admin.auth.admin.deleteUser(authData.user.id);
    } catch (deleteError) {
      console.error(
        "Error deleting Supabase user after Prisma failure:",
        deleteError,
      );
    }

    return { error: "Failed to create user account" };
  }
}

export async function signOut(formData?: FormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

// New function to get user data from Prisma
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const prismaUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
      isVerified: true,
      image: true,
    },
  });

  return prismaUser;
}
