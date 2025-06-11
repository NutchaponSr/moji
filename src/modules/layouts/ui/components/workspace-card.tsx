import Link from "next/link";

import { Icon } from "@iconify-icon/react";

import { iconVariants, Workspace } from "../../types";
import { cn } from "@/lib/utils";

interface Props {
  workspace: Workspace;
  organizationId: string;
}

export const WorkspaceCard = ({
  workspace,
  organizationId
}: Props) => {  
  return (
    <div className="relative group">
      <Link 
        href={`/${organizationId}/${workspace.href}`}
        className="flex flex-col transition cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-[#ffffff0d] relative h-40 justify-stretch"
      >
        <div className="relative mb-4">
          <div className={cn("h-11", workspace.className)} />
          <div className="flex items-center justify-center rounded-e-sm absolute -bottom-3.5 left-4">
            <Icon icon={workspace.icon} width={32} height={32} className={cn(iconVariants({ text: workspace.text }))} />
          </div>
        </div>
        <div className="w-full min-h-20 py-2.5 px-4 relative flex flex-col justify-start gap-2 grow">
          <h2 className="whitespace-pre-wrap overflow-hidden text-ellipsis font-semibold text-sm text-primary w-auto">
            {workspace.label}
          </h2>
          <p className="text-xs text-[#787774] dark:text-[#7f7f7f] line-clamp-2">
            {workspace.description}
          </p>
        </div>
      </Link>
      <div className="absolute rounded-2xl inset-0 shadow-[0_12px_32px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.05)] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.03),_0_0_0_1px_rgba(0,0,0,0.086)] dark:shadow-[unset] dark:group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] pointer-events-none" />
    </div>
  );
}