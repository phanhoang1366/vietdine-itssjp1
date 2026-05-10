import { z } from 'zod';

// ─── User Types ───────────────────────────────────────────────
export type RoleId = 1 | 2 | 3; // 1: Customer, 2: Owner, 3: Guest

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string; // hashed
  roleId: RoleId;
  restaurantName?: string; // Only for owners
  createdAt: Date;
}

export interface SafeUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: RoleId;
  restaurantName?: string;
  avatarUrl?: string | null;
  createdAt?: Date;
}

export interface SessionPayload {
  userId: number;
  roleId: RoleId;
  expiresAt: Date;
}

// ─── Form State for useActionState ────────────────────────────
export type FormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
      redirectUrl?: string;
    }
  | undefined;

// ─── Zod Schemas ──────────────────────────────────────────────
export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'validation_email_req' })
    .email({ message: 'validation_email_invalid' }),
  password: z
    .string()
    .min(1, { message: 'validation_password_req' }),
});

const signupBaseFields = {
  name: z
    .string()
    .min(2, { message: 'validation_name_min' })
    .trim(),
  email: z
    .string()
    .min(1, { message: 'validation_email_req' })
    .email({ message: 'validation_email_invalid' })
    .trim(),
  phone: z
    .string()
    .min(1, { message: 'validation_phone_req' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'validation_password_min' })
    .regex(/[a-zA-Z]/, { message: 'validation_alpha' })
    .regex(/[0-9]/, { message: 'validation_number' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'validation_confirm_req' }),
};

const passwordMatchRefine = {
  validate: (data: { password: string; confirmPassword: string }) =>
    data.password === data.confirmPassword,
  message: 'validation_match' as const,
  path: ['confirmPassword'] as const,
};

export const SignupFormSchema = z.object(signupBaseFields).refine(
  passwordMatchRefine.validate,
  { message: passwordMatchRefine.message, path: [...passwordMatchRefine.path] }
);

export const OwnerSignupFormSchema = z.object({
  ...signupBaseFields,
  restaurantName: z
    .string()
    .min(1, { message: 'validation_res_name_req' })
    .trim(),
}).refine(
  passwordMatchRefine.validate,
  { message: passwordMatchRefine.message, path: [...passwordMatchRefine.path] }
);

export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'validation_password_req' }),
  newPassword: z
    .string()
    .min(8, { message: 'validation_password_min' })
    .regex(/[a-zA-Z]/, { message: 'validation_alpha' })
    .regex(/[0-9]/, { message: 'validation_number' }),
  confirmNewPassword: z
    .string()
    .min(1, { message: 'validation_confirm_req' }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'validation_match',
  path: ['confirmNewPassword'],
});

export const ProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'validation_name_min' })
    .trim(),
  phone: z
    .string()
    .min(1, { message: 'validation_phone_req' })
    .trim(),
});
