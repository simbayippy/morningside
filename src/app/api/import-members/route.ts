/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { z } from "zod";

// Schema for bulk member import
const importMemberSchema = z.object({
  // Personal Information
  salutation: z.string(),
  englishName: z.string(),
  preferredName: z.string().optional(),
  chineseName: z.string().optional(),
  gender: z.string(),

  // Academic Information
  class: z.number(),
  faculty: z.string(),
  major: z.string(),
  cusid: z.string(),
  studentIdImage: z.string(),

  // Professional Information
  employer: z.string().optional(),
  position: z.string().optional(),
  industry: z.string().optional(),

  // Contact Information
  email: z.string().email(),
  phoneNumber: z.string(),
  address: z.string().optional(),

  // Membership Details
  membershipType: z.enum(["STUDENT", "ORDINARY_II", "ORDINARY_I", "HONORARY"]),
  membershipFee: z.number().optional(),
  transactionDate: z.string().optional(), // ISO date string
  dateOfRegistration: z.string().optional(), // ISO date string

  // Status
  isVerified: z.boolean().optional(),
  status: z.string().optional(),
});

const API_KEY = process.env.IMPORT_API_KEY ?? "your-secret-key";

export async function POST(request: Request) {
  try {
    // Verify API key
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Input must be an array" },
        { status: 400 },
      );
    }

    // Process each member
    const results = await Promise.all(
      body.map(async (memberData) => {
        try {
          // Validate member data
          const validatedData = importMemberSchema.parse(memberData);

          // Check if member already exists
          const existingMember = await db.member.findFirst({
            where: {
              OR: [
                { user: { email: validatedData.email } },
                {
                  AND: [
                    { englishName: validatedData.englishName },
                    { class: validatedData.class },
                  ],
                },
              ],
            },
          });

          if (existingMember) {
            return {
              success: false,
              email: validatedData.email,
              error: "Member already exists",
            };
          }

          // Create dummy user
          const dummyUser = await db.user.create({
            data: {
              id: `dummy_${validatedData.email.replace(/[@.]/g, "_")}`,
              email: validatedData.email,
              isVerified: false,
            },
          });

          // Create member
          const member = await db.member.create({
            data: {
              // Personal Information
              salutation: validatedData.salutation,
              englishName: validatedData.englishName,
              preferredName: validatedData.preferredName,
              chineseName: validatedData.chineseName,
              gender: validatedData.gender,

              // Academic Information
              class: validatedData.class,
              faculty: validatedData.faculty,
              major: validatedData.major,
              cusid: validatedData.cusid,
              studentIdImage: validatedData.studentIdImage,

              // Professional Information
              employer: validatedData.employer,
              position: validatedData.position,
              industry: validatedData.industry,

              // Contact Information
              phoneNumber: validatedData.phoneNumber,
              address: validatedData.address,

              // Membership Details
              membershipType: validatedData.membershipType,
              membershipFee: validatedData.membershipFee
                ? Number(validatedData.membershipFee)
                : validatedData.membershipType === "STUDENT"
                  ? 0
                  : 500,
              transactionDate: validatedData.transactionDate
                ? new Date(validatedData.transactionDate)
                : undefined,
              dateOfRegistration: validatedData.dateOfRegistration
                ? new Date(validatedData.dateOfRegistration)
                : new Date(),

              // Status
              isVerified: validatedData.isVerified ?? true,
              verifiedAt: validatedData.isVerified ? new Date() : undefined,
              status: validatedData.status ?? "APPROVED",

              // Link to dummy user
              userId: dummyUser.id,

              // Store email in a comment field for future linking
              rejectionReason: `Pending account creation: ${validatedData.email}`,
            },
          });

          return {
            success: true,
            email: validatedData.email,
            memberId: member.id,
            dummyUserId: dummyUser.id,
          };
        } catch (error) {
          console.error("Error processing member:", error);
          return {
            success: false,
            email: memberData.email ?? "unknown",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    );

    return NextResponse.json({
      totalProcessed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
