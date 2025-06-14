import { KanbanSquareDashedIcon } from "lucide-react";
import { WorkspaceCard } from "./workspace-card";
import { group } from "@/modules/layouts/constants";

interface Props {
  organizationId: string;
}

export const WorkspaceList = ({ ...props }: Props) => {
  return (
    <div className="min-w-0 col-start-2">
      <div className="shrink-0 flex justify-between items-center h-12 ml-2">
        <div className="flex items-center justify-start font-medium text-tertiary shrink-0 max-w-full gap-2 text-xs">
          <div className="flex items-center justify-center">
            <KanbanSquareDashedIcon className="size-4" />
          </div>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
            Workspace
          </span>
        </div>
      </div>

      <div className="relative min-h-36">
        <div className="grid grid-cols-3 gap-6">
          <WorkspaceCard workspace={group} {...props} />
        </div>
      </div>
    </div>
  );
}