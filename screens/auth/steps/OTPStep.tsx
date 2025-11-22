import { toast } from '@backpackapp-io/react-native-toast';
import { Ionicons } from '@expo/vector-icons';
import type { Route } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { OTPInput } from '@/components/auth/OTPInput';
import { Turnstile, type TurnstileRef } from '@/components/auth/Turnstile';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { otpSchema } from '@/lib/schema/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { getErrorMessage } from '@/lib/utils/error';

interface OTPStepProps {
	email: string;
	callbackUrl: Route;
	onBack: () => void;
	onSuccess: (promptSetPassword: boolean) => void;
}

export const OTPStep = ({ email, callbackUrl, onBack, onSuccess }: OTPStepProps) => {
	const { sendVerificationOTP, signInWithEmailOTP } = useAuthStore();
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const [isLoading, setIsLoading] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [error, setError] = useState('');
	const [resendTimer, setResendTimer] = useState(0);
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

	const turnstileRef = useRef<TurnstileRef>(null);

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [resendTimer]);

	const consumeTurnstileToken = () => {
		setTurnstileToken(null);
		turnstileRef.current?.reset();
	};

	const handleSendOTP = async () => {
		if (!turnstileToken) {
			setError('Please complete the CAPTCHA verification.');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			await sendVerificationOTP({ email, type: 'sign-in', turnstileToken });
			setOtpSent(true);
			setResendTimer(60);
			toast.success('Verification code sent! Check your email.');
		} catch (error) {
			// Store handles toast, we handle local error state
			const errorMessage = getErrorMessage(error);
			setError(errorMessage);
		} finally {
			setIsLoading(false);
			consumeTurnstileToken();
		}
	};

	const handleOtpVerification = async () => {
		const otpValue = otp.join('');
		setError('');

		const validation = otpSchema.safeParse({ otp: otpValue });
		if (!validation.success) {
			setError(validation.error.errors[0].message);
			return;
		}

		if (!turnstileToken) {
			setError('Please complete the CAPTCHA verification.');
			return;
		}

		setIsLoading(true);

		try {
			await signInWithEmailOTP({ email, otp: otpValue, turnstileToken, callbackUrl });
			toast.success('Signed in successfully!');
			onSuccess(true);
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			setError(errorMessage);
			setOtp(['', '', '', '', '', '']);
		} finally {
			setIsLoading(false);
			consumeTurnstileToken();
		}
	};

	const handleResendOTP = async () => {
		if (resendTimer > 0) return;

		if (!turnstileToken) {
			setError('Please complete the CAPTCHA verification.');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			await sendVerificationOTP({ email, type: 'sign-in', turnstileToken });
			setResendTimer(60);
			setOtp(['', '', '', '', '', '']);
			toast.success('New code sent!');
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			setError(errorMessage);
		} finally {
			setIsLoading(false);
			consumeTurnstileToken();
		}
	};

	return (
		<View className="gap-6">
			<Button variant="ghost" onPress={onBack} disabled={isLoading} className="self-start -ml-2">
				<View className="flex-row items-center gap-2">
					<Ionicons name="arrow-back" size={18} />
					<Text className="text-base">Back</Text>
				</View>
			</Button>

			{error && (
				<View className="bg-red-50 border border-red-200 p-4 rounded-xl">
					<Text className="text-red-800 text-sm font-medium">{error}</Text>
				</View>
			)}

			<Turnstile ref={turnstileRef} onTokenReceived={setTurnstileToken} />

			{!otpSent ? (
				<View className="items-center gap-6 mt-2">
					<Text className="text-center text-gray-600 text-base leading-6">
						We'll send a 6-digit code to{' '}
						<Text className="font-semibold text-gray-900">{email}</Text> for verification.
					</Text>
					<Button onPress={handleSendOTP} disabled={isLoading} className="w-full h-14">
						{isLoading ? (
							<View className="flex-row items-center gap-2">
								<ActivityIndicator size="small" color="white" />
								<Text className="text-white font-semibold">Sending...</Text>
							</View>
						) : (
							<Text className="text-white font-semibold text-base">Send verification code</Text>
						)}
					</Button>
				</View>
			) : (
				<View className="gap-6 mt-4">
					<OTPInput otp={otp} setOtp={setOtp} disabled={isLoading} />

					<Button
						onPress={handleOtpVerification}
						disabled={isLoading || otp.join('').length < 6 || !turnstileToken}
						className="w-full h-14"
					>
						{isLoading ? (
							<View className="flex-row items-center gap-2">
								<ActivityIndicator size="small" color="white" />
								<Text className="text-white font-semibold">Verifying...</Text>
							</View>
						) : (
							<Text className="text-white font-semibold text-base">Verify Code</Text>
						)}
					</Button>

					<View className="items-center">
						<Text
							className={`text-base font-medium ${
								resendTimer > 0 || isLoading || !turnstileToken ? 'text-gray-400' : 'text-blue-600'
							}`}
							onPress={handleResendOTP}
							disabled={resendTimer > 0 || isLoading || !turnstileToken}
						>
							{resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
						</Text>
					</View>
				</View>
			)}
		</View>
	);
};
