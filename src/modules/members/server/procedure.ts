import { db } from "@/db";
import { member, role } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const memberProcedure = createTRPCRouter({
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
    })
});