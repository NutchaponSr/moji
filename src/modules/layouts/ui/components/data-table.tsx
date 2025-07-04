import { flexRender, Table as TB } from "@tanstack/react-table";
interface Props<T> {
  table: TB<T>;
}

export const DataTable = <T,>({ table }: Props<T>) => {
  return (
    <table className="relative w-full overflow-x-auto">
      <thead className="shadow-[inset_0_-1px_0_rgb(233,233,231)] dark:shadow-[inset_0_-1px_0_rgb(47,47,47)] flex bg-background z-87 h-9 text-tertiary min-w-[calc(100%-192px)] left-0 right-0 relative box-border">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="inline-flex relative">
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="flex shrink-0 overflow-hidden text-sm group/row"
              style={{ width: header.column.columnDef.meta?.width }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header,header.getContext())
              }
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody className="relative isolation-auto min-w-[calc(100%-192px)]">
        {table.getRowModel().rows.length ? (  
          table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="w-full border-b border-accent-foreground h-9 transition-colors flex relative group/row">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-accent-foreground align-middle whitespace-nowrap not-first:border-r"
                  style={{ width: cell.column.columnDef.meta?.width }}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td 
              colSpan={table.getAllColumns().length} 
              className="text-xs text-tertiary leading-4 whitespace-nowrap overflow-hidden text-ellipsis h-8 px-1 py-2 border-t border-border"
            >
              No links
            </td>
          </tr>
        )}
      </tbody>
    </table>
  ); 
}