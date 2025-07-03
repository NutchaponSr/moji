import { 
  SearchIcon, 
  Settings2Icon, 
  WorkflowIcon
} from "lucide-react";
import {
  useCallback, 
  useEffect, 
  useRef, 
  useState 
} from "react";
import { Icon } from "@iconify-icon/react";
import { Table } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";

import { useToggle } from "@/hooks/use-toggle";

import { 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ScrollArea, 
  ScrollBar 
} from "@/components/ui/scroll-area";
import { 
  Popover, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { SortPopover } from "@/modules/layouts/ui/components/sort-popover";
import { FilterPopover } from "@/modules/layouts/ui/components/filter-popover";
import { ViewOptionsSidebar } from "@/modules/layouts/ui/components/view-options-sidebar";

interface Props<T> {
  tabLists: {
    value: string;
    onChange: () => void;
  }[];
  table: Table<T>;
  value: string;
  onClear: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} 

export const Toolbar = <T,>({ 
  table,
  tabLists,
  value,
  onChange,
  onClear
}: Props<T>) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const [showSearch, toggleSearch] = useToggle(false);
  const [showSidebar, toggleSidebar, setSidebar] = useToggle(false);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    setSidebar(false);
  }, [setSidebar]);

  useEffect(() => {
    if (showSidebar && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();

      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      setPosition({
        top: triggerRect.bottom + scrollY + 6,
        left: triggerRect.left + scrollX + triggerRect.width / 2,
      });
    }
  }, [showSidebar]);

  return (
    <ScrollArea className="px-24 min-h-9 sticky left-0 shrink-0 x-86 w-full">
      <div className="flex items-center h-9 left-24 w-full border-b-[1.5px]">
        <TabsList className="flex items-center h-full grow overflow-hidden">
          {tabLists.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={tab.onChange}
            >
              {tab.value}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="grow h-full">
          <div className="flex flex-row items-center justify-end h-full gap-1">
            <FilterPopover table={table} />
            <SortPopover table={table} />
            <Button variant="icon" size="icon">
              <WorkflowIcon className="size-4.5" />
            </Button>

            <Button variant="icon" size="icon" onClick={toggleSearch}>
              <SearchIcon className="size-4.5" />
            </Button>
            <AnimatePresence>
              {showSearch && (
                <motion.div 
                  initial={{ width: 0, opacity: 0, x: 20 }}
                  animate={{ width: 200, opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden w-[150px]"
                >
                  <div className="flex items-center gap-1 overflow-hidden">
                    <input 
                      value={value}
                      onChange={onChange}
                      placeholder="Type to search..."
                      className="border-none w-full block text-sm leading-none focus:outline-none text-primary placeholder:text-muted"
                    />
                    {value && (
                      <button onClick={onClear} className="inline-flex transition items-center justify-center shrink-0 rounded-full hover:bg-accent h-6 w-6">
                        <Icon icon="solar:close-circle-bold" width={20} height={20} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Popover
              modal
              open={showSidebar}
              onOpenChange={handleClose}
            >
              <PopoverTrigger asChild>
                <Button variant="icon" size="icon" onClick={() => setTimeout(() => toggleSidebar(), 50)}>
                  <Settings2Icon className="size-4.5" />
                </Button>
              </PopoverTrigger>
              <ViewOptionsSidebar 
                table={table}
                position={position}
                onClose={handleClose}
              />
            </Popover>
            <div className="ml-1">
              <Button variant="primary" size="sm" className="font-semibold">
                New
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}