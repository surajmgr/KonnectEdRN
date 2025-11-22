import { Ionicons } from '@expo/vector-icons';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';

const NOTIFICATIONS = [
	{
		id: 1,
		title: 'New Feature Available',
		message: 'Check out the new dark mode toggle in settings.',
		time: '2m ago',
		read: false,
		icon: 'star',
		color: 'bg-yellow-100 text-yellow-600',
	},
	{
		id: 2,
		title: 'System Update',
		message: 'KonnectEdRN v1.0.0 is now live.',
		time: '1h ago',
		read: false,
		icon: 'cloud-upload',
		color: 'bg-blue-100 text-blue-600',
	},
	{
		id: 3,
		title: 'Welcome!',
		message: 'Thanks for downloading our template.',
		time: '1d ago',
		read: true,
		icon: 'heart',
		color: 'bg-pink-100 text-pink-600',
	},
];

export default function NotificationsScreen() {
	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView className="flex-1 px-4 py-6">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-3xl font-bold text-foreground">Notifications</Text>
					<Text className="text-blue-500 font-medium">Mark all as read</Text>
				</View>

				<View className="gap-3">
					{NOTIFICATIONS.map((notif) => (
						<View
							key={notif.id}
							className={`p-4 rounded-xl border ${notif.read ? 'bg-background border-border' : 'bg-card border-blue-200 dark:border-blue-900'} flex-row gap-4`}
						>
							<View
								className={`w-10 h-10 rounded-full items-center justify-center ${notif.color.split(' ')[0]}`}
							>
								<Ionicons
									name={notif.icon as keyof typeof Ionicons.glyphMap}
									size={20}
									className={notif.color.split(' ')[1]}
								/>
							</View>
							<View className="flex-1">
								<View className="flex-row justify-between items-start mb-1">
									<Text
										className={`text-base ${notif.read ? 'font-medium' : 'font-bold'} text-foreground`}
									>
										{notif.title}
									</Text>
									<Text className="text-xs text-muted-foreground">{notif.time}</Text>
								</View>
								<Text className="text-muted-foreground text-sm leading-5">{notif.message}</Text>
							</View>
							{!notif.read && <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />}
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
