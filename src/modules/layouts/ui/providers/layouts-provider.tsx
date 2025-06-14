import { useLayoutsStore } from "../../store/use-layouts-store"
import { TableLayout } from "../layouts/table-layout";

interface Props {
  query: { year: string };
}

export const LayoutsProvider = ({ ...props}: Props) => {
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