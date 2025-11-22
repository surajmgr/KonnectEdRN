import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/lib/store/authStore';

export default function HomeScreen() {
	const { user } = useAuthStore();

	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView className="flex-1 px-4 py-6">
				{/* Header */}
				<View className="flex-row justify-between items-center mb-8">
					<View>
						<Text className="text-muted-foreground text-base">Welcome back,</Text>
						<Text className="text-2xl font-bold text-foreground">{user?.name || 'Guest'}</Text>
					</View>
					<View className="w-10 h-10 rounded-full bg-muted items-center justify-center overflow-hidden border border-border">
						{user?.image ? (
							<Image source={{ uri: user.image }} className="w-full h-full" />
						) : (
							<Ionicons name="person" size={20} color="#9CA3AF" />
						)}
					</View>
				</View>

				{/* Dashboard Widgets */}
				<View className="flex-row gap-4 mb-6">
					<View className="flex-1 bg-blue-500 rounded-2xl p-4 shadow-sm">
						<Ionicons name="stats-chart" size={24} color="white" />
						<Text className="text-white font-bold text-lg mt-2">Overview</Text>
						<Text className="text-blue-100 text-sm">Check your stats</Text>
					</View>
					<View className="flex-1 bg-purple-500 rounded-2xl p-4 shadow-sm">
						<Ionicons name="trending-up" size={24} color="white" />
						<Text className="text-white font-bold text-lg mt-2">Activity</Text>
						<Text className="text-purple-100 text-sm">+12% this week</Text>
					</View>
				</View>

				{/* Recent Section */}
				<View className="mb-6">
					<Text className="text-lg font-bold text-foreground mb-4">Recent Updates</Text>
					<View className="gap-3">
						{[1, 2, 3].map((i) => (
							<View
								key={i}
								className="bg-card p-4 rounded-xl border border-border flex-row items-center gap-3"
							>
								<View className="w-10 h-10 rounded-full bg-muted items-center justify-center">
									<Ionicons name="document-text-outline" size={20} color="#6B7280" />
								</View>
								<View className="flex-1">
									<Text className="font-semibold text-foreground">Project Update {i}</Text>
									<Text className="text-muted-foreground text-sm">Just now</Text>
								</View>
								<Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
