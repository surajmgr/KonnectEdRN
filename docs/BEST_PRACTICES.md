# Best Practices & Coding Standards

To maintain a high-quality codebase, please adhere to the following guidelines.

## 📝 Code Style

- **TypeScript**: Use strict typing. Avoid `any` whenever possible. Define interfaces for props and data models.
- **Functional Components**: Use React functional components with hooks.
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `UserProfile.tsx`)
  - Functions/Variables: `camelCase` (e.g., `fetchUserData`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

## 🎨 UI & Styling

- **Use Components**: Don't build complex UIs from scratch in screens. Break them down into reusable components in `components/`.
- **Tailwind CSS**: Use utility classes for styling. Avoid inline styles (`style={{...}}`) unless dynamic values are required.
- **Responsiveness**: Test on different screen sizes. Use `SafeAreaView` where appropriate.

## ⚡ Performance

- **Memoization**: Use `useMemo` and `useCallback` for expensive calculations or stable function references.
- **Lists**: Always use `FlatList` or `SectionList` for long lists. Avoid `ScrollView` for large datasets.
- **Images**: Use Expo Image for better caching and performance.

## 🔒 Security

- **Secrets**: Never hardcode API keys or secrets. Use `.env` files and `EXPO_PUBLIC_` prefix for public env vars.
- **Storage**: Use `SecureStore` for sensitive data (tokens) and `AsyncStorage` for non-sensitive preferences.

## 🧪 Testing

- Write unit tests for utility functions.
- Test critical flows (Login, Checkout) manually or with E2E tools.

## 📦 Git Workflow

- **Commits**: Write clear, descriptive commit messages.
- **Branches**: Use feature branches (e.g., `feature/user-profile`) and PRs for changes.
