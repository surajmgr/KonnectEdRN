import { toast } from '@backpackapp-io/react-native-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session, User } from 'better-auth';
import { type Route, router } from 'expo-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authClient } from '@/lib/auth/authClient';
import { getErrorMessage } from '@/lib/utils/error';

interface AuthState {
	user: User | null;
	session: Session | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	// Actions
	logout: () => Promise<void>;
	checkSession: () => Promise<void>;
	setUser: (user: User | null) => void;

	// New Auth Actions
	signInWithPassword: (args: {
		email: string;
		password: string;
		callbackUrl?: Route;
	}) => Promise<unknown>;
	signUpWithPassword: (args: {
		email: string;
		password: string;
		name?: string;
		callbackUrl?: Route;
	}) => Promise<unknown>;
	sendVerificationOTP: (args: {
		email: string;
		type: 'sign-in' | 'email-verification' | 'forget-password';
		turnstileToken: string;
	}) => Promise<unknown>;
	signInWithEmailOTP: (args: {
		email: string;
		otp: string;
		callbackUrl?: Route;
		turnstileToken: string;
	}) => Promise<unknown>;
	signInWithGoogle: (args: { callbackUrl?: Route }) => Promise<unknown>;
	signInWithPasskey: (args: { callbackUrl?: Route }) => Promise<unknown>;
	registerPasskey: () => Promise<unknown>;
	signInAnonymously: (args: { callbackUrl?: Route }) => Promise<unknown>;
}

const HomeRoute: Route = '/';

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			session: null,
			isAuthenticated: false,
			isLoading: true,

			logout: async () => {
				set({ isLoading: true });
				try {
					await authClient.signOut();
					set({ user: null, session: null, isAuthenticated: false });
					router.replace('/(auth)/login');
					toast.success('Logged out successfully');
				} catch (_error) {
					toast.error('Failed to logout');
				} finally {
					set({ isLoading: false });
				}
			},

			checkSession: async () => {
				try {
					const { data } = await authClient.getSession();
					if (data) {
						set({
							user: data.user,
							session: data.session,
							isAuthenticated: true,
						});
					} else {
						set({ user: null, session: null, isAuthenticated: false });
					}
				} catch (_error) {
					set({ user: null, session: null, isAuthenticated: false });
				} finally {
					set({ isLoading: false });
				}
			},

			setUser: (user) => set({ user, isAuthenticated: !!user }),

			signInWithPassword: async ({ email, password, callbackUrl = '/' }) => {
				set({ isLoading: true });
				try {
					const { data, error } = await authClient.signIn.email({
						email,
						password,
					});

					if (error) throw error;

					if (data) {
						await get().checkSession();
						router.replace(callbackUrl);
					}
					return data;
				} catch (error) {
					const message = getErrorMessage(
						error,
						'Failed to sign in. Please check your credentials.'
					);
					toast.error(message);
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			signUpWithPassword: async ({ email, password, name, callbackUrl = '/' }) => {
				set({ isLoading: true });
				try {
					const { data, error } = await authClient.signUp.email({
						email,
						password,
						name: name || email.split('@')[0],
					});

					if (error) throw error;

					if (data) {
						await get().checkSession();
						router.replace(callbackUrl);
					}
					return data;
				} catch (error) {
					const message = getErrorMessage(error, 'Failed to sign up. Please try again.');
					toast.error(message);
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			sendVerificationOTP: async ({ email, type, turnstileToken }) => {
				set({ isLoading: true });
				try {
					const { data, error } = await authClient.emailOtp.sendVerificationOtp({
						email,
						type,
						fetchOptions: {
							headers: {
								'x-captcha-response': turnstileToken,
							},
						},
					});

					if (error) throw error;
					return data;
				} catch (error) {
					const message = getErrorMessage(error, 'Failed to send verification code.');
					toast.error(message);
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			signInWithEmailOTP: async ({ email, otp, turnstileToken, callbackUrl = '/' }) => {
				set({ isLoading: true });
				try {
					const { data, error } = await authClient.signIn.emailOtp({
						email,
						otp,
						fetchOptions: {
							headers: {
								'x-captcha-response': turnstileToken,
							},
						},
					});

					if (error) throw error;

					if (data) {
						await get().checkSession();
						router.replace(callbackUrl);
					}
					return data;
				} catch (error) {
					const message = getErrorMessage(error, 'Invalid verification code.');
					toast.error(message);
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			signInWithGoogle: async ({ callbackUrl = HomeRoute } = {}) => {
				set({ isLoading: true });
				try {
					const { data, error } = await authClient.signIn.social({
						provider: 'google',
						callbackURL: callbackUrl,
					});

					if (error) throw error;

					if (data) {
						await get().checkSession();
					}
					return data;
				} catch (error) {
					const message = getErrorMessage(error, 'Failed to sign in with Google.');
					toast.error(message);
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			signInWithPasskey: async ({ callbackUrl = HomeRoute } = {}) => {
				set({ isLoading: true });
				try {
					const { data, error } = await authClient.signIn.passkey();

					if (error) throw error;

					if (data) {
						await get().checkSession();
						router.replace(callbackUrl);
					}
					return data;
				} catch (error) {
					const message = getErrorMessage(error, 'Failed to sign in with Passkey.');
					toast.error(message);
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			registerPasskey: async () => {
				const notifToast = toast.loading('Adding Passkey...');
				const result = await authClient.passkey.addPasskey({
					fetchOptions: {
						onSuccess: () => {
							toast.success('Passkey added', { id: notifToast });
						},
						onError: () => {
							toast.error('Failed to add Passkey', { id: notifToast });
						},
					},
				});

				if (!result) return null;

				const { data, error } = result;
				if (error) throw error;
				return data;
			},

			signInAnonymously: async ({ callbackUrl = HomeRoute } = {}) => {
				set({ isLoading: true });
				try {
					const { data, error } = await authClient.signIn.anonymous();

					if (error) throw error;

					if (data) {
						await get().checkSession();
						router.replace(callbackUrl);
					}
					return data;
				} catch (error) {
					const message = getErrorMessage(error, 'Failed to sign in anonymously.');
					toast.error(message);
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				user: state.user,
				session: state.session,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);
