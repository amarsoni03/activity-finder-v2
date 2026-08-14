# ActivityFirst Moscow — Activity & Course Discovery Platform

A modern, responsive, course-first web platform for discovering classes, sports, workshops, and experiences across Moscow's metro transit network.

---

## 🌟 Key Features

- **Course First. Studio Second:** Clean activity-first cards prioritizing schedule, start dates, metro station, walk time, level, price, and instant spot reservation.
- **Moscow Metro Centric Search:** Multi-level line and station filter with transit proximity calculation.
- **Smart 10-Factor Ranking Engine:** Weighted relevance combining exact keyword matches, metro proximity, user free-time schedule matching, ratings, and category diversification.
- **Interactive Weekly Schedule & Map Views:** Visual schedule calendar and metro map exploration.
- **User & Provider Dashboards:** Customer bookings history, waitlists, review submission, and instructor management hubs.
- **AI Concierge Matchmaker:** Semantic activity recommendations powered by Gemini with smart local fallback.

---

## 🏗️ Architecture & Codebase Organization

The codebase is organized into domain-driven feature modules:

- `src/features/activities/` — Activity catalog, bookings, bookmarks, waitlists, reviews, messaging, and ranking engine.
- `src/features/search/` — Multi-criteria search, autocompletion, popovers, and bi-directional URL synchronization.
- `src/features/metro/` — Moscow Metro transit lines, stations data, and interactive map view.
- `src/features/schedule/` — Free time planner, My Week views, and weekly schedule calendar.
- `src/features/personalization/` — User preferences, commute calculation, and personalized tabs.
- `src/features/dashboard/` — User and Provider dashboard views.
- `src/components/layout/` — Global Header, Footer, SidebarFilters, and Mobile Navigation.
- `src/components/ui/` — Design system primitives and Toast notifications.

For in-depth architectural patterns, data flow diagrams, and developer extension guides, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Local Run
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```
