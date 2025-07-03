import { Command } from "cmdk";
import { Column } from "@tanstack/react-table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { CommandSearch } from "@/components/command-search";

import { ViewOptionsContent, ViewOptionsHeader } from "@/modules/layouts/ui/components/view-options";

import { useViewOptionsStore } from "@/modules/layouts/store/use-view-options-store";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props<T> {
  asChild?: boolean;
  children?: React.ReactNode;
  columns: Column<T>[];
  mode: "popover" | "component";
  onSelect: (column: Column<T>) => void;
}

function renderer <T>(columns: Column<T>[], onSelect: (column: Column<T>) => void){
  return (
    <CommandSearch placeholder="Filter by...">
      <Command.Group>
        {columns.map((item) => {
          const Icon = item.columnDef.meta?.icon;

          return (
            <Command.Item
              key={item.id}
              value={item.id}
              onSelect={() => onSelect(item)}
              className="flex items-center gap-2 px-2 py-1 text-sm text-primary rounded-sm h-7 data-[selected=true]:bg-accent capitalize cursor-pointer"
            >
              {Icon && <Icon className="size-5 stroke-[1.5]" />}
              {item.id}
            </Command.Item>
          );
        })}
      </Command.Group>  
    </CommandSearch>
  );  
}

export const AddSort = <T,>({
  asChild,
  children,
  columns,
  mode,
  onSelect
}: Props<T>) => {
  const { viewOptions, onChange, ...props } = useViewOptionsStore();

  if (mode === "popover") {
    return (
      <Popover>
        <PopoverTrigger asChild={asChild}>
          {children}
        </PopoverTrigger>
        <PopoverContent className="p-1 w-auto">
          {renderer(columns, onSelect)}
        </PopoverContent>
      </Popover>
    );
  }

  if (mode === "component" && viewOptions === "addSort") {
    return (
      <>
        <ViewOptionsHeader {...props} viewOptions={viewOptions} />
        <ScrollArea>
          <ViewOptionsContent>
            {renderer(columns, (column) => {
              onSelect(column);
              onChange("sort");
            })}
          </ViewOptionsContent>
        </ScrollArea>
      </>
    )
  }
}