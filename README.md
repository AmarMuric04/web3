A modern, responsive cryptocurrency dashboard built with React and TypeScript. Track real-time cryptocurrency prices, market data, and trends with an intuitive and feature-rich interface.

![React](https://img.shields.io/badge/React-18+-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg) ![TanStack](https://img.shields.io/badge/TanStack-Query%20%7C%20Table%20%7C%20Router-orange.svg) ![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-blueviolet.svg)

---

## Features

### Real-Time Market Data

- **Live cryptocurrency prices** from CoinGecko API
- **Market cap and volume tracking**
- **24-hour price change indicators** with trend visualization
- **Market statistics overview** with gainers/losers count

### Advanced Data Management

- **Fuzzy search** with typo tolerance across coin names, symbols, and IDs
- **Column sorting** for all data fields
- **Advanced filtering** with debounced input
- **Pagination** with customizable page sizes (10, 20, 50 entries)

### User Interface

- **Responsive design** that works on all devices
- **Dark/Light theme toggle** with system preference detection
- **Interactive data table** with hover effects and smooth transitions
- **Column resizing** with visual feedback
- **Column visibility controls** for personalized views

### Data Visualization

- **Color-coded price changes** (green for gains, red for losses)
- **Trend indicators** with directional arrows
- **Market cap formatting** (T/B/M notation)
- **Professional badges** for percentage changes
- **Interactive charts** on the Coin Details page for historical price data

### Utility Features

- **CSV export functionality** for data analysis
- **User profile dropdown** with settings (displays a random user fetched via RTK Query)
- **Loading states** with smooth animations
- **Error handling** with retry mechanisms
- **Optimistic updates** and caching
- **Favorite cryptocurrencies management** using Redux Toolkit
- **Persistent state** for favorites after refresh using Redux Persist

---

## Tech Stack

### Frontend Framework

- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server

### State Management & Data Fetching

- **Redux Toolkit (RTK)** - Efficient state management for application-wide data
- **RTK Query** - Powerful data fetching and caching, used for CoinGecko API and random user fetching
- **Redux Persist** - Persist Redux state to local storage for data longevity
- **TanStack Table** - Headless table library with advanced features
- **TanStack Router** - Type-safe routing solution

### UI Components & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components (used for theming and general components)
- **Lucide React** - Beautiful, customizable icons
- **Radix UI** - Unstyled, accessible UI primitives

### Data Processing

- **@tanstack/match-sorter-utils** - Fuzzy search and filtering
- **Native Intl API** - Internationalization for currency formatting
- **React Chart.js 2** - For rendering interactive charts on the Coin Details page

---

## Getting Started

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
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint
npm run type-check # Run TypeScript compiler
```

---

## Features Breakdown

### Navigation and Pages

- **Landing Page**: An introductory page for the dashboard.
- **Dashboard Page**: The main view displaying real-time cryptocurrency data.
- **Coin Details Page**: Provides in-depth information and historical charts for a selected cryptocurrency.
- **Favorites Page**: Displays a curated list of the user's favorite cryptocurrencies.

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

---

## Design System

### Color Scheme

- **Primary Colors** - Blue gradient for branding
- **Semantic Colors** - Green for gains, red for losses
- **Neutral Colors** - Tailwind's gray palette for backgrounds
- **Theme Support** - Automatic dark/light mode switching using shadcn/ui.

### Typography

- **Font Stack** - System fonts for optimal performance
- **Size Scale** - Consistent sizing using Tailwind's scale
- **Weight Hierarchy** - Proper font weights for information hierarchy

### Spacing & Layout

- **Grid System** - Responsive grid layouts
- **Consistent Spacing** - Tailwind's spacing scale
- **Card Components** - Consistent card design pattern

---

## Configuration

### API Configuration

The dashboard primarily uses the CoinGecko API for cryptocurrency data, and a random user API for the profile:

```typescript
// CoinGecko API
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const COINGECKO_PARAMS =
  "?vs_currency=usd&order=market_cap_desc&per_page=50&page=1";

// Random User API for profile
const RANDOM_USER_API_URL = "https://randomuser.me/api/";
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

---

## Data Flow

1.  **API Fetching** - RTK Query fetches data from CoinGecko (for crypto) and Random User API (for profile).
2.  **Caching** - Automatic caching and background updates provided by RTK Query.
3.  **State Management** - Redux Toolkit stores and manages global state, including favorite cryptocurrencies.
4.  **Persistence** - Redux Persist ensures favorite crypto data remains after browser refresh.
5.  **Processing** - Data transformation and formatting for display.
6.  **Filtering** - Real-time search and filter application on table data.
7.  **Rendering** - Optimized table and chart rendering for smooth user experience.

---

## Performance Optimizations

- **RTK Query Caching** - Intelligent data caching and invalidation to minimize redundant API calls.
- **Debounced Search** - Reduced API calls and improved UX during search operations.
- **Memoized Components** - Optimized re-renders of React components.
- **Lazy Loading** - On-demand component loading for faster initial page loads.
- **Redux Persist** - Efficiently stores and rehydrates state, reducing initial data fetches on subsequent visits.

---

## Build & Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Vercel** - Recommended for optimal performance and easy CI/CD integration.
- **Netlify** - Easy deployment with form handling.
- **GitHub Pages** - Free hosting for static sites.
- **Docker** - Containerized deployment for consistent environments.

---

## Contributing

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices.
- Use semantic commit messages.
- Add tests for new features.
- Update documentation as needed.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **CoinGecko** - For providing the cryptocurrency API.
- **TanStack Team** - For excellent React libraries (Query, Table, Router).
- **Redux Toolkit Team** - For powerful state management.
- **shadcn/ui** - For beautiful and accessible UI components.
- **Tailwind CSS** - For the utility-first CSS framework.
- **Random User Generator** - For providing random user data for the profile.

---

## Support

If you have any questions or need help with setup, please:

- Open an issue on GitHub.
- Check the documentation.
- Review existing issues and discussions.

---

**Built with by [Your Name]**

_Last updated: June 16, 2025_
