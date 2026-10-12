import z from 'zod';
import { ZodIssueCode } from 'zod/v3';

// trim + lowercase first, then validate, so "  Asha@Example.COM " and "asha@example.com" are the
// same account. Unique lookups in MySQL are also case-insensitive (utf8mb4_0900_ai_ci).
const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Email must be at most 254 characters')
  .pipe(z.email('Enter a valid email address'));

const name = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(100, `${label} must be at most 100 characters`);

export const createUserSchema = z
  .strictObject({
    firstName: name('First name'),
    lastName: name('Last name'),
    email: email,
    password: z
      .string()
      .min(8, 'Password must contain at least 12 characters')
      .max(15, 'Password must not exceed 128 characters'),
    password_confirmation: z.string(),
    mobileNumber: z
      .string()
      .trim()
      .regex(
        /^\+[1-9]\d{6,14}$/,
        'Mobile number must be in E.164 format, e.g. +919876543210',
      ),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      });
    }
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;
