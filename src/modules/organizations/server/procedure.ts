import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { 
  createTRPCRouter, 
  protectedProcedure 
} from "@/trpc/init";

import { resend } from "@/lib/send";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { invitation, member, organization } from "@/db/schema";

import { organizationSchema } from "@/modules/organizations/schema";

export const organizationProcedure = createTRPCRouter({
  current: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(), 
      }),
    )
    .query(async ({ input }) => {
      const org = await db.query.organization.findFirst({
        where: eq(organization.id, input.organizationId),
        with: {
          members: {
            with: {
              user: true
            }
          },
          invitations: true,
        }
      });

      if (!org) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return org;
    }),
  getOne: protectedProcedure
    .query(async ({ ctx }) => {
      const org = await db.query.member.findFirst({
        where: eq(member.userId, ctx.user.id),
      });

      if (org) return org;

      return null;
    }),
  create: protectedProcedure
    .input(organizationSchema)
    .mutation(async ({ ctx, input }) => {
      const [org] = await db
        .insert(organization)
        .values({
          ...input,
          createdBy: ctx.user.id,
        })
        .returning({
          organizationId: organization.id,
        });

      await db
        .insert(member)
        .values({
          userId: ctx.user.id,
          organizationId: org.organizationId,
          role: "admin",
        });

      return org;
    }),
  email: protectedProcedure
    .input(
      z.object({
        emails: z.array(z.string().email()),
      }),
    )
    .mutation(async () => {
      const result = await resend.emails.send({
        from: "Moji <onboarding@resend.dev>",
        to: ["pondpopza5@gmail.com"],
        subject: "Invite to Moji",
        text: "You have been invited to join Moji. Please use the invite code to join."
      });

      if (result.error) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error.message });
      }
      
      return result;
    }),
  join: protectedProcedure
    .input(
      z.object({
        inviteCode: z.string(),
        invitation: z.string(),
        role: z.enum(["admin", "member"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const inv = await db.query.invitation.findFirst({
        where: eq(invitation.id, input.invitation),
      });

      if (!inv) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (inv.inviteCode !== input.inviteCode) {
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Invite code does not match",
        });
      }

      const existingMember = await db.query.member.findFirst({
        where: eq(member.userId, ctx.user.id),
        with: {
          organization: true
        }
      });

      if (existingMember?.organizationId === inv.organizationId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await db
        .insert(member)
        .values({
          role: input.role,
          userId: ctx.user.id,
          organizationId: inv.organizationId,
        });

      return null;
    })
});