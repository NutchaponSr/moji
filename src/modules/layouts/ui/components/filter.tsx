import { useViewOptionsStore } from "@/modules/layouts/store/use-view-options-store";
import { ViewOptionsContent, ViewOptionsHeader, ViewOptionsItem, ViewOptionsSeparator } from "./view-options";
import { FilterList } from "./filter-list";
import { useFilter } from "../../hooks/use-filter";
import { Table } from "@tanstack/react-table";
import { PlusCircleIcon } from "lucide-react";
import { AddFilter } from "./add-filter";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props<T> {
  table: Table<T>;
}

export const Filter = <T,>({ table }: Props<T>) => {
  const {
    sortedItems,
    connector,
    addFilter,
    addFilterGroup,
    updateFilter,
    updateGroup,
    removeFilter,
    removeGroup,
    setConnector
  } = useFilter();
  const { viewOptions, ...props } = useViewOptionsStore();
  
  if (viewOptions !== "filter") return null;

  return (
    <>
      <ViewOptionsHeader {...props} viewOptions={viewOptions} />
      <ScrollArea>
        <ViewOptionsContent>
          <FilterList
            items={sortedItems}
            columns={table.getAllColumns()}
            connector={connector}
            onChangeConnector={setConnector}
            onUpdateFilter={updateFilter}
            onRemoveFilter={removeFilter}
            onUpdateGroup={updateGroup}
            onRemoveGroup={removeGroup}
          />
        </ViewOptionsContent>
        <ViewOptionsSeparator />
        <ViewOptionsContent>
          <AddFilter
            mode="popover"
            columns={table.getAllColumns()}
            onSelect={addFilter}
          >
            <ViewOptionsItem 
              action
              icon={PlusCircleIcon}
              label="Add condition"
            />
          </AddFilter>
          <ViewOptionsItem 
            action
            onClick={addFilterGroup}
            icon={PlusCircleIcon}
            label="Add condition group"
          />
        </ViewOptionsContent>
      </ScrollArea>
    </>
  );
}