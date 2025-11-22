export function getErrorMessage(error: unknown, defaultMessage = 'Something went wrong'): string {
	if (error instanceof Error && typeof error.message === 'string') {
		return error.message;
	}

	if (
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message;
	}

	if (typeof error === 'string') {
		return error;
	}

	return defaultMessage;
}
