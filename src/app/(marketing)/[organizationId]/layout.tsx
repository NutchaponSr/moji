import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { Header } from "./header";
interface Props {
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
}

const Layout = async ({ children, params }: Props) => {
  const { organizationId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.organizations.getMany.queryOptions());

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Header organizationId={organizationId} />
      </HydrationBoundary>
      {children}
    </div>
  );
}

export default Layout;