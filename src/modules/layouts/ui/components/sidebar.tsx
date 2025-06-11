"use client";

import { CircleHelpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Navigation } from "@/modules/layouts/ui/components/navigation";
import { Workspaces } from "@/modules/layouts/ui/components/workspaces";
import { OrganizationButton } from "@/modules/organizations/ui/components/organization-button";
import { useSidebarStore } from "../../store/use-sidebar-store";
import { cn } from "@/lib/utils";

interface Props {
  organizationId: string;
}

export const Sidebar = ({ organizationId }: Props) => {
  const {
    ref,
    isCollapsed,
    isResetting,
    handleMouseDown
  } = useSidebarStore();

  return (
    <aside 
      ref={ref} 
      className={cn(
        "order-1 grow-0 shrink-0 relative z-111 bg-sidebar w-60 transition group/sidebar",
        isResetting && "transition-all ease-in-out duration-300",
        isCollapsed && "w-0",
      )}
    >
      <div className="text-secondary font-medium h-full">
        <div className="flex flex-col justify-between h-full max-h-full overflow-hidden relative gap-2">
          <OrganizationButton organizationId={organizationId} />
          <div className="grow-0 shrink-0 flex flex-col gap-px">
            <Navigation icon="solar:magnifer-bold-duotone" label="Search" />
            <Navigation icon="solar:home-angle-bold-duotone" label="Home" />
            <Navigation icon="solar:inbox-line-bold-duotone" label="Inbox" />
            <Navigation icon="solar:settings-minimalistic-bold-duotone" label="Settings" />
          </div>
          <div className="grow overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col gap-3 pb-5">
              <div className="flex flex-col gap-3">
                <Workspaces organizationId={organizationId} />
              </div>

              <div className="flex flex-col gap-px">
                <Navigation icon="solar:trash-bin-minimalistic-bold-duotone" label="Trash" />
              </div>
            </div>
          </div>

          <div className="block shrink-0 grow-0">
            <div className="flex items-center justify-between py-2.5 px-3 box-border">
              <div />
              <Button size="icon" variant="ghost">
                <CircleHelpIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1 absolute right-0 top-0 h-full group/line">
        <div 
          onMouseDown={handleMouseDown}
          className="transition cursor-ew-resize h-full w-px group-hover/line:w-0.5 bg-[#eeeeec] dark:bg-[#2a2a2a] group-hover/line:bg-ring absolute right-0 top-0" 
        />
      </div>
    </aside>
  );
}