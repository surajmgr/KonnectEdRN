import { View, Text, SafeAreaView } from "react-native";
import { useColorScheme } from "nativewind";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { Link } from "expo-router";

export default function Index() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-foreground text-2xl font-bold">
          Hello, Tailwind for React Native 🌙
        </Text>
        <Text className="text-primary mt-2">
          Theme-aware colors and radii!
        </Text>

        <ThemeSelector />

        <Link href="/custom">Custom</Link>
        <Link href="/custom/1">Custom 1</Link>
      </View>
    </SafeAreaView>
  );
}
