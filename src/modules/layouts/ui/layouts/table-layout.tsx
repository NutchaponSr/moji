interface Props {
  query: { year: string };
}

export const TableLayout = ({ query }: Props) => {
  return (
    <div>
      Table {query.year}
    </div>
  );
}