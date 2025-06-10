import React from "react";

import { Group } from "../../types";
import { Item } from "@/modules/layouts/ui/components/item";
import { MoreHorizontalIcon } from "lucide-react";
import { useToggle } from "@uidotdev/usehooks";

interface Props {
  group: Group;
}

export const GroupItem = ({ group }: Props) => {
  const [on, toggle] = useToggle(false);

  return (
    <React.Fragment>
      <Item
        text="secondary"
        label={group.name}
        icon={group.icon!}
        onToggle={toggle}
        isExpanded={on}
        level={2}
        action={
          <div 
            role="button" 
            className="shrink-0 grow-0 size-5.5 hidden group-hover/item:flex items-center justify-center rounded-sm hover:bg-[#00000008]"
          >
            <MoreHorizontalIcon className="size-4 text-[#73726e]" />
          </div>
        }
      />
      {on && (
        <React.Fragment>
          <Item 
            level={3}
            text="secondary"
            icon="radix-icons:dot-filled"
            label="Competency"
            isLast
          />
          <Item 
            level={3}
            text="secondary"
            icon="radix-icons:dot-filled"
            label="Employee"
            isLast
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}