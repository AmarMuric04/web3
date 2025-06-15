import {
  Award,
  BarChart3,
  Building,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Headphones,
  Lock,
  Shield,
  Smartphone,
  TrendingUpIcon,
  Users,
} from "lucide-react";

export const cryptoData = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: 67420.5,
    change: 2.45,
    marketCap: "1.32T",
    volume: "28.5B",
    icon: "₿",
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: 3842.3,
    change: -1.23,
    marketCap: "462.1B",
    volume: "15.2B",
    icon: "Ξ",
  },
  {
    id: 3,
    name: "Solana",
    symbol: "SOL",
    price: 198.75,
    change: 5.67,
    marketCap: "94.2B",
    volume: "3.8B",
    icon: "◎",
  },
  {
    id: 4,
    name: "Cardano",
    symbol: "ADA",
    price: 1.05,
    change: 3.21,
    marketCap: "37.1B",
    volume: "1.2B",
    icon: "₳",
  },
];

export const chartData = [
  { time: "00:00", btc: 65000, eth: 3600, sol: 180 },
  { time: "04:00", btc: 66200, eth: 3720, sol: 185 },
  { time: "08:00", btc: 65800, eth: 3680, sol: 182 },
  { time: "12:00", btc: 67100, eth: 3800, sol: 195 },
  { time: "16:00", btc: 66900, eth: 3780, sol: 192 },
  { time: "20:00", btc: 67420, eth: 3842, sol: 198 },
];

export const features = [
  {
    icon: BarChart3,
    title: "Professional Trading Tools",
    description:
      "Advanced charting, technical indicators, and order types for institutional-grade trading.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Multi-signature wallets, cold storage, and SOC 2 Type II compliance for maximum protection.",
  },
  {
    icon: Clock,
    title: "24/7 Market Access",
    description:
      "Trade cryptocurrencies around the clock with our always-available trading infrastructure.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Professional customer support team available 24/7 for all your trading needs.",
  },
];

export const stats = [
  { label: "Active Traders", value: "2.5M+", icon: Users },
  { label: "Daily Volume", value: "$45B+", icon: DollarSign },
  { label: "Global Presence", value: "180+", icon: Globe },
  { label: "System Uptime", value: "99.99%", icon: CheckCircle },
];

export const securityFeatures = [
  {
    icon: Lock,
    title: "Cold Storage",
    description: "95% of digital assets stored offline in bank-grade vaults",
  },
  {
    icon: Shield,
    title: "Insurance Coverage",
    description: "Full insurance coverage for digital assets held in custody",
  },
  {
    icon: Award,
    title: "Regulatory Compliance",
    description: "Licensed and regulated in multiple jurisdictions worldwide",
  },
  {
    icon: FileText,
    title: "Audit Reports",
    description: "Regular third-party security audits and transparency reports",
  },
];

export const tradingTools = [
  {
    icon: BarChart3,
    title: "Advanced Charting",
    description: "TradingView integration with 100+ technical indicators",
  },
  {
    icon: TrendingUpIcon,
    title: "Algorithmic Trading",
    description: "API access for automated trading strategies and bots",
  },
  {
    icon: Smartphone,
    title: "Mobile Trading",
    description: "Full-featured mobile apps for iOS and Android",
  },
  {
    icon: Building,
    title: "Institutional Services",
    description: "Prime brokerage and custody solutions for institutions",
  },
];

export const faqData = [
  {
    question: "How do I get started with cryptocurrency trading?",
    answer:
      "Getting started is simple. Create an account, complete our verification process, deposit funds via bank transfer or credit card, and you can begin trading immediately. Our platform offers educational resources to help new traders understand the market.",
  },
  {
    question: "What security measures do you have in place?",
    answer:
      "We employ bank-level security including cold storage for 95% of funds, multi-signature wallets, two-factor authentication, and regular security audits. Our platform is also fully insured and compliant with regulatory standards.",
  },
  {
    question: "What are your trading fees?",
    answer:
      "Our fee structure is transparent and competitive. Maker fees start at 0.1% and taker fees at 0.2%, with discounts available for high-volume traders. There are no hidden fees, and we provide detailed fee schedules on our website.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes, we provide 24/7 customer support through multiple channels including live chat, email, and phone. Our support team consists of experienced professionals who can assist with technical issues, account questions, and trading guidance.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use industry-standard encryption and follow strict data protection protocols. We are compliant with GDPR and other privacy regulations, and we never share your personal information with third parties without your consent.",
  },
  {
    question: "Can I trade on mobile devices?",
    answer:
      "Yes, we offer full-featured mobile applications for both iOS and Android devices. Our mobile apps provide the same functionality as our web platform, allowing you to trade, monitor markets, and manage your account on the go.",
  },
];
