import type { CoinDetail } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Star,
  Share2,
  Bell,
  Shield,
  Eye,
  ThumbsUp,
  Activity,
  ThumbsDown,
  Globe,
  ExternalLink,
  Github,
  Twitter,
  MessageCircle,
  Users,
  Code,
  Zap,
  TrendingUpIcon,
  LineChart,
  ArrowLeft,
} from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ErrorStatus, LoadingStatus } from "@/components/async-statuses";
import { formatCurrency, formatDate } from "@/utility/formaters";

export const Route = createFileRoute("/$coinId/details")({
  component: Details,
  loader: async ({ params }) => {
    const { coinId } = params;
    return { coinId };
  },
});

function Details() {
  const { coinId } = Route.useParams();

  const {
    data: coin,
    isLoading,
    isError,
  } = useQuery<CoinDetail>({
    queryKey: ["coinDetail"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?vs_currency=usd`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading) return <LoadingStatus />;

  if (isError) return <ErrorStatus />;

  if (!coin) return <LoadingStatus />;

  const currentPrice = coin.market_data.current_price["usd"] || 0;
  const marketCap = coin.market_data.market_cap["usd"] || 0;
  const volume24h = coin.market_data.total_volume["usd"] || 0;
  const high24h = coin.market_data.high_24h["usd"] || 0;
  const low24h = coin.market_data.low_24h["usd"] || 0;

  const isPositiveChange = coin.market_data.price_change_percentage_24h > 0;
  const isPositiveMarketCapChange =
    coin.market_data.market_cap_change_percentage_24h > 0;

  const getTrustScoreColor = (score: string) => {
    switch (score.toLowerCase()) {
      case "green":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "red":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/favorites">
                <Star className="w-4 h-4" />
                Favorites
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-1">
                    <img
                      src={
                        coin.image.large ||
                        "/placeholder.svg?height=128&width=128" ||
                        "/placeholder.svg"
                      }
                      alt={coin.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    #{coin.market_cap_rank}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {coin.name}
                    </h1>
                    <p className="text-xl lg:text-2xl text-muted-foreground uppercase font-semibold tracking-wider">
                      {coin.symbol}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {coin.categories.slice(0, 4).map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {formatDate(coin.last_updated)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-6">
                <div className="text-right space-y-3">
                  <div className="text-5xl lg:text-6xl font-bold">
                    {formatCurrency(currentPrice)}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={isPositiveChange ? "default" : "destructive"}
                      className={`text-base px-4 py-2 ${
                        isPositiveChange
                          ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                          : "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20"
                      }`}
                    >
                      {isPositiveChange ? (
                        <TrendingUp className="w-5 h-5 mr-2" />
                      ) : (
                        <TrendingDown className="w-5 h-5 mr-2" />
                      )}
                      {Math.abs(
                        coin.market_data.price_change_percentage_24h
                      ).toFixed(2)}
                      %
                    </Badge>
                    <span
                      className={`text-lg font-semibold ${
                        isPositiveChange
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {isPositiveChange ? "+" : ""}
                      {formatCurrency(coin.market_data.price_change_24h)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link to="/$coinId/chart" params={{ coinId }}>
                      <LineChart className="w-4 h-4" />
                      View Chart
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-background/50 backdrop-blur-sm"
                  >
                    <Star className="w-4 h-4" />
                    Favorite
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-background/50 backdrop-blur-sm"
                  >
                    <Bell className="w-4 h-4" />
                    Alert
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-background/50 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/$coinId/chart" params={{ coinId }}>
              <BarChart3 className="w-4 h-4" />
              Price Chart
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/dashboard">
              <Eye className="w-4 h-4" />
              Market Overview
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/favorites">
              <Star className="w-4 h-4" />
              My Favorites
            </Link>
          </Button>
        </div>

        {(coin.public_notice || coin.additional_notices.length > 0) && (
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 dark:border-amber-800 dark:from-amber-950 dark:to-yellow-950">
            <CardContent className="p-6">
              {coin.public_notice && (
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    {coin.public_notice}
                  </p>
                </div>
              )}
              {coin.additional_notices.map((notice, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 mb-2 last:mb-0"
                >
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-800 dark:text-amber-200">{notice}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Market Cap
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(marketCap)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {isPositiveMarketCapChange ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositiveMarketCapChange
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {Math.abs(
                    coin.market_data.market_cap_change_percentage_24h
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950 dark:to-emerald-900/50 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                24h Volume
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {formatCurrency(volume24h)}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Trading volume
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100/50 dark:from-purple-950 dark:to-violet-900/50 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Watchlist Users
              </CardTitle>
              <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(coin.watchlist_portfolio_users)}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                Portfolio users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-100/50 dark:from-orange-950 dark:to-amber-900/50 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Sentiment
              </CardTitle>
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-600">
                    {coin.sentiment_votes_up_percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-600">
                    {coin.sentiment_votes_down_percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <Progress
                value={coin.sentiment_votes_up_percentage}
                className="h-2"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <TrendingUpIcon className="w-6 h-6 text-primary" />
                24h Price Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Low</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(low24h)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Current</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(currentPrice)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">High</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(high24h)}
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 dark:from-red-900 dark:via-yellow-900 dark:to-green-900 rounded-full h-3" />
                <div
                  className="absolute top-0 w-4 h-4 bg-primary rounded-full border-3 border-background shadow-lg transform -translate-y-0.5"
                  style={{
                    left: `${
                      ((currentPrice - low24h) / (high24h - low24h)) * 100
                    }%`,
                    transform: "translateX(-50%) translateY(-12.5%)",
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Calendar className="w-6 h-6 text-primary" />
                Price Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "1 Hour",
                  value:
                    coin.market_data.price_change_percentage_1h_in_currency[
                      "usd"
                    ],
                },
                {
                  label: "7 Days",
                  value: coin.market_data.price_change_percentage_7d,
                },
                {
                  label: "30 Days",
                  value: coin.market_data.price_change_percentage_30d,
                },
                {
                  label: "1 Year",
                  value: coin.market_data.price_change_percentage_1y,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/30"
                >
                  <span className="font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.value > 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`font-bold ${
                        item.value > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {Math.abs(item.value || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="text-2xl">About {coin.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: coin.description.en || "No description available.",
              }}
            />

            {coin.genesis_date && (
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  Genesis Date: {formatDate(coin.genesis_date)}
                </span>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {coin.categories.map((category) => (
                  <Badge key={category} variant="outline" className="px-3 py-1">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Globe className="w-6 h-6" />
              Links & Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-primary">
                  Official Links
                </h4>
                <div className="space-y-3">
                  {coin.links.homepage[0] && (
                    <a
                      href={coin.links.homepage[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span className="font-medium group-hover:text-primary">
                        Website
                      </span>
                      <ExternalLink className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100" />
                    </a>
                  )}
                  {coin.links.repos_url.github[0] && (
                    <a
                      href={coin.links.repos_url.github[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                      <span className="font-medium group-hover:text-primary">
                        GitHub
                      </span>
                      <ExternalLink className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100" />
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-primary">
                  Social Media
                </h4>
                <div className="space-y-3">
                  {coin.links.twitter_screen_name && (
                    <a
                      href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <Twitter className="w-5 h-5 text-blue-500" />
                      <span className="font-medium group-hover:text-primary">
                        Twitter
                      </span>
                      <ExternalLink className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100" />
                    </a>
                  )}
                  {coin.links.subreddit_url && (
                    <a
                      href={coin.links.subreddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <MessageCircle className="w-5 h-5 text-orange-600" />
                      <span className="font-medium group-hover:text-primary">
                        Reddit
                      </span>
                      <ExternalLink className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Users className="w-6 h-6" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 rounded-xl">
                <Twitter className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(coin.community_data.twitter_followers) ===
                    "NaN" && 0}
                </div>
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  Twitter Followers
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950 dark:to-orange-900/50 rounded-xl">
                <MessageCircle className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(coin.community_data.reddit_subscribers)}
                </div>
                <p className="text-orange-700 dark:text-orange-300 font-medium">
                  Reddit Subscribers
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  {coin.community_data.reddit_accounts_active_48h} active (48h)
                </p>
              </div>

              {coin.community_data.telegram_channel_user_count && (
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/50 rounded-xl">
                  <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(
                      coin.community_data.telegram_channel_user_count
                    )}
                  </div>
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    Telegram Members
                  </p>
                </div>
              )}
            </div>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Reddit Activity (48h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {coin.community_data.reddit_average_posts_48h}
                    </div>
                    <p className="text-muted-foreground">Average Posts</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {coin.community_data.reddit_average_comments_48h}
                    </div>
                    <p className="text-muted-foreground">Average Comments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Code className="w-6 h-6" />
              Development Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-100/50 dark:from-yellow-950 dark:to-amber-900/50 rounded-xl">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                  {formatCurrency(coin.developer_data.stars)}
                </div>
                <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                  GitHub Stars
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100/50 dark:from-purple-950 dark:to-violet-900/50 rounded-xl">
                <Code className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(coin.developer_data.forks)}
                </div>
                <p className="text-purple-700 dark:text-purple-300 font-medium">
                  Forks
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950 dark:to-emerald-900/50 rounded-xl">
                <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {coin.developer_data.pull_request_contributors}
                </div>
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Contributors
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-100/50 dark:from-blue-950 dark:to-cyan-900/50 rounded-xl">
                <Activity className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {coin.developer_data.commit_count_4_weeks}
                </div>
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  Commits (4w)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Issues</span>
                    <span className="font-bold text-lg">
                      {coin.developer_data.total_issues}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Closed Issues</span>
                    <span className="font-bold text-lg text-green-600">
                      {coin.developer_data.closed_issues}
                    </span>
                  </div>
                  <Progress
                    value={
                      (coin.developer_data.closed_issues /
                        coin.developer_data.total_issues) *
                      100
                    }
                    className="h-3"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    {(
                      (coin.developer_data.closed_issues /
                        coin.developer_data.total_issues) *
                      100
                    ).toFixed(1)}
                    % resolved
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Code Changes (4 weeks)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-600">Additions</span>
                    <span className="font-bold text-lg text-green-600">
                      +
                      {formatCurrency(
                        coin.developer_data.code_additions_deletions_4_weeks
                          .additions
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">Deletions</span>
                    <span className="font-bold text-lg text-red-600">
                      -
                      {formatCurrency(
                        coin.developer_data.code_additions_deletions_4_weeks
                          .deletions
                      )}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500"
                        style={{
                          width: `${
                            (coin.developer_data
                              .code_additions_deletions_4_weeks.additions /
                              (coin.developer_data
                                .code_additions_deletions_4_weeks.additions +
                                coin.developer_data
                                  .code_additions_deletions_4_weeks
                                  .deletions)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="bg-red-500"
                        style={{
                          width: `${
                            (coin.developer_data
                              .code_additions_deletions_4_weeks.deletions /
                              (coin.developer_data
                                .code_additions_deletions_4_weeks.additions +
                                coin.developer_data
                                  .code_additions_deletions_4_weeks
                                  .deletions)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BarChart3 className="w-6 h-6" />
              Trading Markets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-muted">
                    <th className="text-left py-4 px-2 font-semibold">
                      Exchange
                    </th>
                    <th className="text-left py-4 px-2 font-semibold">Pair</th>
                    <th className="text-right py-4 px-2 font-semibold">
                      Price
                    </th>
                    <th className="text-right py-4 px-2 font-semibold">
                      Volume
                    </th>
                    <th className="text-center py-4 px-2 font-semibold">
                      Trust Score
                    </th>
                    <th className="text-right py-4 px-2 font-semibold">
                      Spread
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coin.tickers.slice(0, 10).map((ticker, index) => (
                    <tr
                      key={index}
                      className="border-b border-muted/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-2">
                        <div className="font-semibold text-primary">
                          {ticker.market.name}
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                          {ticker.base}/{ticker.target}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="font-bold">
                          {formatCurrency(ticker.converted_last.usd || 0)}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(ticker.converted_volume.usd || 0)}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <Badge
                          className={getTrustScoreColor(ticker.trust_score)}
                          variant="secondary"
                        >
                          {ticker.trust_score}
                        </Badge>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="text-sm font-medium">
                          {ticker.bid_ask_spread_percentage.toFixed(2)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-background to-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Zap className="w-6 h-6" />
                Blockchain Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">Block Time</span>
                <span className="font-bold text-primary">
                  {coin.block_time_in_minutes} min
                </span>
              </div>
              {coin.hashing_algorithm && (
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Hashing Algorithm</span>
                  <span className="font-bold text-primary">
                    {coin.hashing_algorithm}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">Country Origin</span>
                <span className="font-bold text-primary">
                  {coin.country_origin}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
