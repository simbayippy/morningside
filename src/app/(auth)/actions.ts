"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createAdminClient } from "@/utils/supabase/admin";

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
  const adminClient = createAdminClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  console.log("Attempting to sign up user with email:", data.email);

  const { data: authData, error: authError } = await supabase.auth.signUp(data);

  if (authError) {
    console.log("Supabase auth error:", authError);
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

  const userId = authData.user.id;
  const userEmail = authData.user.email;

  if (!userEmail) {
    console.log("No email returned from Supabase");
    return { error: "No email returned from Supabase" };
  }

  console.log("Successfully created Supabase user:", userId);

  try {
    // Wrap the entire process in a transaction
    const result = await prisma.$transaction(async (tx) => {
      console.log("Starting transaction...");

      // First check if a real user with this email already exists
      const existingUser = await tx.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: { startsWith: "dummy_" },
          },
        },
      });

      if (existingUser) {
        throw new Error("Email already exists");
      }

      // Check for dummy user
      const dummyUser = await tx.user.findFirst({
        where: {
          email: data.email,
          id: { startsWith: "dummy_" },
        },
        include: {
          member: true,
        },
      });

      console.log("Found dummy user:", dummyUser?.id);
      console.log("Dummy user has member:", !!dummyUser?.member);

      let memberData = null;
      if (dummyUser?.member) {
        // Store member data before deletion
        memberData = { ...dummyUser.member };

        // Delete the old member and dummy user first
        await tx.member.delete({
          where: { id: dummyUser.member.id },
        });
        await tx.user.delete({
          where: { id: dummyUser.id },
        });
        console.log("Deleted old member and dummy user");
      }

      // Now create the real user
      console.log("Creating real user in Prisma...");
      const user = await tx.user.create({
        data: {
          id: userId,
          email: userEmail,
          isVerified: false,
          isAdmin: false,
          isSuperAdmin: false,
        },
      });
      console.log("Successfully created Prisma user:", user.id);

      // If we had member data, create new member record
      if (memberData) {
        const newMember = await tx.member.create({
          data: {
            ...memberData,
            id: undefined,
            userId: user.id,
            rejectionReason: null,
            createdAt: undefined,
            updatedAt: undefined,
          },
        });
        console.log("Created new member record:", newMember.id);
      }

      return user;
    });

    console.log("Transaction completed successfully:", result.id);
    return { error: null };
  } catch (error) {
    console.error(
      "Error in signup process:",
      error instanceof Error ? error.message : error,
    );

    // Clean up Supabase user if Prisma transaction failed
    try {
      console.log("Attempting to delete Supabase user after Prisma failure...");
      const { error: deleteError } =
        await adminClient.auth.admin.deleteUser(userId);
      if (deleteError) {
        console.error("Error deleting Supabase user:", deleteError);
      } else {
        console.log("Successfully deleted Supabase user after Prisma failure");
      }
    } catch (deleteError) {
      console.error(
        "Error deleting Supabase user after Prisma failure:",
        deleteError,
      );
    }

    if (error instanceof Error && error.message === "Email already exists") {
      return { error: "Email already exists" };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      if (error.code === "P2002") {
        return { error: "Email already exists" };
      }
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
