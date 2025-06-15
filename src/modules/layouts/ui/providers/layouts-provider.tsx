import { Table } from "@tanstack/react-table";
import { useLayoutsStore } from "../../store/use-layouts-store"
import { TableLayout } from "../layouts/table-layout";

interface Props<T> {
  table: Table<T>;
}

export const LayoutsProvider = <T,>({ ...props}: Props<T>) => {
  const { layout } = useLayoutsStore();

  switch (layout) {
    case "table":
      return (
        <TableLayout {...props} />
      );
    default:
      break;
  }
}