import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useColorScheme as useNativeColorScheme } from 'nativewind';
import type React from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemeStore } from '@/lib/store/themeStore';
import { NAV_THEME } from '@/lib/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
	currentScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue>({
	mode: 'system',
	setMode: () => {},
	currentScheme: 'light',
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const { theme: mode, setTheme: setMode } = useThemeStore();
	const { setColorScheme } = useNativeColorScheme();
	const systemScheme = useSystemColorScheme();

	const currentScheme = mode === 'system' ? (systemScheme ?? 'light') : mode;

	// Sync NativeWind `.dark` class + state
	useEffect(() => {
		setColorScheme(currentScheme);
	}, [currentScheme, setColorScheme]);

	return (
		<ThemeContext.Provider value={{ mode, setMode, currentScheme }}>
			<NavigationThemeProvider value={NAV_THEME[currentScheme]}>{children}</NavigationThemeProvider>
		</ThemeContext.Provider>
	);
}
