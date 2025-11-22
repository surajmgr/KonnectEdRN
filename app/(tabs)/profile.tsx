import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/lib/store/authStore';

export default function ProfileScreen() {
	const { user } = useAuthStore();

	if (!user) {
		return (
			<SafeAreaView className="flex-1 bg-background justify-center px-6">
				<View className="items-center">
					<View className="w-24 h-24 rounded-full bg-muted items-center justify-center mb-6">
						<Ionicons name="person-outline" size={48} color="#9CA3AF" />
					</View>
					<Text className="text-2xl font-bold text-foreground mb-2">Not Signed In</Text>
					<Text className="text-base text-muted-foreground text-center mb-8">
						Sign in to view your profile, manage settings, and access personalized features.
					</Text>
					<Button className="w-full" onPress={() => router.push('/(auth)/login')}>
						<Text className="text-white font-semibold">Sign In / Sign Up</Text>
					</Button>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView className="flex-1 px-4 py-6">
				<View className="items-center mb-8">
					<View className="w-24 h-24 rounded-full bg-muted items-center justify-center mb-4 overflow-hidden border-2 border-border">
						{user.image ? (
							<Image source={{ uri: user.image }} className="w-full h-full" />
						) : (
							<Ionicons name="person" size={48} color="#9CA3AF" />
						)}
					</View>
					<Text className="text-2xl font-bold text-foreground">{user.name || 'User'}</Text>
					<Text className="text-base text-muted-foreground">{user.email}</Text>
				</View>

				<View className="bg-card rounded-xl p-4 mb-6 border border-border">
					<Text className="text-lg font-semibold mb-4 text-foreground">Personal Information</Text>

					<View className="mb-4">
						<Text className="text-sm text-muted-foreground mb-1">Full Name</Text>
						<Text className="text-base text-foreground">{user.name || 'Not set'}</Text>
					</View>

					<View className="mb-4">
						<Text className="text-sm text-muted-foreground mb-1">Email</Text>
						<Text className="text-base text-foreground">{user.email}</Text>
					</View>

					<Button variant="outline" className="mt-2">
						<Text>Edit Profile</Text>
					</Button>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
