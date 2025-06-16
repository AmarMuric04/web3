import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Eye,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { CoinMarketData } from "../types";
import { CryptoTable } from "../components/crypto-table";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toggleFavoriteCoin } from "../store/slices/coins-slice";
import { ErrorStatus, LoadingStatus } from "../components/async-statuses";
import { formatLargeNumber } from "../utility/formaters";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const dispatch = useAppDispatch();
  const { favorited } = useAppSelector((state) => state.coins);

  const query = useQuery<CoinMarketData[]>({
    queryKey: ["coinsMarketData"],
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

  if (query.isLoading) return <LoadingStatus />;

  if (query.isError) return <ErrorStatus />;

  if (!query.data) return <LoadingStatus />;

  console.log(query.data);

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
        topGainer: query.data.reduce((max, coin) =>
          coin.price_change_percentage_24h > max.price_change_percentage_24h
            ? coin
            : max
        ),
        topLoser: query.data.reduce((min, coin) =>
          coin.price_change_percentage_24h < min.price_change_percentage_24h
            ? coin
            : min
        ),
      }
    : null;

  const handleToggleFavorite = (coinId: string) => {
    dispatch(toggleFavoriteCoin(coinId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Crypto Dashboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track the latest cryptocurrency prices and market data with
            real-time updates
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/favorites">
                <Star className="w-4 h-4" />
                View Favorites ({favorited.length})
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/">
                <Eye className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {marketStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-orange-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  Total Market Cap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatLargeNumber(marketStats.totalMarketCap)}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-blue-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  24h Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatLargeNumber(marketStats.totalVolume)}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-green-200/50 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Top Gainer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {marketStats.topGainer.symbol.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  +
                  {marketStats.topGainer.price_change_percentage_24h.toFixed(2)}
                  %
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  <Link
                    to="/$coinId/details"
                    params={{ coinId: marketStats.topGainer.id }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-red-200/50 group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  Top Loser
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {marketStats.topLoser.symbol.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {marketStats.topLoser.price_change_percentage_24h.toFixed(2)}%
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  <Link
                    to="/$coinId/details"
                    params={{ coinId: marketStats.topLoser.id }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <CryptoTable
          data={query.data || []}
          title="Market Overview"
          showSearch={true}
          showExport={true}
          showFavorites={true}
          favorites={favorited}
          onToggleFavorite={handleToggleFavorite}
          initialPageSize={10}
        />

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Data updates automatically • Last updated:{" "}
                {new Date().toLocaleTimeString()}
              </div>
              <div className="flex gap-4">
                <Button asChild size="sm" variant="ghost">
                  <Link to="/favorites">Manage Favorites</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/$coinId/chart" params={{ coinId: "bitcoin" }}>
                    View Charts
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
