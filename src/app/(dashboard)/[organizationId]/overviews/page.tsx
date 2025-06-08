import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { OrganizationButton } from "@/modules/organizations/ui/components/organization-button";

interface Props {
  params: Promise<{ organizationId: string }>;
}

const Page = async ({ params }: Props) => {
  const { organizationId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.organizations.getMany.queryOptions());
  void queryClient.prefetchQuery(trpc.organizations.current.queryOptions({ organizationId }));

  return (
    <div className="flex items-center justify-center min-h-svh">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OrganizationButton organizationId={organizationId} />
      </HydrationBoundary>
    </div>
  );
}

export default Page;