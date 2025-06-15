import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ColumnResizeMode,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Search, TrendingUp, TrendingDown, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { rankItem } from "@tanstack/match-sorter-utils";
import type { FilterFn } from "@tanstack/react-table";
import { formatCurrency, formatLargeNumber } from "@/utility/formaters";
import type { CoinMarketData } from "@/types";
import { handleExportTableToCSV } from "@/utility/handlers";

interface CryptoTableProps {
  data: CoinMarketData[];
  title?: string;
  showSearch?: boolean;
  showExport?: boolean;
  showFavorites?: boolean;
  favorites?: string[];
  onToggleFavorite?: (coinId: string) => void;
  initialPageSize?: number;
  className?: string;
}

const bookmarkStyles = `
  .clip-bookmark {
    clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 60%, 0 75%);
  }
  .clip-bookmark-outline {
    clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 60%, 0 75%);
    background: transparent;
  }
`;

export function CryptoTable({
  data,
  title = "Market Overview",
  showSearch = true,
  showExport = true,
  showFavorites = false,
  favorites = [],
  onToggleFavorite,
  initialPageSize = 10,
  className = "",
}: CryptoTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(globalFilter);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(globalFilter);
    }, 300);
    return () => clearTimeout(timeout);
  }, [globalFilter]);

  const fuzzyFilter: FilterFn<CoinMarketData> = (
    row,
    _columnId,
    value,
    addMeta
  ) => {
    const coin = row.original;

    const searchableText = [coin.name, coin.symbol, coin.id]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const itemRank = rankItem(searchableText, value.toLowerCase());

    if (addMeta) {
      try {
        addMeta({
          itemRank,
        });
      } catch (error) {}
    }

    return itemRank.passed;
  };

  const columns: ColumnDef<CoinMarketData>[] = [
    {
      header: "Rank",
      accessorKey: "market_cap_rank",
      enableGlobalFilter: false,
      enableResizing: true,
      size: showFavorites ? 60 : 80,
      minSize: 50,
      cell: (info) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-semibold text-sm">
          {info.getValue() as number}
        </div>
      ),
    },
    {
      header: "Coin",
      accessorKey: "name",
      enableGlobalFilter: true,
      enableResizing: true,
      size: showFavorites ? 280 : 320,
      minSize: 200,
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.image || "/placeholder.svg?height=32&width=32"}
              alt={row.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 max-w-sm truncate">
              <div className="font-semibold truncate">{row.name}</div>
              <div className="text-sm text-muted-foreground uppercase">
                {row.symbol}
              </div>
            </div>
            {showFavorites && onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(row.id);
                }}
                className="h-8 w-8 p-0 hover:bg-muted/80 transition-all duration-200 group"
                title={
                  favorites.includes(row.id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <div className="relative">
                  {favorites.includes(row.id) ? (
                    <div className="w-4 h-5 bg-amber-500 clip-bookmark relative group-hover:bg-amber-600 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-400 to-amber-600"></div>
                    </div>
                  ) : (
                    <div className="w-4 h-5 border-2 border-muted-foreground/40 clip-bookmark-outline group-hover:border-amber-500 transition-colors"></div>
                  )}
                </div>
              </Button>
            )}
          </div>
        );
      },
    },
    {
      header: "Price",
      accessorKey: "current_price",
      enableGlobalFilter: false,
      enableResizing: true,
      size: 400,
      minSize: 150,
      maxSize: 700,
      cell: (info) => {
        const value = info.getValue() as number;
        return <div className="font-semibold">{formatCurrency(value)}</div>;
      },
    },
    {
      header: "24h Change",
      accessorKey: "price_change_percentage_24h",
      enableGlobalFilter: false,
      enableResizing: true,
      size: 300,
      minSize: 100,
      maxSize: 400,
      cell: (info) => {
        const value = info.getValue() as number;
        const isPositive = value > 0;
        return (
          <div className="flex items-center gap-1">
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className={`${
                isPositive
                  ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(value).toFixed(2)}%
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Market Cap",
      accessorKey: "market_cap",
      enableGlobalFilter: false,
      enableResizing: true,
      size: 130,
      minSize: 100,
      maxSize: 200,
      cell: (info) => {
        const value = info.getValue() as number;
        return (
          <div className="font-medium text-muted-foreground">
            {formatLargeNumber(value)}
          </div>
        );
      },
    },
    {
      header: "Volume (24h)",
      accessorKey: "total_volume",
      enableGlobalFilter: false,
      enableResizing: true,
      size: 130,
      minSize: 100,
      maxSize: 200,
      cell: (info) => {
        const value = info.getValue() as number;
        return (
          <div className="font-medium text-muted-foreground">
            {formatLargeNumber(value)}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      globalFilter: debouncedValue,
    },
    globalFilterFn: fuzzyFilter,
    enableColumnResizing: true,
    columnResizeMode,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: bookmarkStyles }} />
      <Card className={`shadow-lg ${className}`}>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <div className="flex flex-wrap gap-4 items-center">
              {showSearch && (
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search cryptocurrencies..."
                    className="pl-10"
                  />
                </div>
              )}
              {showExport && (
                <Button
                  variant="outline"
                  onClick={() => handleExportTableToCSV(table, columns)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-sm font-semibold cursor-pointer select-none hover:bg-muted/80 transition-colors relative"
                        style={{
                          width: header.getSize(),
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() === "asc" && (
                            <span className="text-primary">↑</span>
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <span className="text-primary">↓</span>
                          )}
                          {!header.column.getIsSorted() && (
                            <span className="text-muted-foreground">↕</span>
                          )}
                        </div>
                        <div
                          className="absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none opacity-0 hover:opacity-100 active:opacity-100"
                          {...{
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                          }}
                        />
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap"
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between gap-4 border-t">
            <div className="flex items-center gap-2">
              <Label htmlFor="pageSize" className="text-sm">
                Show
              </Label>
              <select
                id="pageSize"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm bg-background"
              >
                {[10, 20, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>

        {data && table.getRowModel().rows.length === 0 && (
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No cryptocurrencies found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </CardContent>
        )}
      </Card>
    </>
  );
}
