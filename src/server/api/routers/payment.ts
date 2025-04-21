import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

// Payment settings schema
const paymentSettingsSchema = z.object({
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankCode: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export const paymentRouter = createTRPCRouter({
  // Get payment settings
  getPaymentSettings: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Get the most recent payment settings
      const settings = await ctx.db.paymentSettings.findFirst({
        orderBy: {
          updatedAt: "desc",
        },
      });

      return settings;
    } catch (error) {
      console.error("Error fetching payment settings:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error",
          cause: error,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch payment settings",
      });
    }
  }),

  // Update payment settings
  updatePaymentSettings: adminProcedure
    .input(paymentSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Create a new payment settings record
        const settings = await ctx.db.paymentSettings.create({
          data: {
            ...input,
            lastUpdatedBy: ctx.session.user.id,
          },
        });

        return settings;
      } catch (error) {
        console.error("Error updating payment settings:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error",
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update payment settings",
        });
      }
    }),
});
