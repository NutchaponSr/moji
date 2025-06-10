import { Sidebar } from "@/modules/layouts/ui/components/sidebar";
import { ModalProvider } from "@/providers/modal-provider";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
            <ModalProvider />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
      <div className="order-3 flex flex-col w-full overflow-hidden isolation-auto bg-transparent relative">
        {children}
      </div>
    </div>
  );
}

export default Layout;