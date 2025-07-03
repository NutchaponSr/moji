import { Row, Table } from "@tanstack/react-table";
import { useLayoutsStore } from "../../store/use-layouts-store"
import { TableLayout } from "../layouts/table-layout";
import { useEffect } from "react";
import { GroupingProps } from "../../types";

interface Props<T> {
  table: Table<T>;
  groupedData: GroupingProps<T>[];
  filterData: (row: Row<T>) => boolean;
}

export const LayoutsProvider = <T,>({ ...props}: Props<T>) => {
  const { layout } = useLayoutsStore();

  useEffect(() => {
    useLayoutsStore.persist.rehydrate();
  }, []);

  if (!layout) return null;

  switch (layout) {
    case "table":
      return (
        <TableLayout {...props} />
      );
    default:
      return null;
  }
}