"use client";

import { LoaderIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { ImageAvatar } from "@/components/image-avatar";
import { ProfilePopover } from "@/modules/shared/components/profile-popover";
import { SIGN_IN_URL } from "@/modules/auth/constants";

interface Props {
  organizationId: string;
}

export const UserButton = ({ organizationId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const pathname = usePathname();

  const callbackUrl = encodeURIComponent(pathname);

  const { data: organizations } = useSuspenseQuery(trpc.organizations.getMany.queryOptions());
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push(`${SIGN_IN_URL}?callbackUrl=${callbackUrl}`)
      }
    });
  };

  if (isPending) {
    return <LoaderIcon className="size-5 animate-spin" />
  }

  if (!session || !session.user.image) return null;

  return (
    <ProfilePopover
      trigger={
        <button className="border rounded-full">
          <ImageAvatar 
            name={session.user.name}
            src={session.user.image}
          />
        </button>
      }
      title={session.user.name}
      subtitle={session.user.email}
      image={session.user.image}
      organizations={organizations}
      currentOrganizationId={organizationId}
      onLogout={handleLogout}
      align="end"
    />
  );
};