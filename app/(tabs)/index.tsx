import { View } from "react-native";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-6">
        <Text variant={"h1"} className="text-center">
          Hello, Tailwind for React Native 🌙
        </Text>
        <Text className="text-primary mt-2 text-center">
          Theme-aware colors and radii!
        </Text>

        <ThemeSelector />

        <Link href="/custom/1">Custom 1</Link>

        <Link className="text-foreground" href="/custom/2">Custom 2</Link>

        <Button className="mt-6" variant={"destructive"}>
          <Text>Button</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
