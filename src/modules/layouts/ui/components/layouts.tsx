import { Icon } from "@iconify-icon/react";

import { cn } from "@/lib/utils";

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

import { ViewOptionsContent, ViewOptionsHeader, ViewOptionsItem } from "./view-options";

import { layouts, peeks } from "../../constants";

import { useLayoutsStore } from "../../store/use-layouts-store";
import { useViewOptionsStore } from "../../store/use-view-options-store";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Layouts = () => {
  const { 
    layout, 
    peek,
    showLine,
    showIcon,
    onChangeLayout,
    onChangePeek,
    onChangeLine,
    onChangeIcon
  } = useLayoutsStore();
  const { viewOptions, ...props } = useViewOptionsStore();

  if (viewOptions !== "layouts") return null;

  return (
    <>
      <ViewOptionsHeader {...props} viewOptions={viewOptions} />
      <ScrollArea>
        <ViewOptionsContent>
          <div className="grid grid-cols-4 gap-2">
            {layouts.map((lay) => (
              <button
                key={lay.label}
                onClick={() => onChangeLayout(lay.slug)}
                className={cn(
                  "transition flex flex-col items-center w-full text-[11px] rounded-sm p-1.5 shadow-[inset_0_0_0_1px_rgba(55,53,47,0.09)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.094)] text-secondary hover:bg-accent",
                  layout === lay.slug && "shadow-[inset_0_0_0_1.5px_rgb(35,131,226)] text-marine hover:bg-transparent"
                )}
              >
                <lay.icon className="size-4.5 stroke-[1.7] shrink-0 my-1" />
                <p>{lay.label}</p>
              </button>
            ))}
          </div>
        </ViewOptionsContent>
        <ViewOptionsContent>
          <ViewOptionsItem 
            label="Show vertical lines"
            action={<Switch checked={showLine} onCheckedChange={onChangeLine} />}
          />
          <ViewOptionsItem 
            label="Show page icon"
            action={<Switch checked={showIcon} onCheckedChange={onChangeIcon} />}
          />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <ViewOptionsItem 
                label="Open pages in"
                description={peeks[peek].label}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1 gap-px flex flex-col relative w-[250px]">
              {Object.values(peeks).map((p) => (
                <DropdownMenuItem 
                  key={p.slug}
                  onClick={() => onChangePeek(p.slug)}
                  className="flex items-center gap-2 leading-[120%] w-full h-auto text-sm"
                >
                  <div className="flex items-center justify-center self-start size-5 mt-0.5">
                    <p.icon className="size-5 shrink-0 text-tertiary stroke-[1.7]" />
                  </div>
                  <div className="grow text-start">
                    <h3 className="whitespace-nowrap overflow-hidden text-ellipsis">{p.label}</h3>
                    <div className="mt-1 text-xs text-tertiary break-words">
                      {p.description}
                      {p.default && (
                        <p className="mt-0.5 font-medium text-marine">Default for table</p>
                      )}
                    </div>
                  </div>
                  {p.slug === peek && (
                    <div className="flex items-center justify-center self-start size-5 mt-0.5">
                      <Icon icon="si:check-alt-fill" width={16} height={16} />
                    </div>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ViewOptionsContent>
      </ScrollArea>
    </>
  );
}