# Architecture Guide

**KonnectEdRN** follows a modular and scalable architecture designed for maintainability and performance.

## 🏗 Core Technologies

- **Framework**: React Native (Expo)
- **Routing**: Expo Router (File-based routing)
- **Styling**: NativeWind (Tailwind CSS for RN)
- **State Management**: Zustand (Global state) + React Query (Server state)
- **Authentication**: BetterAuth
- **Networking**: Axios

## 📂 Directory Structure

```
KonnectEdRN/
├── app/                 # Screens and Navigation
│   ├── (auth)/          # Authentication Stack
│   ├── (tabs)/          # Main Tab Navigator
│   ├── _layout.tsx      # Root Layout & Providers
│   └── ...
├── components/          # UI Components
│   ├── ui/              # Atomic Design Components (Button, Input, etc.)
│   └── ...
├── lib/                 # Business Logic & Utilities
│   ├── api/             # API Client & Endpoints
│   ├── auth/            # Auth Configuration & Handlers
│   ├── store/           # Zustand Stores (Auth, Theme)
│   ├── utils/           # Helper Functions
│   └── ...
├── hooks/               # Custom React Hooks
└── assets/              # Static Assets
```

## 🧩 Key Concepts

### 1. Navigation
We use **Expo Router**. The file structure in `app/` determines the routes.
- `_layout.tsx` files define navigators (Stack, Tabs).
- Folders like `(tabs)` are "groups" that don't affect the URL path but organize layouts.

### 2. State Management
- **Global App State**: Managed by **Zustand** (`lib/store/`). Use this for session, theme, and app-wide settings.
- **Server Data**: Managed by **TanStack Query**. Use this for fetching, caching, and synchronizing API data.

### 3. Styling
We use **NativeWind**. Write standard Tailwind classes in `className` props.
- **Dark Mode**: Supported via `dark:` prefix.
- **Theme Store**: The `themeStore` syncs the app's theme with NativeWind's color scheme.

### 4. Authentication
Authentication is handled by **BetterAuth**.
- `authClient.ts`: Configures the client.
- `authHandlers.ts`: Wraps auth operations and updates the `authStore`.
- `useAuthStore`: Provides access to the current user and session.

## 🛡 Error Handling
- **Global Error Boundary**: Wraps the entire app to catch crashes.
- **API Errors**: Handled via Axios interceptors and centralized error utilities.
