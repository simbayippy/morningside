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

      try {
        // Wrap in transaction to handle dummy user migration
        await prisma.$transaction(async (tx) => {
          // Check for dummy user first
          const dummyUser = await tx.user.findFirst({
            where: {
              email: session.user.email!,
              id: { startsWith: "dummy_" },
            },
            include: {
              member: true,
            },
          });

          // Store member data if exists
          let memberData = null;
          if (dummyUser?.member) {
            memberData = { ...dummyUser.member };
            
            // Delete the old member and dummy user
            await tx.member.delete({
              where: { id: dummyUser.member.id },
            });
            await tx.user.delete({
              where: { id: dummyUser.id },
            });
            console.log("Migrated dummy user data");
          }

          // Check for existing non-dummy user
          const existingUser = await tx.user.findFirst({
            where: {
              email: session.user.email!,
              NOT: {
                id: { startsWith: "dummy_" },
              },
            },
          });

          if (existingUser) {
            throw new Error("Email already exists");
          }

          // Type check the user metadata
          const metadata = session.user.user_metadata as GoogleUserMetadata;

          // Create the new user
          const user = await tx.user.create({
            data: {
              id: session.user.id,
              email: session.user.email!,
              name: metadata.full_name ?? null,
              image: metadata.avatar_url ?? null,
              isVerified: true, // OAuth providers verify emails
              isAdmin: false,
              isSuperAdmin: false,
            },
          });

          // If we had member data, create new member record
          if (memberData) {
            await tx.member.create({
              data: {
                ...memberData,
                id: undefined,
                userId: user.id,
                rejectionReason: null,
                createdAt: undefined,
                updatedAt: undefined,
              },
            });
          }
        });

        console.log("Successfully created/migrated user");
        redirect("/");
      } catch (error) {
        console.error("Error in OAuth signup:", error);
        if (error instanceof Error && error.message === "Email already exists") {
          redirect("/error?message=email-exists");
        }
        redirect("/error");
      }
    }
    console.log("Failed to exchange code:", error);
  }

  console.log("No valid code found, redirecting to error page");
  redirect("/error");
}
