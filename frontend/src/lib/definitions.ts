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
    }
  | undefined;

// ─── Zod Schemas ──────────────────────────────────────────────
export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: '有効なメールアドレスを入力してください' }),
  password: z
    .string()
    .min(1, { message: 'パスワードを入力してください' }),
});

const signupBaseFields = {
  name: z
    .string()
    .min(2, { message: '名前は2文字以上で入力してください' })
    .trim(),
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: '有効なメールアドレスを入力してください' })
    .trim(),
  phone: z
    .string()
    .min(1, { message: '電話番号を入力してください' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'パスワードは8文字以上で入力してください' })
    .regex(/[a-zA-Z]/, { message: 'アルファベットを含めてください' })
    .regex(/[0-9]/, { message: '数字を含めてください' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'パスワード（確認用）を入力してください' }),
};

const passwordMatchRefine = {
  validate: (data: { password: string; confirmPassword: string }) =>
    data.password === data.confirmPassword,
  message: 'パスワードが一致しません' as const,
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
    .min(1, { message: 'レストラン名を入力してください' })
    .trim(),
}).refine(
  passwordMatchRefine.validate,
  { message: passwordMatchRefine.message, path: [...passwordMatchRefine.path] }
);

export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: '現在のパスワードを入力してください' }),
  newPassword: z
    .string()
    .min(8, { message: '新しいパスワードは8文字以上で入力してください' })
    .regex(/[a-zA-Z]/, { message: 'アルファベットを含めてください' })
    .regex(/[0-9]/, { message: '数字を含めてください' }),
  confirmNewPassword: z
    .string()
    .min(1, { message: '確認用パスワードを入力してください' }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmNewPassword'],
});

export const ProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: '名前は2文字以上で入力してください' })
    .trim(),
  phone: z
    .string()
    .min(1, { message: '電話番号を入力してください' })
    .trim(),
});
