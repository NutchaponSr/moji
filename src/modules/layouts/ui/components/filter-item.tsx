import { Command } from "cmdk";
import { MoreHorizontalIcon, XIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { CommandSearch } from "@/components/command-search";

import { Filter } from "@/modules/layouts/types";

import { columnFilterOptions } from "@/modules/layouts/constants";

interface Props<T> {
  children: React.ReactNode;
  filter: Filter<T>;
  onRemove: () => void;
  onUpdate: (filter: Filter<T>) => void;
}

export const FilterItem = <T,>({ 
  children,
  filter,
  onRemove,
  onUpdate
}: Props<T>) => {
  const Icon = filter.column.columnDef.meta?.icon ?? (() => null);

  return (
    <div className="flex items-center rounded-sm h-6 border border-border bg-background text-xs text-primary w-fit">
      <div className="flex items-center gap-1 whitespace-nowrap px-2">
        <Icon className="size-4 stroke-[1.5]" />
        <span className="first-letter:uppercase text-ellipsis overflow-hidden ">
          {filter.column.id}
        </span>
      </div>
      <Separator orientation="vertical" />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="xs" className="rounded-none">
            {filter.operator}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-1 w-auto">
          <CommandSearch placeholder="Search...">
            <Command.Group>
              {columnFilterOptions[filter.columnType].map((option, index) => (
                <Command.Item 
                  key={index}
                  onSelect={() => onUpdate({ ...filter, operator: option })}
                  className="flex items-center gap-2 px-2 py-1 text-sm text-primary rounded-sm h-7 data-[selected=true]:bg-accent cursor-pointer"
                >
                  {option}
                </Command.Item>
              ))}
            </Command.Group>
          </CommandSearch>
        </PopoverContent>
      </Popover>
      <Separator orientation="vertical" />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="xs" className="rounded-none">
            {filter.value === "" 
              ? <MoreHorizontalIcon className="size-4" /> 
              : filter.value
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-1 w-auto">
          {children}
        </PopoverContent>
      </Popover>
      <Separator orientation="vertical" />
      <Button variant="ghost" size="xs" className="rounded-l-none" onClick={onRemove}>
        <XIcon />
      </Button>
    </div>
  );
}