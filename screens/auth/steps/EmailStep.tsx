import { Ionicons } from '@expo/vector-icons';
import type { Route } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { OAuthProviders } from '@/components/auth/OAuthProviders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { emailSchema } from '@/lib/schema/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { getErrorMessage } from '@/lib/utils/error';

interface EmailStepProps {
	authMode: 'signin' | 'signup';
	callbackUrl: Route;
	onEmailContinue: (email: string) => Promise<void>;
	onSwitchMode: () => void;
}

export const EmailStep = ({ callbackUrl, onEmailContinue }: EmailStepProps) => {
	const { signInWithGoogle, signInWithPasskey, signInAnonymously } = useAuthStore();
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isOAuthLoading, setIsOAuthLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		setError('');

		const validation = emailSchema.safeParse({ email: email.trim() });
		if (!validation.success) {
			setError(validation.error.errors[0].message);
			return;
		}

		setIsLoading(true);
		try {
			await onEmailContinue(email.trim());
		} catch (error) {
			const errorMessage = getErrorMessage(error, 'Failed to continue. Please try again.');
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleOAuthSignIn = async (provider: string) => {
		setIsOAuthLoading(true);
		setError('');

		try {
			switch (provider) {
				case 'google':
					await signInWithGoogle({ callbackUrl });
					break;
				case 'passkey':
					await signInWithPasskey({ callbackUrl });
					break;
				case 'anonymous':
					await signInAnonymously({ callbackUrl });
					break;
			}
		} catch (error) {
			// Store handles toast, we handle local error state
			const errorMessage = getErrorMessage(
				error,
				`Failed to sign in with ${provider}. Please try again.`
			);
			setError(errorMessage);
		} finally {
			setIsOAuthLoading(false);
		}
	};

	return (
		<View className="gap-6">
			{error && (
				<View className="bg-red-50 border border-red-200 p-4 rounded-xl dark:bg-red-950 dark:border-red-800">
					<Text className="text-red-800 text-sm font-medium dark:text-red-200">{error}</Text>
				</View>
			)}

			<OAuthProviders
				onAnonymousClick={() => handleOAuthSignIn('anonymous')}
				onGoogleClick={() => handleOAuthSignIn('google')}
				onPasskeyClick={() => handleOAuthSignIn('passkey')}
				isLoading={isOAuthLoading}
			/>

			<View className="relative my-2">
				<View className="absolute inset-0 items-center justify-center">
					<View className="w-full h-px bg-gray-200 dark:bg-gray-700" />
				</View>
				<View className="relative flex-row justify-center">
					<View className="px-4 bg-white dark:bg-gray-900">
						<Text className="text-sm text-gray-500 font-medium dark:text-gray-400">or</Text>
					</View>
				</View>
			</View>

			<View className="gap-4">
				<View className="relative">
					<View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
						<Ionicons
							name="mail-outline"
							size={20}
							color={colorScheme.get() === 'dark' ? '#9CA3AF' : '#9CA3AF'}
						/>
					</View>
					<Input
						placeholder="Enter your email"
						value={email}
						onChangeText={(text) => {
							setEmail(text);
							setError('');
						}}
						keyboardType="email-address"
						autoCapitalize="none"
						autoComplete="email"
						editable={!isLoading}
						className="pl-12 h-14 text-base text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
						returnKeyType="done"
						onSubmitEditing={handleSubmit}
					/>
				</View>

				<Button onPress={handleSubmit} disabled={isLoading} className="h-14">
					{isLoading ? (
						<View className="flex-row items-center gap-2">
							<ActivityIndicator size="small" color="white" />
							<Text className="text-white font-semibold">Please wait...</Text>
						</View>
					) : (
						<Text className="text-white font-semibold text-base">Continue</Text>
					)}
				</Button>
			</View>
		</View>
	);
};
