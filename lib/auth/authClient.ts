import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import {
  usernameClient,
  passkeyClient,
  anonymousClient,
  oneTapClient,
  emailOTPClient
} from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: process.env.EXPO_PUBLIC_BETTER_AUTH_SCHEME,
      storagePrefix: process.env.EXPO_PUBLIC_STORAGE_PREFIX,
      storage: SecureStore,
    }),
    usernameClient(),
    // TODO: Expo passkey client from expo-passkey, else this won't work on RN
    passkeyClient(),
    anonymousClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    }),
    emailOTPClient(),

  ]
});
