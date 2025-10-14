import z from 'zod';

export const checkHasPasswordSchema = z.object({
  email: z.string().email(),
});
export const checkHasPasswordResponseSchema = z.boolean();

export const setPasswordSchema = z.object({
  newPassword: z.string(),
})

export type CheckHasPasswordSchema = z.infer<typeof checkHasPasswordSchema>;
export type SetPasswordSchema = z.infer<typeof setPasswordSchema>;

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

export const signUpPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  otp: z.string().length(6, 'Please enter the complete 6-digit code'),
});

export type EmailFormData = z.infer<typeof emailSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type SignUpPasswordFormData = z.infer<typeof signUpPasswordSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
