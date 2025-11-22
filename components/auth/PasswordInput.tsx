import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

interface PasswordInputProps {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder: string;
	editable?: boolean;
}

export const PasswordInput = ({
	label,
	value,
	onChangeText,
	placeholder,
	editable = true,
}: PasswordInputProps) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<View className="gap-2">
			<Label>
				<Text className="text-base font-medium text-gray-700">{label}</Text>
			</Label>
			<View className="relative">
				<Input
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					secureTextEntry={!showPassword}
					autoCapitalize="none"
					editable={editable}
					className="pr-12 h-14 text-base"
				/>
				<TouchableOpacity
					onPress={() => setShowPassword(!showPassword)}
					className="absolute right-4 top-1/2 -translate-y-1/2"
					disabled={!editable}
				>
					{showPassword ? (
						<Ionicons name="eye-off" size={22} color="#9CA3AF" />
					) : (
						<Ionicons name="eye" size={22} color="#9CA3AF" />
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
};
