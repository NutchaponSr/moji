import { createTRPCRouter } from "@/trpc/init";

import { organizationProcedure } from "@/modules/organizations/server/procedure";
import { invitationProcedure } from "@/modules/invitations/server/procedure";
import { memberProcedure } from "@/modules/members/server/procedure";
import { groupProcedure } from "@/modules/groups/server/procedure";

export const appRouter = createTRPCRouter({
  groups: groupProcedure,
  members: memberProcedure,
  invitations: invitationProcedure,
  organizations: organizationProcedure,
});

export type AppRouter = typeof appRouter;