import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
})

export const signUpSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
})

export const resetPasswordSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
})

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters long',
      })
      .max(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })