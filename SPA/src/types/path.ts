import z from 'zod'

export const zPath = z.object({
  id: z.string(),
  truckId: z.string(),
  startWarehouse: z.string(),
  endWarehouse: z.string(),
  distance: z.number(),
  time: z.number(),
  batteryConsumption: z.number(),
})

export const zPathForm = z.object({
  truckId: z.string().min(3),
  startWarehouse: z.string().regex(/^[a-zA-Z0-9]{3}$/),
  endWarehouse: z.string().regex(/^[a-zA-Z0-9]{3}$/),
  distance: z.number(),
  time: z.number(),
  batteryConsumption: z.number(),
})

export const zPaths = z.array(zPath)
export type Path = z.infer<typeof zPath>
export type PathForm = z.infer<typeof zPathForm>
