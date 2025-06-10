import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { ModalProvider } from "@/providers/modal-provider";

import { Header } from "./header";

interface Props {
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
}

const Layout = async ({ children, params }: Props) => {
  const { organizationId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.members.getMany.queryOptions());
  void queryClient.prefetchQuery(trpc.organizations.current.queryOptions({ organizationId }));

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <Header organizationId={organizationId} />
          <ModalProvider />
        </ErrorBoundary>
      </HydrationBoundary>
      {children}
    </div>
  );
}

export default Layout;