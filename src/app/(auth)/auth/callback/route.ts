import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
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
        // First check if user already exists in Prisma
        const existingUser = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        // If user already exists, just redirect to home
        if (existingUser) {
          console.log("User already exists, redirecting to home");
          return Response.redirect(new URL("/", request.url));
        }

        // Check for dummy user before starting transaction
        const dummyUser = await prisma.user.findFirst({
          where: {
            email: session.user.email!,
            id: { startsWith: "dummy_" },
          },
          include: {
            member: true,
          },
        });

        // If no dummy user exists, create new user directly without transaction
        if (!dummyUser) {
          console.log("No dummy user found, creating new user");
          const metadata = session.user.user_metadata as GoogleUserMetadata;
          await prisma.user.create({
            data: {
              id: session.user.id,
              email: session.user.email!,
              name: metadata.full_name ?? null,
              image: metadata.avatar_url ?? null,
              isVerified: true,
              isAdmin: false,
              isSuperAdmin: false,
            },
          });
          return Response.redirect(new URL("/", request.url));
        }

        // If we get here, we need to migrate dummy user data
        await prisma.$transaction(async (tx) => {
          const memberData = dummyUser.member;
          
          if (memberData) {
            // Delete the old member and dummy user
            await tx.member.delete({
              where: { id: memberData.id },
            });
          }
          
          await tx.user.delete({
            where: { id: dummyUser.id },
          });
          console.log("Deleted dummy user");

          // Create the new user
          const metadata = session.user.user_metadata as GoogleUserMetadata;
          const user = await tx.user.create({
            data: {
              id: session.user.id,
              email: session.user.email!,
              name: metadata.full_name ?? null,
              image: metadata.avatar_url ?? null,
              isVerified: true,
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
            console.log("Migrated member data");
          }
        });

        console.log("Successfully created/migrated user");
        return Response.redirect(new URL("/", request.url));
      } catch (error) {
        console.error("Error in OAuth signup:", error);
        if (error instanceof Error && error.message === "Email already exists") {
          return Response.redirect(new URL("/error?message=email-exists", request.url));
        }
        return Response.redirect(new URL("/error", request.url));
      }
    }
    console.log("Failed to exchange code:", error);
  }

  console.log("No valid code found, redirecting to error page");
  return Response.redirect(new URL("/error", request.url));
}
