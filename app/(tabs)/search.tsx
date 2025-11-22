import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

const CATEGORIES = [
	{ id: 1, name: 'Design', icon: 'color-palette-outline', color: 'bg-pink-100 text-pink-600' },
	{ id: 2, name: 'Code', icon: 'code-slash-outline', color: 'bg-blue-100 text-blue-600' },
	{ id: 3, name: 'Marketing', icon: 'megaphone-outline', color: 'bg-orange-100 text-orange-600' },
	{ id: 4, name: 'Business', icon: 'briefcase-outline', color: 'bg-green-100 text-green-600' },
];

export default function SearchScreen() {
	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView className="flex-1 px-4 py-6">
				<Text className="text-3xl font-bold text-foreground mb-6">Search</Text>

				{/* Search Bar */}
				<View className="mb-8">
					<Input placeholder="Search for anything..." className="bg-muted/50 border-0 h-12 pl-11" />
					<View className="absolute left-4 top-3.5">
						<Ionicons name="search" size={20} color="#9CA3AF" />
					</View>
				</View>

				{/* Categories */}
				<View className="mb-8">
					<Text className="text-lg font-bold text-foreground mb-4">Browse Categories</Text>
					<View className="flex-row flex-wrap gap-3">
						{CATEGORIES.map((cat) => (
							<TouchableOpacity
								key={cat.id}
								className="w-[48%] bg-card p-4 rounded-xl border border-border items-center gap-2"
							>
								<View
									className={`w-12 h-12 rounded-full items-center justify-center ${cat.color.split(' ')[0]}`}
								>
									<Ionicons
										name={cat.icon as keyof typeof Ionicons.glyphMap}
										size={24}
										className={cat.color.split(' ')[1]}
									/>
								</View>
								<Text className="font-medium text-foreground">{cat.name}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Recent Searches */}
				<View className="mb-6">
					<Text className="text-lg font-bold text-foreground mb-4">Recent Searches</Text>
					<View className="gap-2">
						{['React Native Templates', 'UI Components', 'Authentication Flow'].map((term) => (
							<View
								key={term}
								className="flex-row items-center gap-3 py-3 border-b border-border/50"
							>
								<Ionicons name="time-outline" size={20} color="#9CA3AF" />
								<Text className="text-foreground flex-1">{term}</Text>
								<Ionicons name="close" size={16} color="#9CA3AF" />
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
