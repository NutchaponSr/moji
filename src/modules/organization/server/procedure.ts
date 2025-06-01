import { 
  createTRPCRouter, 
  protectedProcedure 
} from "@/trpc/init";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { member, organization } from "@/db/schema";

import { organizationSchema } from "@/modules/organization/schema";

export const organizationProcedure = createTRPCRouter({
  getOne: protectedProcedure
    .query(async ({ ctx }) => {
      const org = await db.query.member.findFirst({
        where: eq(member.userId, ctx.user.id),
      });

      if (org) return org;

      return null;
    }),
  getMany: protectedProcedure
    .query(async ({ ctx }) => {
      const org = await db.query.member.findMany({
        where: eq(member.userId, ctx.user.id),
        with: {
          organization: true,
        },
      });

      return org;
    }),
  create: protectedProcedure
    .input(organizationSchema)
    .mutation(async ({ ctx, input }) => {
      const [org] = await db.transaction(async (tx) => {
        const [newOrg] = await tx
          .insert(organization)
          .values({
            ...input,
            createdBy: ctx.user.id,
          })
          .returning({
            organizationId: organization.id,
          });

        await tx
          .insert(member)
          .values({
            userId: ctx.user.id,
            organizationId: newOrg.organizationId,
            role: "admin",
          });

        return [newOrg];
      });

      return org;
    }),
});