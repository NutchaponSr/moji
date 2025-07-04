import { Row, Table } from "@tanstack/react-table";
import { useGrouped, useGrouping } from "../../hooks/use-grouping";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { DataTable } from "../components/data-table";
import { useState } from "react";
import { GroupingLayout } from "./grouping-layout";

interface Props<T> {
  table: Table<T>;
  filterData: (row: Row<T>) => boolean;
}

export const TableLayout = <T,>({ table, ...props }: Props<T>) => {
  const { isGrouping } = useGrouping();
  const { groupedData } = useGrouped(table);

  const [values, setValues] = useState<string[]>([]);

  return (
    <div className="relative float-left min-w-full pb-[180px] px-24 mt-1">
      {isGrouping ? (
        <Accordion type="multiple" value={values} onValueChange={(value) => setValues(value)}>
          {groupedData.filter((f) => !f.hidden).map((value) => (
            <AccordionItem key={value.label} value={value.label}>
              <GroupingLayout 
                {...props}
                value={value.label}
                row={value.data}
                table={table}
                isOpen={values.includes(value.label)}
              />  
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
}