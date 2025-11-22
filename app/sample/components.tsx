import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

export default function ComponentsScreen() {
	return (
		<SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
			<Stack.Screen options={{ title: 'UI Components' }} />
			<ScrollView className="flex-1 px-4 py-6">
				<Text className="text-3xl font-bold mb-8 text-foreground">UI Showcase</Text>

				<View className="mb-8">
					<Text className="text-xl font-semibold mb-4 text-foreground">Buttons</Text>
					<View className="gap-4">
						<Button variant="default">
							<Text>Default Button</Text>
						</Button>
						<Button variant="secondary">
							<Text>Secondary Button</Text>
						</Button>
						<Button variant="destructive">
							<Text>Destructive Button</Text>
						</Button>
						<Button variant="outline">
							<Text>Outline Button</Text>
						</Button>
						<Button variant="ghost">
							<Text>Ghost Button</Text>
						</Button>
						<Button variant="link">
							<Text>Link Button</Text>
						</Button>
					</View>
				</View>

				<View className="mb-8">
					<Text className="text-xl font-semibold mb-4 text-foreground">Inputs</Text>
					<View className="gap-4">
						<Input placeholder="Default Input" />
						<Input placeholder="Disabled Input" editable={false} />
						<Input placeholder="Password Input" secureTextEntry />
					</View>
				</View>

				<View className="mb-8">
					<Text className="text-xl font-semibold mb-4 text-foreground">Typography</Text>
					<View className="gap-2 bg-card p-4 rounded-xl border border-border">
						<Text className="text-4xl font-bold text-foreground">Heading 1</Text>
						<Text className="text-3xl font-bold text-foreground">Heading 2</Text>
						<Text className="text-2xl font-bold text-foreground">Heading 3</Text>
						<Text className="text-xl font-semibold text-foreground">Heading 4</Text>
						<Text className="text-base text-foreground">Body Text</Text>
						<Text className="text-sm text-muted-foreground">Muted Text</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
