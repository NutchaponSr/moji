"use client";

import { ImageAvatar } from "@/components/image-avatar";
import { authClient } from "@/lib/auth-client";
import { SIGN_IN_URL } from "@/modules/auth/constants";
import { ProfilePopover } from "@/modules/shared/components/profile-popover";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  organizationId: string;
}

export const OrganizationButton = ({ organizationId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = authClient.useSession();
  const callbackUrl = encodeURIComponent(pathname);

  const { data: organizations } = useSuspenseQuery(trpc.organizations.getMany.queryOptions());
  const { data: organization } = useSuspenseQuery(trpc.organizations.current.queryOptions({ organizationId }));

  const memberCount = organization.members.length;

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push(`${SIGN_IN_URL}?callbackUrl=${callbackUrl}`)
      }
    });
  };

  return (
    <ProfilePopover
      trigger={
        <button className="px-3 py-1 flex items-center gap-2 h-7 transition hover:bg-accent text-sm">
          <ImageAvatar 
            src={organization.image || ""}
            name={organization.name}
            className="rounded size-5"
            fallbackClassName="rounded text-sm bg-sky-400 text-white"
          />
          {organization.name}
        </button>
      }
      title={organization.name}
      subtitle={`${organization.plan} Plan · ${memberCount} member`}
      image={organization.image || ""}
      email={session?.user.email}
      organizations={organizations}
      currentOrganizationId={organizationId}
      onLogout={handleLogout}
    />
  );
}; 