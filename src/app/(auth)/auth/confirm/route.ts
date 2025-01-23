import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  console.log("Starting email confirmation process...");
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  console.log("Received params:", { token_hash, type, next });

  if (token_hash && type) {
    console.log("Attempting to verify OTP...");
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error("Error verifying OTP:", error);
    }

    if (!error && data.user) {
      console.log("OTP verification successful for user:", data.user.id);
      // Update user verification status in Prisma
      try {
        await prisma.user.update({
          where: { id: data.user.id },
          data: { isVerified: true },
        });
        console.log("Successfully updated user verification status in Prisma");
      } catch (error) {
        console.error("Error updating user verification status:", error);
      }

      console.log("Redirecting to home");
      // Simply redirect to home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Return the user to an error page with some instructions
  console.log("Verification failed, redirecting to error page");
  return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
}
