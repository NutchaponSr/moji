"use client";

import { Icon } from "@iconify-icon/react";
import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { iconVariants, Workspace } from "../../types";
import { cn } from "@/lib/utils";

interface Props {
  workspace: Workspace;
}

export const Banner = ({ workspace }: Props) => {
  return (
    <section className="w-full flex flex-col items-center shrink-0 grow-0 sticky left-0">
      <div className="max-w-full pl-24 w-full transition">
        <div className="flex py-1 justify-start flex-wrap gap-0.5">
          <Button variant="ghost" size="sm" className="text-muted hover:text-muted">
            <InfoIcon />
            Hide description
          </Button>
        </div>
        <div className="pr-24 w-full mb-2">
          <div className="flex flex-row justify-start space-x-2">
            <div className="flex items-center justify-center shrink-0 size-9">
              <Icon icon={workspace.icon} width={36} height={36} className={cn(iconVariants({ text: workspace.text }))} />
            </div>
            <h1 className="font-bold leading-[1.2] text-primary w-full max-w-full whitespace-break-spaces break-words text-3xl">
              {workspace.label}
            </h1>
          </div>
          <div className="max-w-full overflow-hidden mb-3">
            <div className="max-w-full w-3xl whitespace-break-spaces break-words text-sm pl-1.5 py-1">
              <p className="font-semibold text-primary">{workspace.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}