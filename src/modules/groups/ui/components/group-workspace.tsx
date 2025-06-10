import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useToggle } from "@uidotdev/usehooks";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Item } from "@/modules/layouts/ui/components/item";
import { GroupItem } from "./group-item";

interface Props {
  organizationId: string;
}

export const GroupWorkspace = ({ organizationId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const { data: groups } = useSuspenseQuery(trpc.groups.getMeny.queryOptions({ organizationId }));

  const create = useMutation(trpc.groups.create.mutationOptions());

  const [on, toggle] = useToggle(false);

  const toggleItem = (label: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleCreate = (year: string) => {
    create.mutate({ year, organizationId }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.groups.getMeny.queryOptions({ organizationId }));
      }
    });
  }

  return (
    <div className="flex flex-col">
      <Item 
        icon="solar:library-bold" 
        label="Group" 
        color="red" 
        isExpanded={on}
        onToggle={toggle}
      />
      {on && (
        <React.Fragment>
          {years.map((year) => (
            <React.Fragment key={year}>
              <Item 
                label={year}
                text="secondary"
                icon="radix-icons:dot-filled"
                isExpanded={expandedItems[year]}
                onToggle={() => toggleItem(year)}
                level={1}
                action={
                  <div 
                    role="button" 
                    onClick={() => handleCreate(year)}
                    className="shrink-0 grow-0 size-5.5 hidden group-hover/item:flex items-center justify-center rounded-sm hover:bg-[#00000008]"
                  >
                    <PlusIcon className="size-4 text-[#73726e]" />
                  </div>
                }  
              />
              {expandedItems[year] && (
                groups
                  .filter((f) => f.year === year)
                  .map((group) => (
                    <GroupItem
                      key={group.id}
                      group={group}
                    />
                ))
              )}
            </React.Fragment>
          ))}
          <Item label="More detail..." level={1} />
        </React.Fragment>
      )}
    </div>
  );
}
