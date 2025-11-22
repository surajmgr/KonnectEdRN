import { router } from 'expo-router';
import { ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/lib/store/authStore';
import { useThemeStore } from '@/lib/store/themeStore';

export default function SettingsScreen() {
	const { theme, setTheme } = useThemeStore();
	const { logout, user } = useAuthStore();

	const handleLogout = async () => {
		await logout();
		router.replace('/(auth)/login');
	};

	const toggleTheme = (value: boolean) => {
		setTheme(value ? 'dark' : 'light');
	};

	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView className="flex-1 px-4 py-6">
				<Text className="text-3xl font-bold mb-8 text-foreground">Settings</Text>

				<View className="bg-card rounded-xl p-4 mb-6 border border-border">
					<Text className="text-lg font-semibold mb-4 text-foreground">Appearance</Text>
					<View className="flex-row items-center justify-between">
						<Text className="text-base text-foreground">Dark Mode</Text>
						<Switch value={theme === 'dark'} onValueChange={toggleTheme} />
					</View>
				</View>

				<View className="bg-card rounded-xl p-4 mb-6 border border-border">
					<Text className="text-lg font-semibold mb-4 text-foreground">Account</Text>
					{user && (
						<View className="mb-4">
							<Text className="text-base text-muted-foreground">Logged in as</Text>
							<Text className="text-base font-medium text-foreground">{user.email}</Text>
						</View>
					)}
					<Button variant="destructive" onPress={handleLogout}>
						<Text>Log Out</Text>
					</Button>
				</View>

				<View className="bg-card rounded-xl p-4 mb-6 border border-border">
					<Text className="text-lg font-semibold mb-4 text-foreground">Developer Tools</Text>
					<View className="gap-2">
						<Button variant="outline" onPress={() => router.push('/sample/components')}>
							<Text>UI Components Showcase</Text>
						</Button>
						<Button variant="outline" onPress={() => router.push('/sample/list')}>
							<Text>Data List Example</Text>
						</Button>
					</View>
				</View>

				<View className="items-center mt-8 w-full">
					<Text className="text-sm text-muted-foreground">Version 1.0.0</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
