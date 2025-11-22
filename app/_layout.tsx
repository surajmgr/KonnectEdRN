import { Toasts } from '@backpackapp-io/react-native-toast';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/wrappers/ThemeProvider';

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<ErrorBoundary>
					<SafeAreaProvider>
						<GestureHandlerRootView className="flex-1">
							{/* <StatusBar style="auto" /> */}
							<Stack>
								<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
								<Stack.Screen name="(auth)" options={{ headerShown: false }} />
							</Stack>
							<PortalHost />
							<Toasts />
						</GestureHandlerRootView>
					</SafeAreaProvider>
				</ErrorBoundary>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
