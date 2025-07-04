import { Command } from "cmdk";
import { Icon } from "@iconify-icon/react";
import { Table } from "@tanstack/react-table";

import { ScrollArea } from "@/components/ui/scroll-area";

import { CommandSearch } from "@/components/command-search";

import { useViewOptionsStore } from "../../store/use-view-options-store"
import { ViewOptionsContent, ViewOptionsHeader } from "./view-options";
import { useGrouping } from "../../hooks/use-grouping";

interface Props<T> {
  table: Table<T>;
}

export const AddGrouping = <T,>({ table }: Props<T>) => {
  const { isGrouping, grouping, onSelect } = useGrouping();
  const { viewOptions, onChange, ...props } = useViewOptionsStore();

  if (viewOptions !== "addGrouping") return null;

  return (
    <>  
      <ViewOptionsHeader {...props} viewOptions={viewOptions} />
      <ScrollArea>
        <ViewOptionsContent>
          <CommandSearch placeholder="Search for a property...">
            <Command.Group>
              <Command.Item className="flex items-center gap-2 px-2 py-1 text-sm text-primary rounded-sm h-7 data-[selected=true]:bg-accent capitalize cursor-pointer">
                None
                {!isGrouping && <Icon icon="si:check-alt-fill" width={14} height={14} className="ml-auto" />}
              </Command.Item>

              {table.getAllColumns().map((col) => {
                const IconCol = col.columnDef.meta?.icon;

                return (
                  <Command.Item 
                    key={col.id} 
                    onSelect={() => {
                      onSelect(col);
                      onChange("grouping");
                    }}
                    className="flex items-center gap-2 px-2 py-1 rounded-sm h-7 data-[selected=true]:bg-accent cursor-pointer text-primary"
                  >
                    {IconCol && <IconCol className="size-4.5 stroke-[1.7]" />}
                    <span className="first-letter:uppercase text-sm">
                      {col.id}
                    </span>

                    {grouping === col && <Icon icon="si:check-alt-fill" width={14} height={14} className="ml-auto" />}
                  </Command.Item>
                );
              })}
            </Command.Group>
          </CommandSearch>
        </ViewOptionsContent>
      </ScrollArea>
    </>
  );
}