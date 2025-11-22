# Developer Guide

This guide provides practical instructions for common development tasks in **KonnectEdRN**.

## 📄 Adding a New Page

1. **Create the File**:
   Add a new `.tsx` file in the `app/` directory.
   - For a tab screen: `app/(tabs)/your-page.tsx`
   - For a stack screen: `app/your-page.tsx` or `app/feature/index.tsx`

2. **Basic Template**:
   ```tsx
   import { View } from 'react-native';
   import { Text } from '@/components/ui/text';
   import { SafeAreaView } from 'react-native-safe-area-context';
   import { Stack } from 'expo-router';

   export default function YourPage() {
     return (
       <SafeAreaView className="flex-1 bg-background">
         <Stack.Screen options={{ title: 'Page Title' }} />
         <View className="p-4">
           <Text className="text-foreground">Hello World</Text>
         </View>
       </SafeAreaView>
     );
   }
   ```

## 🧩 Creating a Component

1. **Location**:
   Place reusable components in `components/`. Use subfolders like `ui/` for atoms or `features/` for complex blocks.

2. **Styling**:
   Use `className` with Tailwind classes.
   ```tsx
   interface Props {
     title: string;
   }

   export function Card({ title }: Props) {
     return (
       <View className="bg-card p-4 rounded-xl border border-border">
         <Text className="text-lg font-bold text-foreground">{title}</Text>
       </View>
     );
   }
   ```

## 📡 Fetching Data

Use **TanStack Query** for all data fetching.

1. **Define the Fetcher**:
   Create a function in `lib/api/` or inside your component file if it's specific.
   ```ts
   const fetchData = async () => {
     const res = await apiClient.get('/endpoint');
     return res.data;
   };
   ```

2. **Use the Hook**:
   ```tsx
   const { data, isLoading, error } = useQuery({
     queryKey: ['key'],
     queryFn: fetchData,
   });
   ```

## 🔐 Handling Authentication

Access the user session anywhere with `useAuthStore`.

```tsx
import { useAuthStore } from '@/lib/store/authStore';

export function UserGreeting() {
  const { user } = useAuthStore();

  if (!user) return <Text>Please log in</Text>;

  return <Text>Welcome, {user.name}</Text>;
}
```

## 🎨 Theming

- Use `bg-background` for page backgrounds.
- Use `text-foreground` for primary text.
- Use `text-muted-foreground` for secondary text.
- Use `border-border` for borders.

These classes automatically adapt to Light and Dark modes.
