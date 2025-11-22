import {
	checkHasPasswordResponseSchema,
	checkHasPasswordSchema,
	setPasswordSchema,
} from '@/lib/schema/auth';
import { createApiHandler } from '@/lib/utils/handlers';
import { apiEndpoints } from '../apiEndpoints';

export const checkHasPassword = createApiHandler({
	method: 'POST',
	baseUrl: process.env.EXPO_PUBLIC_AUTH_API_URL,
	path: apiEndpoints.server.checkHasPassword,
	input: checkHasPasswordSchema,
	output: checkHasPasswordResponseSchema,
});

export const setPassword = createApiHandler({
	method: 'POST',
	baseUrl: process.env.EXPO_PUBLIC_AUTH_API_URL,
	path: apiEndpoints.server.setPassword,
	input: setPasswordSchema,
	auth: true,
});
