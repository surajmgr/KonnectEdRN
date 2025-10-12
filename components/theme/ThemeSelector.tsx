import { ThemeMode, useTheme } from "@/wrappers/ThemeProvider";
import React from "react";
import { View, Text, Pressable } from "react-native";

export function ThemeSelector() {
  const { mode, setMode, currentScheme } = useTheme();

  const modes: ThemeMode[] = ["light", "dark", "system"];

  return (
    <View className="flex-row items-center justify-center space-x-3 p-4 bg-background">
      <Text className="text-foreground dark:text-foreground-dark">Theme</Text>
      <Text className="text-foreground dark:text-foreground-dark">
        {currentScheme.charAt(0).toUpperCase() + currentScheme.slice(1)}
      </Text>
      {modes.map((m) => (
        <Pressable
          key={m}
          onPress={() => setMode(m)}
          className={`px-4 py-2 rounded-lg border ${mode === m
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border"
            }`}
        >
          <Text
            className={`text-sm ${mode === m ? "text-primary-foreground" : "text-foreground"
              }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
