import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Type for Google OAuth metadata
interface GoogleUserMetadata {
  full_name?: string;
  avatar_url?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const supabase = await createClient();

  if (code) {
    console.log("Handling OAuth callback with code");
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session?.user) {
      console.log("Successfully exchanged code for session");

      // Check if user exists in Prisma
      const existingUser = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      // If user doesn't exist in Prisma, create one
      if (!existingUser) {
        console.log("Creating new Prisma user for OAuth user");
        // Type check the user metadata
        const metadata = session.user.user_metadata as GoogleUserMetadata;

        await prisma.user.create({
          data: {
            id: session.user.id,
            email: session.user.email!,
            name: metadata.full_name ?? null,
            image: metadata.avatar_url ?? null,
            isVerified: true, // OAuth providers verify emails
          },
        });
      }

      console.log("Redirecting to home");
      redirect("/");
    }
    console.log("Failed to exchange code:", error);
  }

  console.log("No valid code found, redirecting to error page");
  redirect("/error");
}
