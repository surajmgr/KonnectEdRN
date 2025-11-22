import axios from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add token
apiClient.interceptors.request.use(
	async (config) => {
		// If we need to manually inject token.
		// BetterAuth might handle this via cookies or headers if configured.
		// For now, let's assume we might need to grab it from store if available.
		const session = useAuthStore.getState().session;
		if (session?.token) {
			config.headers.Authorization = `Bearer ${session.token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Handle 401 Unauthorized
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			// Trigger logout or refresh token flow here
			// useAuthStore.getState().logout();
		}

		return Promise.reject(error);
	}
);
