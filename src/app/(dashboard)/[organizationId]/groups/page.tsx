import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { GroupsView } from "@/modules/groups/ui/views/groups-view";

import { loadGroupQuery } from "@/modules/groups/search-params";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ organizationId: string }>;
}

const Page = async ({
  searchParams,
  params
}: Props) => {
  const { organizationId } = await params;
  const query = await loadGroupQuery(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.groups.getByYear.queryOptions({ organizationId, ...query })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <GroupsView organizationId={organizationId} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;