import { createTRPCRouter } from "@/trpc/init";

import { organizationProcedure } from "@/modules/organization/server/procedure";

export const appRouter = createTRPCRouter({
  organizations: organizationProcedure,
});

export type AppRouter = typeof appRouter;