"use client";

import { createFileRoute, Link } from "@tanstack/react-router";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Volume2,
  ArrowLeft,
  Eye,
  Star,
  Info,
} from "lucide-react";
import type { CoinDetail, CoinMarketChart } from "@/types";
import { formatCurrency, formatLargeNumber } from "@/utility/formaters";

const TIME_PERIODS = [
  { label: "1D", value: "1", days: 1 },
  { label: "7D", value: "7", days: 7 },
  { label: "30D", value: "30", days: 30 },
  { label: "90D", value: "90", days: 90 },
  { label: "180D", value: "180", days: 180 },
];

export const Route = createFileRoute("/$coinId/chart")({
  component: CoinChart,
  loader: async ({ params }) => {
    const { coinId } = params;
    return { coinId };
  },
});

function CoinChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const { coinId } = Route.useParams();

  const { data: chartData, isLoading: chartLoading } =
    useQuery<CoinMarketChart>({
      queryKey: ["coinChart", coinId, selectedPeriod],
      queryFn: async () => {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${selectedPeriod}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        return response.json();
      },
      refetchInterval: 60000,
    });

  const { data: coinDetail, isLoading: detailLoading } = useQuery<CoinDetail>({
    queryKey: ["coinDetail", coinId],
    queryFn: async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch coin details");
      }
      return response.json();
    },
    refetchInterval: 60000,
  });

  const formatChartData = (prices: [number, number][]) => {
    return prices.map(([timestamp, price]) => ({
      timestamp,
      price,
      date: new Date(timestamp).toLocaleDateString(),
      time: new Date(timestamp).toLocaleTimeString(),
    }));
  };

  const getPercentageColor = (percentage: number) => {
    return percentage >= 0 ? "text-green-600" : "text-red-600";
  };

  const getPercentageIcon = (percentage: number) => {
    return percentage >= 0 ? TrendingUp : TrendingDown;
  };

  if (detailLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!coinDetail) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Failed to load coin data
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartDataFormatted = chartData ? formatChartData(chartData.prices) : [];
  const currentPrice = coinDetail.market_data.current_price.usd;
  const priceChange24h = coinDetail.market_data.price_change_percentage_24h;
  const marketCap = coinDetail.market_data.market_cap.usd;
  const volume24h = coinDetail.market_data.total_volume.usd;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/$coinId/details" params={{ coinId }}>
              <Info className="w-4 h-4" />
              View Details
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/favorites">
              <Star className="w-4 h-4" />
              Favorites
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={coinDetail.image.large || "/placeholder.svg"}
            alt={coinDetail.name}
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold">{coinDetail.name}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground uppercase">
                {coinDetail.symbol}
              </span>
              <Badge variant="secondary">
                Rank #{coinDetail.market_cap_rank}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="gap-2">
            <Link to="/$coinId/details" params={{ coinId }}>
              <Eye className="w-4 h-4" />
              Full Details
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(currentPrice)}
            </div>
            <div
              className={`flex items-center text-xs ${getPercentageColor(
                priceChange24h
              )}`}
            >
              {(() => {
                const Icon = getPercentageIcon(priceChange24h);
                return <Icon className="h-3 w-3 mr-1" />;
              })()}
              {Math.abs(priceChange24h).toFixed(2)}% (24h)
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatLargeNumber(marketCap)}
            </div>
            <div
              className={`flex items-center text-xs ${getPercentageColor(
                coinDetail.market_data.market_cap_change_percentage_24h
              )}`}
            >
              {(() => {
                const Icon = getPercentageIcon(
                  coinDetail.market_data.market_cap_change_percentage_24h
                );
                return <Icon className="h-3 w-3 mr-1" />;
              })()}
              {Math.abs(
                coinDetail.market_data.market_cap_change_percentage_24h
              ).toFixed(2)}
              % (24h)
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatLargeNumber(volume24h)}
            </div>
            <p className="text-xs text-muted-foreground">Trading volume</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="text-red-600">
                L: {formatCurrency(coinDetail.market_data.low_24h.usd)}
              </div>
              <div className="text-green-600">
                H: {formatCurrency(coinDetail.market_data.high_24h.usd)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Price Chart</CardTitle>
              <CardDescription>
                {coinDetail.name} price over time
              </CardDescription>
            </div>
            <div className="flex space-x-1">
              {TIME_PERIODS.map((period) => (
                <Button
                  key={period.value}
                  variant={
                    selectedPeriod === period.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                  className="hover:scale-105 transition-transform"
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ChartContainer
              config={{
                price: {
                  label: "Price",
                  color: "#3b82f6",
                },
              }}
              className="h-96 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartDataFormatted}>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      if (selectedPeriod === "1") {
                        return date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      }
                      return date.toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [
                          formatCurrency(value as number),
                          " ",
                          "Price",
                        ]}
                        labelFormatter={(label) => {
                          const date = new Date(label as number);
                          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                        }}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-4">
        <Button
          asChild
          variant="outline"
          className="gap-2 hover:scale-105 transition-transform"
        >
          <Link to="/$coinId/details" params={{ coinId }}>
            <Info className="w-4 h-4" />
            View Full Details
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="gap-2 hover:scale-105 transition-transform"
        >
          <Link to="/dashboard">
            <BarChart3 className="w-4 h-4" />
            Market Dashboard
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="gap-2 hover:scale-105 transition-transform"
        >
          <Link to="/favorites">
            <Star className="w-4 h-4" />
            My Favorites
          </Link>
        </Button>
      </div>

      {coinDetail.description.en && (
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>About {coinDetail.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: coinDetail.description.en.split(".")[0] + ".",
              }}
            />
            <div className="mt-4">
              <Button asChild size="sm" variant="outline">
                <Link to="/$coinId/details" params={{ coinId }}>
                  Read More Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Chart updates every minute • Last updated:{" "}
              {new Date().toLocaleTimeString()}
            </div>
            <div className="flex gap-4">
              <Button asChild size="sm" variant="ghost">
                <Link to="/$coinId/details" params={{ coinId }}>
                  Full Analysis
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link to="/dashboard">Compare Coins</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
