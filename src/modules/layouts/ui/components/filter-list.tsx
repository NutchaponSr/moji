import { Column } from "@tanstack/react-table";

import { Filter, FilterGroup } from "@/modules/layouts/types";

import { Renderer } from "@/modules/layouts/ui/components/renderer";
import { ConnectorDropdown } from "@/modules/layouts/ui/components/connector-dropdown";

interface Props<T> {
  items: (Filter<T> | FilterGroup<T>)[];
  columns: Column<T>[];
  connector: "and" | "or";
  onChangeConnector: (connector: "and" | "or") => void;
  onUpdateFilter: (filterId: number, filter: Filter<T>) => void;
  onUpdateGroup: (groupId: number, group: FilterGroup<T>) => void;
  onRemoveFilter: (filterId: number) => void;
  onRemoveGroup: (groupId: number) => void;
}

export const FilterList = <T,>({
  items,
  columns,
  connector,
  onChangeConnector,
  onUpdateFilter,
  onUpdateGroup,
  onRemoveFilter,
  onRemoveGroup
}: Props<T>) => {
  const [firstItem, ...restItems] = items;

  if (!firstItem) return null;

  return (
    <div className="flex flex-col p-2 h-full">
      <div className="my-1 flex w-full items-center gap-2">
        <div className="shrink-0 min-w-16 text-center box-border">
          <span className="text-sm text-primary px-1 font-medium uppercase">
            Where
          </span>
        </div>
        <Renderer
          item={firstItem}
          columns={columns}
          onUpdateFilter={onUpdateFilter}
          onRemoveFilter={onRemoveFilter}
          onUpdateGroup={onUpdateGroup}
          onRemoveGroup={onRemoveGroup}
        />
      </div>

      {restItems.length > 0 && (
        <div className="h-full w-full relative flex gap-2">
          <div className="w-16 min-w-16 relative">
            <div className="absolute border-l-[1.5px] border-dashed border-border h-full left-1/2">
              <ConnectorDropdown
                connector={connector}
                onChange={onChangeConnector}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-[calc(100%-64px)]">
            {restItems.map((item) => (
              <Renderer
                key={item.id}
                item={item}
                columns={columns}
                onUpdateFilter={onUpdateFilter}
                onRemoveFilter={onRemoveFilter}
                onUpdateGroup={onUpdateGroup}
                onRemoveGroup={onRemoveGroup}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 