import z from 'zod'

export const zPackaging = z.object({
  id: z.string(),
  deliveryId: z.string(),
  xposition: z.number(),
  yposition: z.number(),
  zposition: z.number(),
  loadingTime: z.number(),
  withdrawingTime: z.number(),
})

export const zPackagingForm = z.object({
  deliveryId: z.string().regex(/^[a-zA-Z0-9]{4}$/, 'Invalid pattern'),
  xposition: z.number().min(0).max(10),
  yposition: z.number().min(0).max(20),
  zposition: z.number().min(0).max(8),
})

export const zPackagings = z.array(zPackaging)
export type Packaging = z.infer<typeof zPackaging>
export type PackagingForm = z.infer<typeof zPackagingForm>
