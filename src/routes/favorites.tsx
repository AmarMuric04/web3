import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Heart,
  Star,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { CoinMarketData } from "@/types";
import { CryptoTable } from "@/components/crypto-table";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  clearFavoriteCoins,
  toggleFavoriteCoin,
} from "@/store/slices/coins-slice";
import { formatLargeNumber } from "@/utility/formaters";
import { ErrorStatus, LoadingStatus } from "@/components/async-statuses";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
});

function Favorites() {
  const [showAllCoins, setShowAllCoins] = useState(false);
  const { favorited } = useAppSelector((state) => state.coins);
  const dispatch = useAppDispatch();

  const query = useQuery<CoinMarketData[]>({
    queryKey: ["coinsMarketData"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    refetchInterval: 60000,
  });

  const favoriteCoins =
    query.data?.filter((coin) => favorited.includes(coin.id)) || [];

  const favoriteStats =
    favoriteCoins.length > 0
      ? {
          totalFavorites: favoriteCoins.length,
          topPerformer: favoriteCoins.reduce((max, coin) =>
            coin.price_change_percentage_24h > max.price_change_percentage_24h
              ? coin
              : max
          ),
          worstPerformer: favoriteCoins.reduce((min, coin) =>
            coin.price_change_percentage_24h < min.price_change_percentage_24h
              ? coin
              : min
          ),
          averageChange:
            favoriteCoins.reduce(
              (sum, coin) => sum + coin.price_change_percentage_24h,
              0
            ) / favoriteCoins.length,
          totalMarketCap: favoriteCoins.reduce(
            (sum, coin) => sum + coin.market_cap,
            0
          ),
          gainersCount: favoriteCoins.filter(
            (coin) => coin.price_change_percentage_24h > 0
          ).length,
          losersCount: favoriteCoins.filter(
            (coin) => coin.price_change_percentage_24h < 0
          ).length,
        }
      : null;

  const handleToggleFavorite = (coinId: string) => {
    dispatch(toggleFavoriteCoin(coinId));
  };

  const handleClearAllFavorites = () => {
    if (window.confirm("Are you sure you want to remove all favorites?")) {
      dispatch(clearFavoriteCoins());
    }
  };

  if (query.isLoading) return <LoadingStatus />;

  if (query.isError) return <ErrorStatus />;

  if (!query.data) return <LoadingStatus />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-orange-600" />
            Favorite Coins
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track your favorite cryptocurrencies in one place with personalized
            insights
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            asChild
            className="gap-2 bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            <Link to="/dashboard">
              <Plus className="w-4 h-4" />
              Add More Coins
            </Link>
          </Button>
          {favoriteCoins.length > 0 && (
            <Button
              onClick={handleClearAllFavorites}
              variant="outline"
              size="lg"
              className="gap-2 text-destructive hover:text-destructive border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Favorites
            </Button>
          )}
          <Button
            onClick={() => setShowAllCoins(!showAllCoins)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            {showAllCoins ? "Show Favorites Only" : "Browse All Coins"}
          </Button>
        </div>

        {favoriteStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-orange-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-600" />
                  Total Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {favoriteStats.totalFavorites}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {favoriteStats.gainersCount} gainers,{" "}
                  {favoriteStats.losersCount} losers
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-green-200/50">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Top Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">
                  {favoriteStats.topPerformer.symbol.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  +
                  {favoriteStats.topPerformer.price_change_percentage_24h.toFixed(
                    2
                  )}
                  %
                </div>
                <div className="mt-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1"
                  >
                    <Link
                      to="/$coinId/details"
                      params={{ coinId: favoriteStats.topPerformer.id }}
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-red-200/50">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  Worst Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-red-600">
                  {favoriteStats.worstPerformer.symbol.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {favoriteStats.worstPerformer.price_change_percentage_24h.toFixed(
                    2
                  )}
                  %
                </div>
                <div className="mt-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1"
                  >
                    <Link
                      to="/$coinId/details"
                      params={{ coinId: favoriteStats.worstPerformer.id }}
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-blue-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Heart className="w-4 h-4 text-blue-600" />
                  Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">
                  {formatLargeNumber(favoriteStats.totalMarketCap)}
                </div>
                <Badge
                  variant={
                    favoriteStats.averageChange >= 0 ? "default" : "destructive"
                  }
                  className={`text-xs mt-1 ${
                    favoriteStats.averageChange >= 0
                      ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {favoriteStats.averageChange >= 0 ? "+" : ""}
                  {favoriteStats.averageChange.toFixed(2)}% avg
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {showAllCoins ? (
          <CryptoTable
            data={query.data || []}
            title="All Cryptocurrencies"
            showSearch={true}
            showExport={true}
            showFavorites={true}
            favorites={favorited}
            onToggleFavorite={handleToggleFavorite}
            initialPageSize={20}
          />
        ) : favoriteCoins.length > 0 ? (
          <CryptoTable
            data={favoriteCoins}
            title={`Your Favorite Cryptocurrencies (${favoriteCoins.length})`}
            showSearch={true}
            showExport={true}
            showFavorites={true}
            favorites={favorited}
            onToggleFavorite={handleToggleFavorite}
            initialPageSize={20}
          />
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground mb-4">
                <Heart className="w-16 h-16 mx-auto text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No favorite coins yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start adding coins to your favorites from the dashboard to see
                them here. You can also browse all available cryptocurrencies
                below.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="gap-2">
                  <Link to="/dashboard">
                    <Star className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={() => setShowAllCoins(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Browse All Coins
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {favoriteCoins.length > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Data updates every minute • Last updated:{" "}
                  {new Date().toLocaleTimeString()}
                </div>
                <div>
                  Tracking {favoriteCoins.length} favorite coin
                  {favoriteCoins.length !== 1 ? "s" : ""}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
