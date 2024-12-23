import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

const newsInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().min(1),
  imageUrl: z.string().url(),
  slug: z.string().min(1),
});

export const newsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.news.findMany({
        orderBy: {
          publishedAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
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

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const article = await ctx.db.news.findUnique({
          where: { slug: input.slug },
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        });

        if (!article) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }

        return article;
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
          message: "Failed to fetch article",
        });
      }
    }),

  create: adminProcedure.input(newsInput).mutation(async ({ ctx, input }) => {
    try {
      return await ctx.db.news.create({
        data: {
          ...input,
          authorId: ctx.session.user.id,
          publishedAt: new Date(),
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
        message: "Failed to create article",
      });
    }
  }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: newsInput,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.news.update({
          where: { id: input.id },
          data: input.data,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Article not found",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error",
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update article",
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.news.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Article not found",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error",
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete article",
        });
      }
    }),
});
