import { Row, Table } from "@tanstack/react-table";
import { useGroupingTable } from "../../hooks/use-grouping";
import { DataTable } from "../components/data-table";
import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, PlusIcon, TriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props<T> {
  value: string;
  row: T[];
  table: Table<T>;
  isOpen: boolean;
  filterData: (row: Row<T>) => boolean;
}

export const GroupingLayout = <T,>({ value, isOpen, ...props }: Props<T>) => {
  const groupingTable = useGroupingTable({ ...props });

  return (
    <div className="relative w-full group">
      <div className="h-10.5 z-87 relative bg-transparent text-sm">
        <div className="flex items-center h-full sticky left-24">
          <div className="flex items-center gap-1.5 h-full overflow-hidden">
            <AccordionTrigger asChild>
              <Button variant="icon" size="smIcon">
                <TriangleIcon className={cn("rotate-90 stroke-primary fill-primary size-3.5 transition", isOpen && "rotate-180")} />
              </Button>
            </AccordionTrigger>
            <div className="flex items-center leading-6 whitespace-nowrap overflow-hidden font-semibold max-w-100">
              <p className="whitespace-nowrap text-ellipsis overflow-hidden text-primary">
                {value}
              </p>
            </div>

            <div className="flex items-center">
              <Button variant="icon" size="smIcon" className="opacity-0 group-hover:opacity-100">
                <MoreHorizontalIcon />
              </Button>
              <Button variant="icon" size="smIcon" className="opacity-0 group-hover:opacity-100">
                <PlusIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AccordionContent className="mb-3s">
        <DataTable table={groupingTable} />
      </AccordionContent>
    </div>
  );
}