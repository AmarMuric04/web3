import type { ColumnDef, Table } from "@tanstack/react-table";

export function handleExportTableToCSV<T>(
  table: Table<T>,
  columns: ColumnDef<T>[]
) {
  const rows = table.getRowModel().rows;

  const headers = columns
    .flatMap((colGroup) =>
      "columns" in colGroup ? colGroup.columns : [colGroup]
    )
    .map((col) => col!.header as string);

  const csvRows = rows.map((row) =>
    row.getVisibleCells().map((cell) => cell.getValue())
  );

  const csvContent = [headers, ...csvRows]
    .map((row) =>
      row
        .map((value) => `"${(value ?? "").toString().replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "coins.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
