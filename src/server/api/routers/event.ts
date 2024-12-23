import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

const eventInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.date(),
  location: z.string().min(1),
  price: z.number().min(0),
  capacity: z.number().optional(),
  imageUrl: z.string().url().optional(),
});

export const eventRouter = createTRPCRouter({
  getUpcoming: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.event.findMany({
        where: {
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    } catch (error) {
      console.error("Error in getUpcoming:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error",
          cause: error,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      });
    }
  }),

  getPast: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.event.findMany({
        where: {
          date: {
            lt: new Date(),
          },
        },
        orderBy: {
          date: "desc",
        },
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
        message: "An unexpected error occurred",
      });
    }
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const event = await ctx.db.event.findUnique({
          where: { id: input.id },
          include: {
            registrations: {
              include: {
                user: true,
              },
            },
          },
        });

        if (!event) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found",
          });
        }

        return event;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch event",
        });
      }
    }),

  create: adminProcedure.input(eventInput).mutation(async ({ ctx, input }) => {
    try {
      return await ctx.db.event.create({
        data: input,
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create event",
      });
    }
  }),

  register: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const event = await ctx.db.event.findUnique({
          where: { id: input.eventId },
          include: {
            registrations: true,
          },
        });

        if (!event) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found",
          });
        }

        if (event.capacity && event.registrations.length >= event.capacity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Event is at capacity",
          });
        }

        const existingRegistration = await ctx.db.eventRegistration.findUnique({
          where: {
            userId_eventId: {
              userId: ctx.session.user.id,
              eventId: input.eventId,
            },
          },
        });

        if (existingRegistration) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Already registered for this event",
          });
        }

        return await ctx.db.eventRegistration.create({
          data: {
            userId: ctx.session.user.id,
            eventId: input.eventId,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register for event",
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // First delete all related registrations
      await ctx.db.eventRegistration.deleteMany({
        where: {
          eventId: input.id
        }
      });

      // Then delete the event
      return await ctx.db.event.delete({
        where: {
          id: input.id
        }
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: eventInput,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.event.update({
        where: { id: input.id },
        data: input.data,
      });
    }),
});
