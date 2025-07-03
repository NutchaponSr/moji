import { useViewOptionsStore } from "@/modules/layouts/store/use-view-options-store";
import { ViewOptionsContent, ViewOptionsHeader, ViewOptionsItem, ViewOptionsSeparator } from "./view-options";
import { useGrouping } from "../../hooks/use-grouping";
import { EyeIcon, EyeOffIcon, GripVerticalIcon, Trash2Icon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { groupingBy } from "../../constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
interface Props<T> {
  table: Table<T>;
}

export const Grouping = <T,>({ 
  table
}: Props<T>) => {
  const {
    grouping, 
    groupingType, 
    groupingSort,
    groupedData,
    hasAllHide,
    onToggleAll,
    onHide,
    onDragEnd,
    onShow,
    onRemove, 
    getSortOptions,
    getGroupingDescription,
    getGroupingOptions,
    onChangeOption,
    onChangeSort,
  } = useGrouping(table);

  const { viewOptions, onChange, ...props } = useViewOptionsStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  if (viewOptions !== "grouping" || grouping === null || !groupingType) return null;

  return (
    <>  
      <ViewOptionsHeader {...props} viewOptions={viewOptions} />
      <ScrollArea>
        <ViewOptionsContent>
          <ViewOptionsItem 
            label="Group by"
            onClick={() => onChange("addGrouping")}
            description={grouping.id}
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ViewOptionsItem 
                label={groupingBy[groupingType].label}
                description={getGroupingDescription()}
                onClick={() => {}}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {getGroupingOptions(groupingType).map((item) => (
                <DropdownMenuItem key={item.value} onClick={() => onChangeOption(item.value)}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ViewOptionsItem 
                label="Sort"
                description={getSortOptions(groupingType).find((f) => f.value === groupingSort)?.label}
                onClick={() => {}}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {getSortOptions(groupingType).map((item) => (
                <DropdownMenuItem key={item.value} onClick={() => onChangeSort(item.value)}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ViewOptionsContent>
        <ViewOptionsSeparator />
        <ViewOptionsContent>
          <div className="flex flex-col gap-1 overflow-auto">
            <div className="flex items-center justify-between px-2 py-1 text-xs font-medium text-tertiary">
              Groups
              <div 
                role="button"
                onClick={onToggleAll}
                className="transition cursor-pointer inline-flex items-center rounded-sm py-0.5 px-1.5 whitespace-nowrap leading-[1.2] text-marine hover:bg-marine/7"
              >
                {hasAllHide ? "Show all" : "Hide all"}
              </div>
            </div>
            <DndContext
              sensors={sensors}
              onDragEnd={onDragEnd}
              collisionDetection={closestCenter}
              modifiers={[
                restrictToFirstScrollableAncestor,
                restrictToVerticalAxis
              ]}
            >
              <SortableContext items={groupedData.map((i) => (i.label))}>
                {groupedData.map((item) => (
                  <GroupingItem 
                    key={item.label}
                    label={item.label}
                    isHidden={item.hidden}
                    onClick={() => item.hidden 
                      ? onShow(item.label) 
                      : onHide(item.label)
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </ViewOptionsContent>
        <ViewOptionsSeparator />
        <ViewOptionsContent>
          <ViewOptionsItem 
            action
            onClick={() => {
              onRemove();
              onChange("addGrouping");
            }}
            icon={Trash2Icon}
            label="Remove grouping"
          />
        </ViewOptionsContent>
      </ScrollArea>
    </>
  );
}


export const GroupingItem = ({
  label,
  isHidden,
  onClick
}: {
  label: string;
  isHidden: boolean;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef
  } = useSortable({ id: label });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 leading-[120%] w-full select-none min-h-7 text-sm px-2">
      <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
        <div className="flex items-center gap-2">
          <div 
            {...attributes} 
            {...listeners} 
            className="flex items-center justify-center w-4.5 h-6 shrink-0 rounded cursor-grab hover:bg-accent"
          >
            <GripVerticalIcon className="size-4 text-muted" />
          </div>
          <span className="text-primary first-letter:uppercase">
            {label}
          </span>
        </div>
      </div>
  
      <div className="ml-auto shrink-0">
        <div className="flex items-center gap-1.5"> 
          <Button 
            size="smIcon" 
            variant="ghost" 
            onClick={onClick}
          >
            {isHidden ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
}