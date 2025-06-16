import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TrendingUp,
  TrendingDown,
  Bitcoin,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Eye,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import Footer from "@/components/footer";
import {
  chartData,
  cryptoData,
  faqData,
  features,
  securityFeatures,
  stats,
  tradingTools,
} from "@/utility/mock-data";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { CoinMarketData } from "@/types";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Landing,
});

export default function Landing() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(
    stats.map((stat) => ({ ...stat, displayValue: "0" }))
  );

  // Fetch real market data for dynamic content
  const { data: marketData } = useQuery<CoinMarketData[]>({
    queryKey: ["landingMarketData"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Animate stats on load
  useEffect(() => {
    const animateStats = () => {
      stats.forEach((stat, index) => {
        setTimeout(() => {
          const targetValue = stat.value;
          const numericValue = Number.parseInt(
            targetValue.replace(/[^0-9]/g, "")
          );
          let currentValue = 0;
          const increment = numericValue / 50;

          const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
              currentValue = numericValue;
              clearInterval(timer);
            }

            setAnimatedStats((prev) =>
              prev.map((s, i) =>
                i === index
                  ? {
                      ...s,
                      displayValue: targetValue.includes("$")
                        ? `$${Math.floor(currentValue).toLocaleString()}${
                            targetValue.includes("B")
                              ? "B"
                              : targetValue.includes("M")
                                ? "M"
                                : ""
                          }`
                        : `${Math.floor(currentValue).toLocaleString()}${
                            targetValue.includes("+") ? "+" : ""
                          }`,
                    }
                  : s
              )
            );
          }, 50);
        }, index * 200);
      });
    };

    animateStats();
  }, []);

  // Cycle through featured stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const realCryptoData =
    marketData?.slice(0, 4).map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      icon: coin.symbol.charAt(0).toUpperCase(),
      price: coin.current_price,
      change: coin.price_change_percentage_24h,
      marketCap: `$${(coin.market_cap / 1e9).toFixed(1)}B`,
      volume: `$${(coin.total_volume / 1e6).toFixed(0)}M`,
    })) || cryptoData;

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5" />
        <div className="container mx-auto text-center relative">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-orange-100 text-orange-800 border-orange-200 animate-pulse">
              <CheckCircle className="w-4 h-4 mr-2" />
              Trusted by institutional investors worldwide
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Professional Cryptocurrency
              <span className="text-orange-600 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text">
                Trading Platform
              </span>
            </h1>
            <p className="text-xl text-foreground/70 mb-8 max-w-3xl mx-auto">
              Access institutional-grade cryptocurrency trading with advanced
              tools, enterprise security, and regulatory compliance. Built for
              serious traders and financial institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/dashboard">
                  Check out the Market
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-6 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 hover:scale-105"
              >
                <Link to="/$coinId/chart" params={{ coinId: "bitcoin" }}>
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Charts
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Regulated • Insured • SOC 2 Type II Compliant
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {animatedStats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-500 ${
                  index === currentStatIndex
                    ? "scale-110 bg-orange-50 dark:bg-orange-950/20 rounded-xl p-4"
                    : ""
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.displayValue}
                </div>
                <div className="text-foreground/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Live Market Data
            </h2>
            <p className="text-foreground/70 text-lg">
              Real-time cryptocurrency prices and market information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {realCryptoData.map((crypto) => (
              <Card
                key={crypto.id}
                className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-orange-200/30 group hover:scale-105"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/2" />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                        {crypto.icon}
                      </div>
                      <div>
                        <CardTitle className="text-foreground text-lg">
                          {crypto.name}
                        </CardTitle>
                        <CardDescription className="text-foreground/70">
                          {crypto.symbol}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={crypto.change > 0 ? "default" : "destructive"}
                      className={
                        crypto.change > 0
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                          : "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
                      }
                    >
                      {crypto.change > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {crypto.change > 0 ? "+" : ""}
                      {crypto.change.toFixed(2)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-foreground">
                      ${crypto.price.toLocaleString()}
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Cap: {crypto.marketCap}</span>
                      <span>Vol: {crypto.volume}</span>
                    </div>
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Link
                          to="/$coinId/details"
                          params={{ coinId: crypto.id as string }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Link
                          to="/$coinId/chart"
                          params={{ coinId: crypto.id as string }}
                        >
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Chart
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              asChild
              variant="outline"
              className="hover:scale-105 transition-transform"
            >
              <Link to="/dashboard">
                View All Markets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-muted/20 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Professional Trading Charts
            </h2>
            <p className="text-foreground/70 text-lg">
              Advanced charting tools with institutional-grade data feeds
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-orange-200/30 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/2" />
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Bitcoin className="w-5 h-5 mr-2 text-orange-600" />
                  Bitcoin Price Movement
                </CardTitle>
                <CardDescription className="text-foreground/70">
                  24-hour trading data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    btc: {
                      label: "Bitcoin",
                      color: "#ea580c",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="btcGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ea580c"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ea580c"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="btc"
                        stroke="#ea580c"
                        strokeWidth={2}
                        fill="url(#btcGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-orange-200/30 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/2" />
              <CardHeader>
                <CardTitle className="text-foreground">
                  Multi-Asset Performance
                </CardTitle>
                <CardDescription className="text-foreground/70">
                  Comparative analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    eth: {
                      label: "Ethereum",
                      color: "#6b7280",
                    },
                    sol: {
                      label: "Solana",
                      color: "#374151",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="eth"
                        stroke="#6b7280"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="sol"
                        stroke="#374151"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Your assets are protected by the same security standards used by
              major financial institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card
                key={index}
                className="bg-foreground/20 border-foreground/40 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-foreground text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-muted/20 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Professional Trading Tools
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Access the same tools used by professional traders and financial
              institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tradingTools.map((tool, index) => (
              <Card
                key={index}
                className="bg-foreground/20 border-foreground/40 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <tool.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <CardTitle className="text-foreground text-xl">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 text-center">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose CryptoVault
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Built for serious traders who demand institutional-grade features
              and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-foreground/20 border-foreground/40 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-foreground text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-muted/20 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-foreground/70 text-lg">
              Get answers to common questions about our platform and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-gray-200"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-orange-600 font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-foreground">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
              Ready to Start Professional Trading?
            </h2>
            <p className="text-background/70 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professional traders and institutions who trust
              CryptoVault for their cryptocurrency trading needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter your business email"
                  className="w-80 bg-gray-800 border-gray-700 text-white placeholder:text-background"
                />
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Get Started
                </Button>
              </div>
            </div>
            <div className="flex justify-center gap-4 mb-6">
              <Button
                asChild
                variant="secondary"
                className="bg-background/10 hover:bg-background/20 text-background"
              >
                <Link to="/dashboard">
                  <Star className="mr-2 h-4 w-4" />
                  Explore Dashboard
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-background/10 hover:bg-background/20 text-background"
              >
                <Link to="/favorites">
                  <Star className="mr-2 h-4 w-4" />
                  View Favorites
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              Enterprise accounts available • Dedicated support • Institutional
              pricing
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
