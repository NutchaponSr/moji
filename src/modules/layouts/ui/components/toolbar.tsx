import { 
  SearchIcon, 
  Settings2Icon, 
  ZapIcon
} from "lucide-react";
import { Icon } from "@iconify-icon/react";
import { Table } from "@tanstack/react-table";
import { useToggle } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { SortPopover } from "@/modules/layouts/ui/components/sort-popover";
import { FilterPopover } from "@/modules/layouts/ui/components/filter-popover";

import { useGroupQuery } from "@/modules/groups/hooks/use-group-query";

interface Props<T> {
  table: Table<T>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
} 

export const Toolbar = <T,>({ 
  table,
  value,
  onChange,
  onClear
}: Props<T>) => {
  const [showSearch, toggle] = useToggle(false);

  const [, setQuery] = useGroupQuery();

  return (
    <ScrollArea className="px-24 min-h-9 sticky left-0 shrink-0 x-86 w-full">
      <div className="flex items-center h-9 left-24 w-full border-b-[1.5px]">
        <TabsList className="flex items-center h-full grow overflow-hidden">
          <TabsTrigger value="2025" onClick={() => setQuery({ year: "2025" })}>
            2025
          </TabsTrigger>
          <TabsTrigger value="2024" onClick={() => setQuery({ year: "2024" })}>
            2024
          </TabsTrigger>
        </TabsList>
        <div className="grow h-full">
          <div className="flex flex-row items-center justify-end h-full gap-1">
            <FilterPopover columns={table.getAllColumns()} />
            <SortPopover table={table} />
            <Button variant="icon" size="icon">
              <ZapIcon />
            </Button>

            <Button variant="icon" size="icon" onClick={() => toggle()}>
              <SearchIcon />
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

            <Button variant="icon" size="icon">
              <Settings2Icon />
            </Button>
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