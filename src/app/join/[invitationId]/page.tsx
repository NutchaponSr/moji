import Image from "next/image";

import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { InviteView } from "@/modules/invitations/ui/views/invite-view";

interface Props {
  params: Promise<{ invitationId: string }>;
}

const Page = async ({ params }: Props) => {
  const { invitationId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.invitations.getOne.queryOptions({ invitationId }));

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-[#fbfbc] p-8 min-h-svh">
      <Image 
        src="/logo.svg"
        alt="Logo"
        height={60}
        width={60}
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loader2Icon className="size-12 text-muted-foreground animate-spin stroke-[1.5]" />}>
          <InviteView invitationId={invitationId} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}

export default Page;