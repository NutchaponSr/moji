import { AppRouter } from "@/trpc/routers/_app";

export type Invitation = NonNullable<Awaited<ReturnType<AppRouter["invitations"]["getOne"]>>>

export type InvitationWithoutOrganization = Omit<Invitation, "organization">;