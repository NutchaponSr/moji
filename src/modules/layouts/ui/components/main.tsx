import { 
  ArrowDownUpIcon, 
  EyeIcon, 
  Link2Icon, 
  ListFilter, 
  ListIcon, 
  LockKeyholeIcon, 
  MoreHorizontalIcon, 
  TableRowsSplitIcon, 
  WorkflowIcon, 
  XIcon, 
} from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { 
  ViewOptionsContent, 
  ViewOptionsItem, 
  ViewOptionsSeparator 
} from "@/modules/layouts/ui/components/view-options";

import { layouts } from "@/modules/layouts/constants";
import { LayoutsType } from "@/modules/layouts/types";

import { useLayoutsStore } from "@/modules/layouts/store/use-layouts-store";
import { useViewOptionsStore } from "@/modules/layouts/store/use-view-options-store";
import { useFilter } from "../../hooks/use-filter";
import { useSort } from "../../hooks/use-sort";
import { useGrouping } from "../../hooks/use-grouping";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props<T> {
  table: Table<T>;
}

export const Main = <T,>({ table }: Props<T>) => {
  const { layout } = useLayoutsStore();
  const { isSorting } = useSort(table);
  const { grouping, isGrouping } = useGrouping();
  const { isFiltering, sortedItems } = useFilter();
  const { viewOptions, onChange } = useViewOptionsStore();

  const currentLayout = layouts.find((f) => f.slug === layout as LayoutsType) || layouts[0];
  const countColumns = table.getAllLeafColumns().filter((f) => f.id !== "actions" && f.getIsVisible()).length;
  const countSorts = table.getState().sorting.length;

  if (viewOptions !== null) return null;

  return (
    <>
      <div className="flex items-center pt-3.5 px-4 pb-1.5 h-10.5">
        <h4 className="grow font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis text-tertiary">
          View options
        </h4>
        <button className="transition flex items-center justify-center rounded-full bg-accent size-4.5 shrink-0 hover:bg-white/3">
          <XIcon className="size-3 text-secondary stroke-[2.5]" />
        </button>
      </div>

      <ScrollArea>
        <ViewOptionsContent>
          <ViewOptionsItem 
            label="Layout"
            icon={currentLayout.icon}
            description={currentLayout.label}
            onClick={() => onChange("layouts")}
          />
          <ViewOptionsItem 
            label="Property visibility"
            icon={EyeIcon}
            description={countColumns.toString()}
            onClick={() => onChange("property")}
          />
          <ViewOptionsItem 
            label="Filter"
            icon={ListFilter}
            description={sortedItems.length < 1 ? "" : `${sortedItems.length}`}
            onClick={() => onChange(isFiltering ? "filter" : "addFilter")}
          />
          <ViewOptionsItem 
            label="Sort"
            icon={ArrowDownUpIcon}
            description={countSorts < 1 ? "" : countSorts > 1 ? `${countSorts}`: table.getState().sorting[0].id}
            onClick={() => onChange(isSorting ? "sort" : "addSort")}
          />
          <ViewOptionsItem 
            label="Grouping"
            icon={TableRowsSplitIcon}
            description={grouping?.id}
            onClick={() => onChange(isGrouping ? "grouping" : "addGrouping")}
          />
          <ViewOptionsItem 
            label="Copy link to view"
            icon={Link2Icon}
            description=""
            action
          />
        </ViewOptionsContent>
        <ViewOptionsSeparator />
        <ViewOptionsContent>
          <div className="flex px-2 my-2 text-secondary text-xs font-medium select-none leading-[120%]">
            <p className="self-center whitespace-nowrap overflow-hidden text-ellipsis">
              Database settings
            </p>
          </div>
          <ViewOptionsItem 
            action
            label="Lock database"
            icon={LockKeyholeIcon}
          />
          <ViewOptionsItem 
            label="Edit property"
            icon={ListIcon}
          />
          <ViewOptionsItem 
            label="Automation"
            icon={WorkflowIcon}
          />
          <ViewOptionsItem 
            label="More settings"
            icon={MoreHorizontalIcon}
          />
        </ViewOptionsContent>
      </ScrollArea>
    </>
  );
}