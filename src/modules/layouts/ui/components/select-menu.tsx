import { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";

interface Props<T> {
  table: Table<T>;
}

export const SelectMenu = <T,>({ table }: Props<T>) => {
  const countRowSelected = table.getSelectedRowModel().rows.length;
  const isSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  return (
    <div className={cn(
      "absolute -top-1 left-[94px] z-999 w-fit transition-opacity opacity-0 invisible", 
      isSelected && "visible opacity-100"
    )}>
      <div className="inline-flex items-center justify-center rounded bg-popover h-8 dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.16),0_0_0_1px_rgba(255,255,255,0.094)]">
        <Button variant="ghost" className="rounded-l rounded-r-none text-marine">
          {countRowSelected} selected
        </Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" className="rounded-none w-7">
          <Trash2Icon />
        </Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" className="rounded-l-none rounded-r w-7">
          <MoreHorizontalIcon />
        </Button>
      </div>
    </div>
  );
}