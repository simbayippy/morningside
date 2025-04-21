import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

export const pingRouter = createTRPCRouter({
  // Public ping endpoint that can be called by a cron job
  ping: publicProcedure
    .input(
      z.object({
        message: z.string().optional(),
      }).optional()
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create a ping record
        const pingRecord = await ctx.db.pingRecord.create({
          data: {
            message: input?.message ?? "Ping to keep Supabase alive",
          },
        });

        // Delete the ping record immediately
        await ctx.db.pingRecord.delete({
          where: {
            id: pingRecord.id,
          },
        });

        return {
          success: true,
          timestamp: new Date(),
          message: "Ping successful - created and deleted record to keep Supabase active",
        };
      } catch (error) {
        console.error("Error in ping endpoint:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error",
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to ping database",
        });
      }
    }),
});
