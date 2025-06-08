import { Suspense } from "react";
import { headers } from "next/headers";
import { LoaderIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { auth } from "@/lib/auth";

import { getQueryClient, trpc } from "@/trpc/server";

import { Header } from "@/modules/organizations/ui/components/header";
import { AuthWrapper } from "@/modules/auth/ui/components/auth-wrapper";
import { OrgView } from "@/modules/organizations/ui/views/organization-view";

import { SIGN_IN_URL } from "@/modules/auth/constants";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(SIGN_IN_URL);
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.organizations.getOne.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoaderIcon className="size-16 animate-spin stroke-1" />}>
        <Header />
        <AuthWrapper title="Create your organization">
          <OrgView />
        </AuthWrapper>
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;