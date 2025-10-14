import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import { Text } from '@/components/ui/text';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onHide: () => void;
}

export const Toast = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}: ToastProps) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  const bgColor = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    info: 'bg-blue-50',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: AlertCircle,
  }[type];

  const iconColor = {
    success: '#166534',
    error: '#991B1B',
    info: '#1E40AF',
  }[type];

  return (
    <Animated.View
      style={{ opacity }}
      className="absolute top-12 left-4 right-4 z-50"
    >
      <View className={`${bgColor} rounded-lg p-4 shadow-lg flex-row items-center gap-3`}>
        <Icon size={20} color={iconColor} />
        <Text className={`${textColor} flex-1`}>{message}</Text>
      </View>
    </Animated.View>
  );
};
