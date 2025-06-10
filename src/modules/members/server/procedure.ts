import { z } from "zod";

import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { member, role } from "@/db/schema";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const memberProcedure = createTRPCRouter({
  getOne: protectedProcedure
    .query(async ({ ctx }) => {
      const mem = await db.query.member.findFirst({
        where: eq(member.userId, ctx.user.id),
      });

      if (!mem) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return mem;
    }),
  getMany: protectedProcedure
    .query(async ({ ctx }) => {
      const members = await db.query.member.findMany({
        where: eq(member.userId, ctx.user.id),
        with: {
          organization: true
        }
      });

      return members.map(membership => membership.organization);
    }),
  check: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const mem = await db.query.member.findFirst({
        where: and(
          eq(member.userId, ctx.user.id),
          eq(member.organizationId, input.organizationId),
        )
      });

      return mem;
    }),
  create: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        role: z.enum(role.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [mem] = await db
        .insert(member)
        .values({
          ...input,
          userId: ctx.user.id
        })
        .returning();

      if (!mem) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return mem;
    }),
  role: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(role.enumValues),
        organizationId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const [mem] = await db
        .update(member)
        .set({
          role: input.role,
        })
        .where(
          and(
            eq(member.userId, input.userId),
            eq(member.organizationId, input.organizationId),
          )
        ) 
        .returning();

      if (!mem) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return mem;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        organizationId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const [mem] = await db
        .delete(member)
        .where(
          and(
            eq(member.userId, input.userId),
            eq(member.organizationId, input.organizationId),
          )
        ) 
        .returning();

      if (!mem) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return mem;
    })
});