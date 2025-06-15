import { useQuery } from "@tanstack/react-query";
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
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Loader2,
  AlertCircle,
  Settings,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { rankItem } from "@tanstack/match-sorter-utils";
import type { FilterFn } from "@tanstack/react-table";
import { ModeToggle } from "@/components/mode-toggle";
import { createFileRoute } from "@tanstack/react-router";

// CoinGecko API types
interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(globalFilter);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");

  // Mock user data
  const mockUser = {
    name: "Alex Thompson",
    email: "alex.thompson@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "AT",
  };

  function handleExport() {
    const rows = table.getRowModel().rows;

    // Define CSV headers (you can customize these)
    const headers = columns
      .flatMap((colGroup) =>
        "columns" in colGroup ? colGroup.columns : [colGroup]
      )
      .map((col) => col!.header as string);

    // Extract rows
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(globalFilter);
    }, 300);
    return () => clearTimeout(timeout);
  }, [globalFilter]);

  const fuzzyFilter: FilterFn<CoinMarketData> = (row, value, addMeta) => {
    const coin = row.original;

    // Create a combined search string that includes name, symbol, and id
    const searchableText = [coin.name, coin.symbol, coin.id]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    // Use match-sorter with more permissive options for better typo tolerance
    const itemRank = rankItem(searchableText, value.toLowerCase());

    // Store the ranking info for sorting
    if (addMeta) {
      try {
        addMeta({
          itemRank,
        });
      } catch (error) {}
    }

    return itemRank.passed;
  };

  const query = useQuery<CoinMarketData[]>({
    queryKey: ["coins"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const columns: ColumnDef<CoinMarketData>[] = [
    {
      header: "Rank",
      accessorKey: "market_cap_rank",
      enableGlobalFilter: false,
      enableResizing: true,
      size: 80,
      minSize: 60,
      maxSize: 120,
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
      size: 400,
      minSize: 150,
      maxSize: 700,
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.image || "/placeholder.svg?height=32&width=32"}
              alt={row.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-semibold">{row.name}</div>
              <div className="text-sm text-muted-foreground uppercase">
                {row.symbol}
              </div>
            </div>
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
            {formatMarketCap(value)}
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
            {formatMarketCap(value)}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: query.data ?? [],
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      globalFilter: debouncedValue,
    },
    enableColumnResizing: true,
    columnResizeMode,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
  });

  const marketStats = query.data
    ? {
        totalMarketCap: query.data.reduce(
          (sum, coin) => sum + coin.market_cap,
          0
        ),
        totalVolume: query.data.reduce(
          (sum, coin) => sum + coin.total_volume,
          0
        ),
        gainers: query.data.filter(
          (coin) => coin.price_change_percentage_24h > 0
        ).length,
        losers: query.data.filter(
          (coin) => coin.price_change_percentage_24h < 0
        ).length,
      }
    : null;

  if (query.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-lg font-medium">
                Loading market data...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto mt-20">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load data
              </h3>
              <p className="text-muted-foreground mb-4">
                {(query.error as Error).message}
              </p>
              <Button onClick={() => query.refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header with User Dropdown */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Crypto Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Track the latest cryptocurrency prices and market data
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ModeToggle />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={mockUser.avatar || "/placeholder.svg"}
                      alt={mockUser.name}
                    />
                    <AvatarFallback>{mockUser.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {mockUser.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {mockUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Column Visibility Settings */}
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Column Visibility
                </DropdownMenuLabel>
                {table.getAllLeafColumns().map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    <div className="flex items-center gap-2">
                      {column.getIsVisible() ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      {column.columnDef.header as string}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Market Stats */}
        {marketStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Market Cap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatMarketCap(marketStats.totalMarketCap)}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  24h Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatMarketCap(marketStats.totalVolume)}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Gainers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {marketStats.gainers}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Losers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {marketStats.losers}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Table */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Market Overview
              </CardTitle>
              <div className="flex flex-wrap gap-4 items-center">
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
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table
                className="w-full"
                style={{ width: table.getCenterTotalSize() }}
              >
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
                          {/* Column Resizer */}
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

            {/* Pagination */}
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
        </Card>

        {/* No Results */}
        {query.data && table.getRowModel().rows.length === 0 && (
          <Card>
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
          </Card>
        )}
      </div>
    </div>
  );
}
