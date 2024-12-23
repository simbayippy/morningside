import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { membershipFormSchema } from "@/lib/schemas/membership";

export const memberRouter = createTRPCRouter({
  // Get current user's membership status
  getMyMembership: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.member.findUnique({
        where: { userId: ctx.session.user.id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error",
          cause: error,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch membership status",
      });
    }
  }),

  // Submit membership application
  submitApplication: protectedProcedure
    .input(membershipFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Starting membership application submission");
        console.log("User ID:", ctx.session.user.id);
        console.log("Input:", input);

        // Check if user already has a membership
        const existingMembership = await ctx.db.member.findUnique({
          where: { userId: ctx.session.user.id },
        });

        console.log("Existing membership check:", existingMembership);

        // Only block if there's an existing membership that's not rejected
        if (existingMembership && existingMembership.status !== "REJECTED") {
          console.log("User already has an active membership application");
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already have an active membership application",
          });
        }

        // Calculate membership fee based on type
        const membershipFee = input.membershipType === "STUDENT" ? 0 : 500; // HKD 500 for Ordinary memberships
        console.log("Calculated membership fee:", membershipFee);

        // If there's a rejected application, update it instead of creating new
        if (existingMembership?.status === "REJECTED") {
          console.log("Updating rejected application with new data");
          const result = await ctx.db.member.update({
            where: { userId: ctx.session.user.id },
            data: {
              membershipFee,
              ...input,
              status: "PENDING", // Reset status to pending
              isVerified: false, // Reset verification
              verifiedAt: null,
              rejectionReason: null,
              studentIdImage: input.studentIdImage as string,
              dateOfRegistration: new Date(), // Update registration date
            },
          });
          console.log("Successfully updated membership:", result);
          return result;
        }

        // Create new membership application for first-time applicants
        console.log("Creating new membership with data:", {
          userId: ctx.session.user.id,
          membershipFee,
          ...input,
          studentIdImage: input.studentIdImage as string,
        });

        const result = await ctx.db.member.create({
          data: {
            userId: ctx.session.user.id,
            membershipFee,
            ...input,
            studentIdImage: input.studentIdImage as string,
          },
        });
        console.log("Successfully created membership:", result);
        return result;
      } catch (error) {
        console.error("Error in submitApplication:", error);
        if (error instanceof TRPCError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error("Prisma error details:", {
            code: error.code,
            meta: error.meta,
            message: error.message,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error",
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create membership application",
        });
      }
    }),

  // Admin: Get all membership applications
  getAllApplications: adminProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.member.findMany({
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error",
          cause: error,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch membership applications",
      });
    }
  }),

  // Admin: Verify membership
  verifyMembership: adminProcedure
    .input(
      z.object({
        memberId: z.string(),
        transactionDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const member = await ctx.db.member.findUnique({
          where: { id: input.memberId },
        });

        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Membership application not found",
          });
        }

        return await ctx.db.member.update({
          where: { id: input.memberId },
          data: {
            isVerified: true,
            verifiedAt: new Date(),
            transactionDate: input.transactionDate,
            status: "APPROVED",
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error",
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify membership",
        });
      }
    }),

  getPendingApplications: protectedProcedure.query(async ({ ctx }) => {
    // Ensure user is admin
    if (!ctx.session.user.isAdmin) {
      throw new Error("Unauthorized");
    }

    return ctx.db.member.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  rejectMembership: adminProcedure
    .input(
      z.object({
        memberId: z.string(),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const member = await ctx.db.member.findUnique({
          where: { id: input.memberId },
        });

        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Membership application not found",
          });
        }

        return await ctx.db.member.update({
          where: { id: input.memberId },
          data: {
            status: "REJECTED",
            rejectionReason: input.reason,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error",
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reject membership",
        });
      }
    }),

  getMemberById: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if the current user is a verified member
      const currentMember = await ctx.db.member.findFirst({
        where: {
          userId: ctx.session.user.id,
          isVerified: true,
        },
      });

      if (!currentMember) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be a verified member to view alumni profiles",
        });
      }

      // Get the requested member's details
      const member = await ctx.db.member.findUnique({
        where: {
          id: input.memberId,
          isVerified: true,
        },
        include: {
          user: {
            select: {
              email: true,
              image: true,
            },
          },
        },
      });

      if (!member) {
        return null;
      }

      return member;
    }),

  getAllMembers: protectedProcedure.query(async ({ ctx }) => {
    // Check if the current user is a verified member
    const currentMember = await ctx.db.member.findFirst({
      where: {
        userId: ctx.session.user.id,
        isVerified: true,
      },
    });

    if (!currentMember) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be a verified member to view the alumni directory",
      });
    }

    // Get all verified members
    const members = await ctx.db.member.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        englishName: "asc",
      },
    });

    return members;
  }),
});
