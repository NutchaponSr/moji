import { Suspense } from "react";
import { LoaderIcon } from "lucide-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { AuthWrapper } from "@/modules/auth/ui/components/auth-wrapper";
import { OrgView } from "@/modules/organizations/ui/views/organization-view";

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.organizations.getOne.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoaderIcon className="size-16 animate-spin stroke-1" />}>
        <AuthWrapper title="Create your organization">
          <OrgView />
        </AuthWrapper>
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;