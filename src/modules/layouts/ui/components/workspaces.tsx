"use client";

import React from "react";

import { useToggle } from "@uidotdev/usehooks";

import { Item } from "./item";
import { GroupWorkspace } from "@/modules/groups/ui/components/group-workspace";

interface Props {
  organizationId: string;
}


export const Workspaces = ({ ...props }: Props) => {
  const [on, toggle] = useToggle(true);
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (label: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <div className="flex flex-col gap-px w-full">
      <div role="button" onClick={() => toggle()} className="transition flex items-center h-6 px-2 hover:bg-sidebar-accent group">
        <span className="text-xs text-neutral group-hover:text-primary/80 leading-none font-medium">
          Workspace
        </span>
      </div>

      {on && (
        <React.Fragment>
          <GroupWorkspace {...props} />
          <Item 
            icon="solar:book-bold" 
            label="Competeny" 
            color="yellow"
            text="yellow"
            isExpanded={expandedItems["Competeny"]}
            onToggle={() => toggleItem("Competeny")}
          />
          <Item 
            icon="solar:user-bold" 
            label="Employee" 
            color="blue"
            text="blue"
            isExpanded={expandedItems["Employee"]}
            onToggle={() => toggleItem("Employee")}
          />
        </React.Fragment>
      )}
    </div>
  );
}