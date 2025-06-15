import { 
  ArrowUpDownIcon,
  FilterIcon, 
  SearchIcon, 
  ZapIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGroupQuery } from "@/modules/groups/hooks/use-group-query";

export const Toolbar = () => {
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
          <div className="flex flex-row items-center justify-end h-full gap-0.5">
            <Button variant="icon" size="icon">
              <FilterIcon />
            </Button>
            <Button variant="icon" size="icon">
              <ArrowUpDownIcon />
            </Button>
            <Button variant="icon" size="icon">
              <ZapIcon />
            </Button>
            <Button variant="icon" size="icon">
              <SearchIcon />
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