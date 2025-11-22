# Getting Started with KonnectEdRN

Welcome to **KonnectEdRN**, a production-ready React Native template built with Expo, NativeWind, and TypeScript.

## 🚀 Prerequisites

- Node.js (v18+)
- npm or yarn
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for physical device testing)

## 🛠 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd KonnectEdRN
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory (copy from `.env.example` if available):
   ```env
   EXPO_PUBLIC_API_URL=https://your-api-url.com
   EXPO_PUBLIC_AUTH_API_URL=https://your-auth-api-url.com
   EXPO_PUBLIC_BETTER_AUTH_SCHEME=your-scheme
   ```

## 🏃‍♂️ Running the App

- **Start the development server:**
  ```bash
  npx expo start
  ```

- **Run on iOS Simulator:**
  Press `i` in the terminal.

- **Run on Android Emulator:**
  Press `a` in the terminal.

## 📁 Project Structure

- `app/`: Expo Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Core logic, API clients, stores, and utilities.
- `assets/`: Images and fonts.

## 🎨 Theming

The app supports Light and Dark modes out of the box.
- Toggle theme in **Settings**.
- Edit colors in `lib/theme.ts` and `global.css`.

## 🔐 Authentication

Powered by **BetterAuth**.
- Configure auth settings in `lib/auth/authClient.ts`.
- Auth state is managed via `useAuthStore`.

## 📄 Documentation

For more details, check:
- [Architecture Guide](ARCHITECTURE.md)
- [Best Practices](BEST_PRACTICES.md)
