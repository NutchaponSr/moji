import { GreetingMessage } from "@/components/greeting-message";
import { WorkspaceList } from "@/modules/layouts/ui/components/workspace-list";

interface Props {
  params: Promise<{ organizationId: string }>;
}

const Page = async ({ params }: Props) => {
  const { organizationId } = await params;

  return (
    <div className="z-1 w-full h-full cursor-default bg-background overflow-x-hidden overflow-y-auto before:absolute before:blur-[24px] before:bg-accent">
      <div className="pb-[30vh] grid gap-15 grid-cols-[minmax(56px,1fr)_minmax(auto,900px)_minmax(56px,1fr)] w-full">
        <GreetingMessage />
        <WorkspaceList organizationId={organizationId} />
      </div>
    </div>
  );
}

export default Page;