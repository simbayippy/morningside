import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

// Use React cache to memoize the getCurrentUser function
export const getCurrentUser = cache(async () => {
  try {
    const supabase = await createClient();

    // First check if we have a session -> For non-logged in users
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Supabase session error:", sessionError);
      return null;
    }

    // If no session, return null early
    if (!session) {
      return null;
    }

    const {
      data: { user },
      error: supabaseError,
    } = await supabase.auth.getUser();

    if (supabaseError) {
      console.error("Supabase auth error:", supabaseError);
      return null;
    }

    if (!user) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isVerified: true,
        image: true,
        graduationYear: true,
        major: true,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
});

// Helper function to check if user is admin
export async function isUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isAdmin ?? false;
}

// Type for the user data
export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>;
