import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useNativeColorScheme } from "nativewind";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { NAV_THEME } from "@/lib/theme";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  currentScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "system",
  setMode: () => { },
  currentScheme: "light",
});

export const useTheme = () => useContext(ThemeContext);

const STORAGE_KEY = "APP_THEME_MODE";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const { setColorScheme } = useNativeColorScheme();
  const systemScheme = useSystemColorScheme();

  // Load theme from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedMode === "light" || savedMode === "dark" || savedMode === "system") {
          setModeState(savedMode);
        }
      } catch (err) {
        console.error("Failed to load theme mode:", err);
      }
    })();
  }, []);

  // Persist theme changes
  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (err) {
      console.error("Failed to save theme mode:", err);
    }
  };

  const currentScheme = mode === "system" ? systemScheme ?? "light" : mode;

  // Sync NativeWind `.dark` class + state
  useEffect(() => {
    setColorScheme(currentScheme);
  }, [currentScheme]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, currentScheme }}>
      <NavigationThemeProvider value={NAV_THEME[currentScheme]}>
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}
