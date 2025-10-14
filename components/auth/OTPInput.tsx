import React, { useRef } from 'react';
import { View, TextInput, Keyboard } from 'react-native';
import { Input } from '@/components/ui/input';

interface OTPInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  disabled?: boolean;
}

export const OTPInput = ({ otp, setOtp, disabled = false }: OTPInputProps) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between gap-2">
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          editable={!disabled}
          className="flex-1 h-16 text-center text-2xl font-bold"
          returnKeyType={index === 5 ? 'done' : 'next'}
          onSubmitEditing={() => {
            if (index < 5) {
              inputRefs.current[index + 1]?.focus();
            } else {
              Keyboard.dismiss();
            }
          }}
        />
      ))}
    </View>
  );
};
