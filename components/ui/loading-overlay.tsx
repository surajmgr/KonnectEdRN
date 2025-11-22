import { ActivityIndicator, Modal, View } from 'react-native';
import { Text } from '@/components/ui/text';

interface LoadingOverlayProps {
	visible: boolean;
	message?: string;
}

export const LoadingOverlay = ({ visible, message }: LoadingOverlayProps) => {
	return (
		<Modal transparent visible={visible} animationType="fade">
			<View className="flex-1 bg-black/50 items-center justify-center">
				<View className="bg-white rounded-2xl p-6 items-center gap-4 min-w-[200px]">
					<ActivityIndicator size="large" color="#3B82F6" />
					{message && <Text className="text-gray-700 text-center">{message}</Text>}
				</View>
			</View>
		</Modal>
	);
};
