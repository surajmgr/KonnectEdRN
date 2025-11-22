import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { type ThemeMode, useTheme } from '@/wrappers/ThemeProvider';

export function ThemeSelector() {
	const { mode, setMode, currentScheme } = useTheme();

	const modes: ThemeMode[] = ['light', 'dark', 'system'];

	return (
		<View className="flex-col items-center justify-center space-x-3 p-4 bg-background">
			<Text className="w-full text-foreground dark:text-foreground-dark">Theme</Text>
			<Text className="text-foreground dark:text-foreground-dark">
				{currentScheme.charAt(0).toUpperCase() + currentScheme.slice(1)}
			</Text>
			{modes.map((m) => (
				<Button key={m} variant={mode === m ? 'default' : 'outline'} onPress={() => setMode(m)}>
					<Text className={`text-sm ${mode === m ? 'text-primary-foreground' : 'text-foreground'}`}>
						{m.charAt(0).toUpperCase() + m.slice(1)}
					</Text>
				</Button>
			))}
		</View>
	);
}
