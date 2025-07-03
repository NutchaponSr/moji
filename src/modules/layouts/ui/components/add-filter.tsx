import { Command } from "cmdk";
import { Column } from "@tanstack/react-table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { CommandSearch } from "@/components/command-search";

import { ColumnType } from "@/modules/layouts/types";
import { useViewOptionsStore } from "../../store/use-view-options-store";
import { ViewOptionsContent, ViewOptionsHeader } from "./view-options";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props<T> {
  asChild?: boolean;
  columns: Column<T>[];
  children?: React.ReactNode;
  mode: "popover" | "component";
  onSelect: (column: Column<T>, type: ColumnType) => void;
}

function renderer<T>(columns: Column<T>[], onSelect: (column: Column<T>, type: ColumnType) => void) {
  return (
    <CommandSearch placeholder="Filter by...">
      <Command.Group>
        {columns.map((item) => {
          const Icon = item.columnDef.meta?.icon;
          const type = item.columnDef.meta?.variant;
          return (
            <Command.Item
              key={item.id}
              value={item.id}
              onSelect={() => onSelect(item, type ?? "text")}
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

export const AddFilter = <T,>({
  asChild,
  columns,
  children,
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

  if (viewOptions === "addFilter" && mode === "component") {
    return (
      <>
        <ViewOptionsHeader {...props} viewOptions={viewOptions} />
        <ScrollArea>
          <ViewOptionsContent>
            {renderer(columns, (column, type) => {
              onSelect(column, type);
              onChange("filter");
            })}
          </ViewOptionsContent>
        </ScrollArea>
      </>
    );
  }

  return null;
}