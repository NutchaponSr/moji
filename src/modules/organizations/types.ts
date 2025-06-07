import { AppRouter } from "@/trpc/routers/_app";

export type Organization = NonNullable<Awaited<ReturnType<AppRouter["organizations"]["current"]>>>