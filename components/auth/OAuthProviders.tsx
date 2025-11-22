import React from 'react';
import { View, useColorScheme } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { AntDesign, Ionicons } from '@expo/vector-icons';

interface OAuthProvidersProps {
  onGoogleClick: () => void;
  onPasskeyClick: () => void;
  onAnonymousClick: () => void;
  isLoading: boolean;
}

export const OAuthProviders = ({
  onGoogleClick,
  onPasskeyClick,
  onAnonymousClick,
  isLoading,
}: OAuthProvidersProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="gap-3">
      {/* Google Sign-In */}
      <Button
        variant="outline"
        onPress={onGoogleClick}
        disabled={isLoading}
        className="h-12 flex flex-row items-center justify-center gap-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
      >
        <AntDesign name="google" size={24} color={isDark ? 'white' : 'black'} />
        <Text className="text-gray-900 dark:text-gray-100 font-medium">
          Continue with Google
        </Text>
      </Button>

      {/* Passkey Sign-In */}
      <Button
        variant="outline"
        onPress={onPasskeyClick}
        disabled={isLoading}
        className="h-12 flex flex-row items-center justify-center gap-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
      >
        <Ionicons name="key-outline" size={20} color={isDark ? 'white' : 'black'} />
        <Text className="text-gray-900 dark:text-gray-100 font-medium">
          Continue with Passkey
        </Text>
      </Button>

      {/* Optional Guest Mode */}
      {false && (
        <Button
          variant="outline"
          onPress={onAnonymousClick}
          disabled={isLoading}
          className="h-12 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
        >
          <Text className="text-gray-900 dark:text-gray-100 font-medium">
            Continue as Guest
          </Text>
        </Button>
      )}
    </View>
  );
};
