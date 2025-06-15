import { db } from "@/db";
import { group, member } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const groupProcedure = createTRPCRouter({
  getMeny: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const groups = await db.query.group.findMany({
        where: eq(group.organizationId, input.organizationId),
        limit: 5,
        orderBy: (group, { desc }) => [desc(group.createdAt)]
      });

      return groups;
    }),
  getByYear: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        year: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const groups = await db.query.group.findMany({
        where: and(
          eq(group.organizationId, input.organizationId),
          eq(group.year, input.year),
        ),
      });

      return groups;
    }),
  create: protectedProcedure
    .input(
      z.object({
        year: z.string(),
        organizationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const mem = await db.query.member.findFirst({
        where: and(
          eq(member.userId, ctx.user.id),
          eq(member.organizationId, input.organizationId),
        ),
      });

      if (!mem) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      await db
        .insert(group)
        .values({
          ...input,
          createdBy: mem.userId,
          updatedBy: mem.userId,
        })

      return mem;
    })
});