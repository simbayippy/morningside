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
        include: {
          registrations: true,
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
        include: {
          registrations: true,
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
    .input(z.object({
      eventId: z.string(),
      paymentImage: z.string().url(),
    }))
    .mutation(async ({ ctx, input }) => {
      console.log("Registering for event:", input);
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

        try {
          const registrationData = {
            userId: ctx.session.user.id,
            eventId: input.eventId,
            paymentImage: input.paymentImage,
            status: "REGISTERED",
          };
          const registration = await ctx.db.eventRegistration.create({
            data: registrationData,
            select: {
              id: true,
              userId: true,
              eventId: true,
              status: true,
              paymentImage: true,
              createdAt: true,
            },
          });
          return registration;
        } catch (createError) {
          console.error("Failed to create event registration:", {
            error: createError,
            input,
            userId: ctx.session.user.id,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create event registration",
            cause: createError,
          });
        }
      } catch (error) {
        console.error("Error in event registration:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to register for event",
          cause: error,
        });
      }
    }),

  cancelRegistration: protectedProcedure
    .input(z.object({
      eventId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if registration exists
        const registration = await ctx.db.eventRegistration.findUnique({
          where: {
            userId_eventId: {
              userId: ctx.session.user.id,
              eventId: input.eventId,
            },
          },
        });

        if (!registration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Registration not found",
          });
        }

        // Delete the registration
        await ctx.db.eventRegistration.delete({
          where: {
            userId_eventId: {
              userId: ctx.session.user.id,
              eventId: input.eventId,
            },
          },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cancel registration",
        });
      }
    }),

  delete: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First delete all related registrations
      await ctx.db.eventRegistration.deleteMany({
        where: {
          eventId: input.id,
        },
      });

      // Then delete the event
      return await ctx.db.event.delete({
        where: {
          id: input.id,
        },
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
