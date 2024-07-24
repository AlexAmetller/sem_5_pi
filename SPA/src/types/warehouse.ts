import z from 'zod'

export const zWarehouse = z.object({
  enabled: z.boolean(),
  code: z.string().regex(/^[a-zA-Z0-9]{3}$/, 'Invalid pattern'),
  description: z.string().min(1).max(50),
  address: z.object({
    street: z.string().min(10).max(50),
    postalCode: z.string().regex(/^[0-9]{4}-[0-9]{3}$/, 'Invalid pattern'),
    city: z.string().min(3).max(50),
    country: z.string().min(3).max(50),
  }),
  coordinates: z.object({
    latitude: z.number().min(-180).max(180),
    longitude: z.number().min(-90).max(90),
  }),
})

export const zWarehouses = z.array(zWarehouse)
export type Warehouse = z.infer<typeof zWarehouse>
