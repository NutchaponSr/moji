import { createTRPCRouter } from "@/trpc/init";

import { organizationProcedure } from "@/modules/organizations/server/procedure";
import { invitationProcedure } from "@/modules/invitations/server/procedure";
import { memberProcedure } from "@/modules/members/server/procedure";

export const appRouter = createTRPCRouter({
  members: memberProcedure,
  invitations: invitationProcedure,
  organizations: organizationProcedure,
});

export type AppRouter = typeof appRouter;