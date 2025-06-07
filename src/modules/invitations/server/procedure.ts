import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { invitation, role } from "@/db/schema";

export const invitationProcedure = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        invitationId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const inv = await db.query.invitation.findFirst({
        where: eq(invitation.id, input.invitationId),
        with: {
          organization: true,
        }
      });

      if (!inv) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return inv;
    }),
  create: baseProcedure
    .input(
      z.object({
        organizationId: z.string(),
        role: z.enum(role.enumValues)
      }),
    )
    .mutation(async ({ input }) => {
      const [result] = await db
        .insert(invitation)
        .values({
          ...input,
        })
        .returning({
          id: invitation.id
        });
      
      return result;
    }),
  delete: baseProcedure
    .input(
      z.object({
        invitationId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const [inv] = await db
        .delete(invitation)
        .where(eq(invitation.id ,input.invitationId))
        .returning({
          id: invitation.id
        });

      if (!inv) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      
      return inv;
    }),
  role: baseProcedure
    .input(
      z.object({
        invitationId: z.string(),
        role: z.enum(role.enumValues)
      }),
    )
    .mutation(async ({ input }) => {
      const [inv] = await db
        .update(invitation)
        .set({
          role: input.role,
        })
        .where(eq(invitation.id ,input.invitationId))
        .returning({
          id: invitation.id
        });

      if (!inv) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      
      return inv;
    })
});