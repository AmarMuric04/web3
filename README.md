# 🚀 Crypto Dashboard

A modern, responsive cryptocurrency dashboard built with React and TypeScript. Track real-time cryptocurrency prices, market data, and trends with an intuitive and feature-rich interface.

![Crypto Dashboard](https://img.shields.io/badge/React-18+-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg) ![TanStack](https://img.shields.io/badge/TanStack-Query%20%7C%20Table%20%7C%20Router-orange.svg)

## ✨ Features

### 📊 Real-Time Market Data

- **Live cryptocurrency prices** from CoinGecko API
- **Market cap and volume tracking**
- **24-hour price change indicators** with trend visualization
- **Market statistics overview** with gainers/losers count

### 🔍 Advanced Data Management

- **Fuzzy search** with typo tolerance across coin names, symbols, and IDs
- **Column sorting** for all data fields
- **Advanced filtering** with debounced input
- **Pagination** with customizable page sizes (10, 20, 50 entries)

### 🎨 User Interface

- **Responsive design** that works on all devices
- **Dark/Light theme toggle** with system preference detection
- **Interactive data table** with hover effects and smooth transitions
- **Column resizing** with visual feedback
- **Column visibility controls** for personalized views

### 📈 Data Visualization

- **Color-coded price changes** (green for gains, red for losses)
- **Trend indicators** with directional arrows
- **Market cap formatting** (T/B/M notation)
- **Professional badges** for percentage changes

### 🛠️ Utility Features

- **CSV export functionality** for data analysis
- **User profile dropdown** with settings
- **Loading states** with smooth animations
- **Error handling** with retry mechanisms
- **Optimistic updates** and caching

## 🏗️ Tech Stack

### Frontend Framework

- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server

### Data Management

- **TanStack Query (React Query)** - Powerful data fetching and caching
- **TanStack Table** - Headless table library with advanced features
- **TanStack Router** - Type-safe routing solution

### UI Components & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful, customizable icons
- **Radix UI** - Unstyled, accessible UI primitives

### Data Processing

- **@tanstack/match-sorter-utils** - Fuzzy search and filtering
- **Native Intl API** - Internationalization for currency formatting

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 8.0.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/crypto-dashboard.git
cd crypto-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 📱 Features Breakdown

### Market Overview Cards

- **Total Market Cap** - Aggregated market capitalization
- **24h Volume** - Total trading volume
- **Gainers** - Count of cryptocurrencies with positive price changes
- **Losers** - Count of cryptocurrencies with negative price changes

### Data Table Features

- **Rank Column** - Market cap ranking with styled badges
- **Coin Column** - Logo, name, and symbol display
- **Price Column** - Current price with proper decimal formatting
- **24h Change Column** - Percentage change with trend indicators
- **Market Cap Column** - Formatted market capitalization
- **Volume Column** - 24-hour trading volume

### Search & Filter

- **Global Search** - Search across multiple fields simultaneously
- **Debounced Input** - Optimized search with 300ms delay
- **Fuzzy Matching** - Typo-tolerant search using match-sorter
- **Real-time Results** - Instant filtering as you type

### Table Interactions

- **Column Sorting** - Click headers to sort ascending/descending
- **Column Resizing** - Drag column borders to resize
- **Column Visibility** - Toggle columns on/off via user menu
- **Pagination** - Navigate through large datasets efficiently

## 🎨 Design System

### Color Scheme

- **Primary Colors** - Blue gradient for branding
- **Semantic Colors** - Green for gains, red for losses
- **Neutral Colors** - Tailwind's gray palette for backgrounds
- **Theme Support** - Automatic dark/light mode switching

### Typography

- **Font Stack** - System fonts for optimal performance
- **Size Scale** - Consistent sizing using Tailwind's scale
- **Weight Hierarchy** - Proper font weights for information hierarchy

### Spacing & Layout

- **Grid System** - Responsive grid layouts
- **Consistent Spacing** - Tailwind's spacing scale
- **Card Components** - Consistent card design pattern

## 🔧 Configuration

### API Configuration

The dashboard uses the CoinGecko API for cryptocurrency data:

```typescript
const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const PARAMS = "?vs_currency=usd&order=market_cap_desc&per_page=50&page=1";
```

### Table Configuration

```typescript
const table = useReactTable({
  enableColumnResizing: true,
  columnResizeMode: "onChange",
  globalFilterFn: fuzzyFilter,
  // ... other configurations
});
```

## 📊 Data Flow

1. **API Fetching** - TanStack Query fetches data from CoinGecko
2. **Caching** - Automatic caching and background updates
3. **Processing** - Data transformation and formatting
4. **Filtering** - Real-time search and filter application
5. **Rendering** - Optimized table rendering with virtual scrolling

## 🎯 Performance Optimizations

- **React Query Caching** - Intelligent data caching and invalidation
- **Debounced Search** - Reduced API calls and improved UX
- **Memoized Components** - Optimized re-renders
- **Lazy Loading** - On-demand component loading

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Vercel** - Recommended for optimal performance
- **Netlify** - Easy deployment with form handling
- **GitHub Pages** - Free hosting for static sites
- **Docker** - Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CoinGecko** - For providing the cryptocurrency API
- **TanStack Team** - For excellent React libraries
- **shadcn** - For beautiful UI components
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

If you have any questions or need help with setup, please:

- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

**Built with ❤️ by [Your Name]**

_Last updated: [Current Date]_
