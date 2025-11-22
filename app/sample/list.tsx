import { useQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { apiClient } from '@/lib/api/client';

interface Post {
	id: number;
	title: string;
	body: string;
}

const fetchPosts = async () => {
	// Using JSONPlaceholder for demo purposes
	const response = await apiClient.get<Post[]>(
		'https://jsonplaceholder.typicode.com/posts?_limit=10'
	);
	return response.data;
};

export default function ListScreen() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['sample-posts'],
		queryFn: fetchPosts,
	});

	if (isLoading) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-background" edges={['bottom']}>
				<Stack.Screen options={{ title: 'Data List' }} />
				<ActivityIndicator size="large" />
				<Text className="mt-4 text-muted-foreground">Loading data...</Text>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView
				className="flex-1 justify-center items-center bg-background px-4"
				edges={['bottom']}
			>
				<Stack.Screen options={{ title: 'Data List' }} />
				<Text className="text-destructive text-lg font-semibold mb-2">Error loading data</Text>
				<Text className="text-muted-foreground text-center">{error.message}</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
			<Stack.Screen options={{ title: 'Data List' }} />
			<FlatList
				data={data}
				keyExtractor={(item) => item.id.toString()}
				contentContainerClassName="p-4 gap-4"
				ListHeaderComponent={
					<Text className="text-3xl font-bold mb-4 text-foreground">Sample List</Text>
				}
				renderItem={({ item }) => (
					<View className="bg-card p-4 rounded-xl border border-border shadow-sm">
						<Text className="text-lg font-semibold mb-2 text-foreground" numberOfLines={1}>
							{item.title}
						</Text>
						<Text className="text-muted-foreground" numberOfLines={2}>
							{item.body}
						</Text>
					</View>
				)}
			/>
		</SafeAreaView>
	);
}
