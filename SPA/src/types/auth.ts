import { z } from 'zod'

export const zLogin = z.object({
  mail: z.string().email('Invalid email provided.'),
  password: z.string().min(5, 'Password format is not valid.'),
})

export const zRole = z.enum([
  'admin',
  'warehouse-manager',
  'logistics-manager',
  'fleet-manager',
])

export const zUser = z.object({
  mail: z.string(),
  role: zRole,
  name: z.string(),
  phoneNumber: z.string(),
  status: z.literal('active').or(z.literal('deleted')),
})

export const zUserForm = z.object({
  mail: z.string().email(),
  role: zRole,
  name: z
    .string()
    .regex(/^[A-Z][a-z]+(\s[A-Z][a-z]+){1,}$/, 'Invalid name format'),
  password: z.string().min(5, 'Password must be at least 5 characters long.'),
  phoneNumber: z
    .string()
    .regex(
      /^\+[0-9]{2,3}-[0-9]{9}$/,
      'Invalid phone format. Use +351-123456789'
    ),
})

export const zUsers = z.array(zUser)

export type Login = z.infer<typeof zLogin>
export type User = z.infer<typeof zUser>
export type UserForm = z.infer<typeof zUserForm>
export type Users = z.infer<typeof zUsers>
export type Role = z.infer<typeof zRole>
export const roles = zRole.options
