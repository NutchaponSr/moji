import { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { PopoverContent } from "@/components/ui/popover";

import { Main } from "@/modules/layouts/ui/components/main";
import { Layouts } from "@/modules/layouts/ui/components/layouts";
import { Properties } from "@/modules/layouts/ui/components/properties";

import { AUTO_WIDTH } from "@/modules/layouts/constants";

import { useViewOptionsStore } from "@/modules/layouts/store/use-view-options-store";
import { Filter } from "./filter";
import { AddFilter } from "./add-filter";
import { useFilter } from "../../hooks/use-filter";
import { AddSort } from "./add-sort";
import { Sort } from "./sort";
import { useSort } from "../../hooks/use-sort";
import { AddGrouping } from "./add-grouping";
import { Grouping } from "./grouping";
import { GroupingProps } from "../../types";
import { DragEndEvent } from "@dnd-kit/core";

interface Props<T> {
  position: {
    top: number;
    left: number;
  };
  table: Table<T>;
  hasAllHide: boolean;
  groupedData: GroupingProps<T>[];
  visibilityManager: {
    hideGroup: (groupLabel: string) => void;
    showGroup: (groupLabel: string) => void;
    toggleAllGroups: () => void;
  },
  onClose: () => void;
  onDragEnd: (e: DragEndEvent) => void;
}

export const ViewOptionsSidebar = <T,>({ position, ...props }: Props<T>) => {
  const { isFiltering, addFilter } = useFilter();
  const { isSorting, addSort } = useSort(props.table);
  const { viewOptions, onChange } = useViewOptionsStore();

  const autoWidth = (isFiltering || isSorting) && viewOptions !== null && AUTO_WIDTH.includes(viewOptions);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const calculateHeight = () => {
      const windowHeight = window.innerHeight;
      const topPosition = position.top;
      const maxHeight = windowHeight - topPosition;

      setHeight(maxHeight);
    }

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [position.top]);

  useEffect(() => {
    if (!isFiltering && viewOptions === "filter") {
      onChange("addFilter");
    }

    if (!isSorting && viewOptions === "sort") {
      onChange("addSort");
    }
  }, [isFiltering, isSorting, viewOptions, onChange]);

  return (
    <PopoverContent
      align="end"
      side="bottom"
      sideOffset={4.5}
      alignOffset={-152}
      style={{ height: `${Math.max(height-1, 300)}px`}}
      className={cn(
        "p-0 rounded-none w-[calc(290px+96px)] bg-background dark:shadow-none border-l shadow-none",
        autoWidth && "w-auto"
      )}
    >
      <div className="flex h-full">
        <div className={cn(
          "flex flex-col min-w-[290px] w-[290px] h-full max-h-full", 
          autoWidth && "min-w-auto w-auto"
        )}>
          <Main {...props} />
          <Layouts />
          <Properties {...props} />
          <AddFilter 
            mode="component" 
            columns={props.table.getAllColumns()} 
            onSelect={addFilter} 
          />
          <Filter {...props} />
          <AddSort 
            mode="component"
            columns={props.table.getAllColumns()}
            onSelect={addSort}
          />
          <Sort {...props} />
          <AddGrouping {...props} />
          <Grouping {...props} />
        </div>
        <div className="w-24" />
      </div>
    </PopoverContent>
  );
}