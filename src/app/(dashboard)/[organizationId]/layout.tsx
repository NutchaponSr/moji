import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { ModalProvider } from "@/providers/modal-provider";

import { Header } from "@/modules/layouts/ui/components/header";
import { Sidebar } from "@/modules/layouts/ui/components/sidebar";

interface Props {
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
}

const Layout = async ({ children, params }: Props) => {
  const { organizationId } = await params;

  const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(trpc.members.getMany.queryOptions());
  void queryClient.prefetchQuery(trpc.groups.getMeny.queryOptions({ organizationId }));
  void queryClient.prefetchQuery(trpc.organizations.current.queryOptions({ organizationId }));

  return (
    <div className="w-screen h-full relative flex bg-background cursor-text">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary fallback={<p>Errors</p>}>
            <Sidebar organizationId={organizationId} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ModalProvider />
      </HydrationBoundary>
      <div className="order-3 flex flex-col w-full overflow-hidden isolation-auto bg-transparent relative">
        <Header />
        <main className="grow-0 shrink flex flex-col bg-background z-1 h-full max-h-full w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;