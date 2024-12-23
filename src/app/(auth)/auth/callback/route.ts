import { type EmailOtpType } from "@supabase/supabase-js";
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
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
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

  if (token_hash && type) {
    console.log("Handling email verification");
    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error && data.user) {
      console.log(
        "Successfully verified OTP, updating user verification status",
      );
      await prisma.user.update({
        where: { id: data.user.id },
        data: { isVerified: true },
      });
      console.log(
        "Successfully updated user verification status, redirecting to home",
      );
      redirect("/");
    }
    console.log("Failed to verify OTP:", error);
  }

  console.log("No valid token_hash or code found, redirecting to error page");
  redirect("/error");
}
