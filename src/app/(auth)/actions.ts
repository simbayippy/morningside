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
  console.log("Starting signup process...");
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  console.log("Attempting to sign up user with email:", data.email);

  const { data: authData, error: authError } = await supabase.auth.signUp(data);

  if (authError) {
    console.log("Supabase auth error:", authError);
    // Handle rate limit error specifically
    if (authError.status === 429) {
      return {
        error:
          "Too many signup attempts. Please wait a few minutes before trying again.",
      };
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    console.log("No user data returned from Supabase");
    return { error: "No user data returned from Supabase" };
  }
  console.log("Successfully created Supabase user:", authData.user.id);

  try {
    console.log("Checking for existing dummy user with email:", data.email);
    // Check if there's a dummy user with this email
    const dummyUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        id: { startsWith: "dummy_" },
      },
      include: {
        member: true,
      },
    });

    console.log("Found dummy user:", dummyUser?.id);

    // Create the real user
    console.log("Creating real user in Prisma...");
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: authData.user.email!,
        isVerified: false,
      },
    });
    console.log("Successfully created Prisma user:", user.id);

    // If we found a dummy user with a member record, transfer the member to the real user
    const memberToTransfer = dummyUser?.member;
    if (dummyUser && memberToTransfer) {
      console.log("Found member record to transfer:", memberToTransfer.id);
      try {
        await prisma.$transaction(async (tx) => {
          // Update member to point to real user
          await tx.member.update({
            where: { id: memberToTransfer.id },
            data: {
              userId: user.id,
              rejectionReason: null,
            },
          });

          // Delete the dummy user
          await tx.user.delete({
            where: { id: dummyUser.id },
          });
        });

        console.log(
          `Transferred member ${memberToTransfer.id} from dummy user ${dummyUser.id} to real user ${user.id}`,
        );
      } catch (txError) {
        console.error("Transaction error:", txError);
        throw txError;
      }
    }

    return { error: null };
  } catch (error) {
    console.error("Error in signup process:", error);

    try {
      console.log("Attempting to delete Supabase user after Prisma failure...");
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.log("Successfully deleted Supabase user after Prisma failure");
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
      isSuperAdmin: true,
    },
  });

  return prismaUser;
}
