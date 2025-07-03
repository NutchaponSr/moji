import { 
  closestCenter, 
  DndContext, 
  DragEndEvent, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { 
  restrictToFirstScrollableAncestor, 
  restrictToVerticalAxis 
} from "@dnd-kit/modifiers";
import { 
  SortableContext, 
  useSortable 
} from "@dnd-kit/sortable";
import { 
  EyeIcon, 
  GripVerticalIcon,
  LucideIcon 
} from "lucide-react";
import { Command } from "cmdk";
import { CSS } from "@dnd-kit/utilities";
import { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { CommandSearch } from "@/components/command-search";

import { ViewOptionsContent, ViewOptionsHeader } from "@/modules/layouts/ui/components/view-options";

import { useColumnProperty } from "@/modules/layouts/hooks/use-column-property";
import { useViewOptionsStore } from "@/modules/layouts/store/use-view-options-store";

interface Props<T> {
  table: Table<T>;
}

export const Properties = <T,>({ table }: Props<T>) => {
  const { viewOptions, ...props } = useViewOptionsStore();

  const {
    displayableColumns,
    handleDragEnd,
    handleColumnToggle,
    handleShowAllColumns,
    handleHideAllColumns,
  } = useColumnProperty({ table, viewOptions });

  if (viewOptions !== "property") return null;

  return (
    <>
      <ViewOptionsHeader {...props} viewOptions={viewOptions} />
      <ViewOptionsContent>
        <CommandSearch placeholder="Search for a property...">
          <PropertyGroup 
            label="Shown in table"
            action="hide all"
            onDragEnd={handleDragEnd}
            onClick={handleHideAllColumns}
          >
            <SortableContext items={displayableColumns.filter((f) => f.getIsVisible())}>
              {displayableColumns.filter((f) => f.getIsVisible()).map((col) => {
                const icon = col.columnDef.meta?.icon;

                return (
                  <PropertyItem 
                    canDrag
                    key={col.id}
                    icon={icon}
                    label={col.id}
                    canHide={col.getCanHide()}
                    onToggle={() => handleColumnToggle(col.id)}
                  />
                );
              })}
            </SortableContext>
          </PropertyGroup>
          {displayableColumns.filter((f) => !f.getIsVisible()).length > 0 && (
            <PropertyGroup 
              label="Hidden in table"
              action="show all"
              onDragEnd={handleDragEnd}
              onClick={handleShowAllColumns}
            >
              {displayableColumns.filter((f) => !f.getIsVisible()).map((col) => {
                const icon = col.columnDef.meta?.icon;

                return (
                  <PropertyItem 
                    key={col.id}
                    icon={icon}
                    label={col.id}
                    canHide={col.getCanHide()}
                    onToggle={() => handleColumnToggle(col.id)}
                  />
                );
              })}
            </PropertyGroup>
          )}
        </CommandSearch>
      </ViewOptionsContent>
    </>
  );
}

interface PropertyGroupProps {
  label: string;
  action: string;
  children: React.ReactNode;
  onClick: () => void;
  onDragEnd: (e: DragEndEvent) => void;
}

const PropertyGroup = ({
  label,
  action,
  children,
  onClick,
  onDragEnd
}: PropertyGroupProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  return (
    <Command.Group className="py-2">
      <div className="flex items-center justify-between px-2 py-1 text-xs font-medium text-tertiary">
        {label}
        <div 
          role="button"
          onClick={onClick}
          className="transition cursor-pointer inline-flex items-center rounded-sm py-0.5 px-1.5 whitespace-nowrap leading-[1.2] text-marine hover:bg-marine/7"
        >
          {action}
        </div>
      </div>
      <div className="flex flex-col gap-px overflow-auto">
        <DndContext
          sensors={sensors} 
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
          onDragEnd={onDragEnd}
        >
          {children}
        </DndContext>
      </div>
    </Command.Group>
  );
}

interface PropertyItemProps {
  icon?: LucideIcon;
  label: string;
  canHide: boolean;
  canDrag?: boolean;
  onToggle: () => void;
}

const PropertyItem = ({
  icon: Icon,
  label,
  canHide,
  canDrag,
  onToggle
}: PropertyItemProps) => {
  const { 
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef 
  } = useSortable({ id: label });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <Command.Item value={label} ref={setNodeRef} style={style} className="transition flex w-full rounded-sm">
      <div className="flex items-center gap-2 leading-[120%] w-full select-none min-h-7 text-sm px-2">
        <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
          <div className="flex items-center gap-2">
            <div 
              {...attributes} 
              {...listeners} 
              className={cn(
                "flex items-center justify-center w-4.5 h-6 shrink-0 rounded cursor-grab hover:bg-accent",
                !canDrag && "hover:bg-transparent opacity-50 -z-1"
              )}
            >
              <GripVerticalIcon className="size-4 text-muted" />
            </div>
            {Icon && <Icon className="size-4.5 text-primary" />}
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
              onClick={onToggle}
              disabled={!canHide}
              className={cn(!canHide && "opacity-50")}
            >
              <EyeIcon />
            </Button>
          </div>
        </div>
      </div>
    </Command.Item>
  );
}