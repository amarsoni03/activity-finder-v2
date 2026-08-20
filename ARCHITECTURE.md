# ActivityFirst Moscow — Architecture & Engineering Guide

## 1. Overview & Philosophy

**ActivityFirst Moscow** is a domain-driven, course-first activity discovery application centered around Moscow's metro transit network. 

### Core Product Constitution
- **Course First. Studio Second:** Activity details (Title, Schedule, Start Date, Metro Station, Walk Time, Level, Price, Trust Badges, Reserve Spot CTA) are the primary hierarchy. Studio and instructor details are secondary on cards and primary on the Activity Detail Page.
- **Metro-Centric Discovery:** Search flows naturally from Category $\rightarrow$ Metro Line & Station $\rightarrow$ Available Time $\rightarrow$ Ranked Results.
- **Predictable Local State with URL Synchronization:** Filters, selected tabs, search keywords, and view modes reflect bi-directionally in the browser URL search params without jarring full reloads.

---

## 2. Directory Structure

```text
activity-finder/
├── src/
│   ├── features/                     # Domain-first feature modules
│   │   ├── activities/               # Activity catalog, booking, waitlist, messaging & ranking
│   │   │   ├── components/           # ActivityCard, ActivityDetailPage, Reviews, Modals, TrustBadge
│   │   │   ├── data/                 # Master activities catalog & mock sessions
│   │   │   ├── hooks/                # useActivities, useBookings, useSavedActivities, useWaitlists, useActivityMessaging
│   │   │   ├── services/             # activityStorage (localStorage abstraction)
│   │   │   ├── utils/                # ranking.ts (10-factor weighted ranking), searchRelevance.ts
│   │   │   ├── types.ts              # Domain types for activities, ranking & scoring interfaces
│   │   │   └── index.ts              # Public API barrel export
│   │   │
│   │   ├── search/                   # Search inputs, autocompletion, popovers & URL sync
│   │   │   ├── components/           # HeroSearch, MetroPopover, TimeSelectorPopover, CategoryPopover, etc.
│   │   │   ├── hooks/                # useActivityFilters (multi-criteria filtering & URL binding)
│   │   │   ├── utils/                # search.ts (orchestration), filterUrlSync.ts (URL binding)
│   │   │   ├── constants.ts          # Default filter values & tabs
│   │   │   ├── types.ts              # Search & filter interfaces (re-exports ranking types)
│   │   │   └── index.ts              # Public API barrel export
│   │   │
│   │   ├── metro/                    # Metro lines & stations data & map visualization
│   │   │   ├── components/           # MetroMapView
│   │   │   ├── data/                 # Moscow Metro lines & stations data (16 lines, 192 stations)
│   │   │   ├── utils/                # metroUtils (canonical getMetroLineColor, station lookups)
│   │   │   ├── types.ts              # MetroLine, MetroStation interfaces
│   │   │   └── index.ts              # Public API barrel export
│   │   │
│   │   ├── schedule/                 # Free time planning & weekly schedule views
│   │   │   ├── components/           # MyFreeTimePlanner, MyWeekView, MyWeekActivityCard, WeeklyScheduleView
│   │   │   └── index.ts              # Public API barrel export
│   │   │
│   │   ├── personalization/          # User preferences, schedule matching & commute calculation
│   │   │   ├── hooks/                # useUserPreferences
│   │   │   ├── utils/                # Commute calculation, goal mapping, schedule enrichment
│   │   │   ├── types.ts              # UserPreferences, UserFreeTime, CommuteInfo
│   │   │   └── index.ts              # Public API barrel export
│   │   │
│   │   └── dashboard/                # User & Provider dashboard hubs
│   │       ├── components/           # UserDashboard, ProviderDashboard, UpcomingSection, HistorySection, etc.
│   │       └── index.ts              # Public API barrel export
│   │
│   ├── components/                   # Shared presentation & layout components
│   │   ├── layout/                   # Header, Footer, SidebarFilters, MobileStickyNav
│   │   └── ui/                       # Toast notification system
│   │
│   ├── hooks/                        # Generic shared application & accessibility hooks
│   │   └── useDialogFocus.ts         # Focus trapping, escape key, and focus restoration
│   │
│   ├── pages/                        # Page-level coordinators
│   │   └── HomePage.tsx              # Main Explore & Results page layout
│   │
│   ├── types/                        # Core common domain types & barrel export
│   │   ├── common.ts                 # Shared Moscow domain primitives (Category, Audience, DeliveryMode)
│   │   └── index.ts                  # Unified type exports
│   │
│   ├── services/                     # External integration services
│   │   └── aiService.ts              # Gemini API client with smart local fallback
│   │
│   ├── utils/                        # Formatting functions
│   │   ├── formatters.ts             # Currency (₽), phone numbers, canonical metro line color re-export
│   │   └── index.ts                  # Export barrel
│   │
│   ├── App.tsx                       # Root coordinator (<470 lines)
│   ├── index.css                     # Global design tokens & styling
│   └── main.tsx                      # Application bootstrap
```

---

## 3. Unidirectional Dependency Architecture

Dependencies strictly flow downward:

```text
App / Pages
     │
     ▼
features/search
     │
     ▼
features/activities (Catalog, Scoring, Storage, Cards)
     │
     ▼
features/personalization, features/metro (Commute, Stations, Lines)
     │
     ▼
types/common, utils/formatters
```

- **Features do not create circular dependencies:** `features/activities` has 0 dependencies on `features/search`.
- **Metro Color Canonical Owner:** `features/metro/utils/metroUtils.ts` is the single source of truth for `getMetroLineColor`.
- **Ranking Ownership:** Ranking types and algorithms reside in `features/activities/`, consumed by `features/search/hooks/useActivityFilters.ts`.

---

## 4. Persistence Architecture & Key Ownership

All persistent states are managed with strict ownership and fallback error-handling:

| Storage Key | Owner | Classification | Purpose |
| :--- | :--- | :--- | :--- |
| `af_activities_moscow` | `features/activities` | Domain Persistence | Edited and user-published activities. |
| `af_saved` | `features/activities` | Domain Persistence | Bookmarked activity IDs. |
| `af_bookings` | `features/activities` | Domain Persistence | Confirmed bookings. |
| `af_waitlists` | `features/activities` | Domain Persistence | Provider waitlist queue registrations. |
| `af_conversations` | `features/activities` | Domain Persistence | Instructor chat threads. |
| `af_user_preferences` | `features/personalization` | Domain Persistence | User free time grid and home metro station. |
| `af_user_waitlist_state`| `features/activities` | UI-Local Persistence | Local user waitlist positions & notification flags in `WaitlistModal`. |
| `activity_finder_provider_draft` | `features/activities` | UI-Local Draft Cache | Temporary form autosave in `CreateActivityModal`; cleared on submit. |

---

## 5. Verification Status

### Logic & Algorithmic Verification (VERIFIED)
* **TypeScript Compilation:** `npx tsc --noEmit` compiles cleanly with 0 errors.
* **Production Build:** Vite production build generates bundle without errors.
* **10-Factor Ranking Engine:** Weighted scoring formula, boosts/penalties, and category diversification verified across all 784 catalog listings.
* **URL Parameter Synchronization:** Bidirectional serialization and parsing verified for all query parameters (`q`, `category`, `subSkill`, `audience`, `mode`, `metroLine`, `stations`, `time`, `days`, `level`, `rating`, `maxPrice`, `sort`, `verified`, `tab`, `view`).
* **Persistence Fallbacks:** All 8 storage keys protected with try/catch fallback handlers.
* **Search Scoring & Autocomplete:** Typo-tolerant Levenshtein distance and multi-field token matching verified.

### Browser UI Automated Execution (NOT VERIFIED)
* Automated Playwright test runner encountered an upstream binary download failure (CDN 404 for Playwright driver `1.57.0` on `mac-arm64`). UI rendering and click flows were checked via dev server on port 3000.
