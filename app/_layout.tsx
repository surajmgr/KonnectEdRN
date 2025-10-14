import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalHost } from "@rn-primitives/portal";
import { Toasts } from '@backpackapp-io/react-native-toast';

import './global.css';
import { ThemeProvider } from "@/wrappers/ThemeProvider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView className="flex-1 justify-center items-center">
          {/* <StatusBar style="auto" /> */}
          <SafeAreaView className="flex-1">
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaView>
          <PortalHost />
          <Toasts />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
