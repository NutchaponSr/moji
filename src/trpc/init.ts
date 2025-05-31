import superjson from "superjson";

import { cache } from "react";
import { headers } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { user as users } from "@/db/schema";

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return { session };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await db.query.user.findFirst({
    where: eq(users.id, ctx.session.user.id),
  });

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      ...ctx.session,
      user,
    },
  });
});