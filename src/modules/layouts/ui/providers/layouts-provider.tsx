import { Table } from "@tanstack/react-table";
import { useLayoutsStore } from "../../store/use-layouts-store"
import { TableLayout } from "../layouts/table-layout";
import { useEffect } from "react";

interface Props<T> {
  table: Table<T>;
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