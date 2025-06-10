import { AppRouter } from "@/trpc/routers/_app";

export type Group = NonNullable<Awaited<ReturnType<AppRouter["groups"]["getMeny"]>>>[0];