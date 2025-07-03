import { Table } from "@tanstack/react-table";
import { useViewOptionsStore } from "../../store/use-view-options-store";
import { SortContent } from "./sort-content";
import { ViewOptionsContent, ViewOptionsHeader, ViewOptionsItem, ViewOptionsSeparator } from "./view-options";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { AddSort } from "./add-sort";
import { useSort } from "../../hooks/use-sort";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props<T> {
  table: Table<T>;
}

export const Sort = <T,>({ table }: Props<T>) => {
  const { addSort, onDelete } = useSort(table);
  const { viewOptions, ...props } = useViewOptionsStore();

  const columns = table.getAllColumns().filter((col) => !table.getState().sorting.some((s) => s.id === col.id));

  if (viewOptions !== "sort") return null;

  return (
    <>
      <ViewOptionsHeader {...props} viewOptions={viewOptions} />
      <ScrollArea>
        <ViewOptionsContent>
          <SortContent 
            table={table}
            columns={columns} 
          />
        </ViewOptionsContent>
        <ViewOptionsSeparator />
        <ViewOptionsContent>
          <AddSort 
            mode="popover" 
            columns={columns}
            onSelect={addSort}
          >
            <ViewOptionsItem 
              action
              icon={PlusIcon}
              label="Add sort"
            />
          </AddSort>
          <ViewOptionsItem 
            action
            onClick={onDelete}
            icon={Trash2Icon}
            label="Delete sort"
          />
        </ViewOptionsContent>
      </ScrollArea>
    </>
  );
}