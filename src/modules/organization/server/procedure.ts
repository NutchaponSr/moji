import { 
  createTRPCRouter, 
  protectedProcedure 
} from "@/trpc/init";

import { db } from "@/db";
import { member, organization } from "@/db/schema";

import { organizationSchema } from "../schema";

export const organizationProcedure = createTRPCRouter({
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
        })

      await db
        .insert(member)
        .values({
          userId: ctx.user.id,
          organizationId: org.organizationId,
          role: "admin",
        });

      return org;
    }),
});